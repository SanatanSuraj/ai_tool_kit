import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { stripe, STRIPE_PRICE_IDS, getOrCreateStripeCustomer } from '@/lib/stripe';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { priceId, planType } = body; // planType: 'golden', etc.

    if (!priceId && !planType) {
      return NextResponse.json(
        { error: 'Price ID or plan type is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(
      session.user.id,
      session.user.email
    );

    // Determine price ID
    let finalPriceId = priceId;
    if (!finalPriceId && planType) {
      // Default to monthly if not specified
      finalPriceId = STRIPE_PRICE_IDS[planType as keyof typeof STRIPE_PRICE_IDS]?.monthly;
    }

    if (!finalPriceId) {
      return NextResponse.json(
        { error: 'Invalid plan type or price ID' },
        { status: 400 }
      );
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/?success=true`,
      cancel_url: `${request.nextUrl.origin}/pricing?canceled=true`,
      metadata: {
        userId: session.user.id,
        planType: planType || 'unknown',
      },
    });

    return NextResponse.json({ 
      url: checkoutSession.url,
      sessionId: checkoutSession.id 
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    
    // Provide user-friendly error messages
    let errorMessage = 'Failed to create checkout session';
    if (error.message?.includes('Invalid API Key')) {
      errorMessage = 'Stripe API key is invalid. Please check your STRIPE_SECRET_KEY in .env.local file.';
    } else if (error.message?.includes('No such price')) {
      errorMessage = 'Invalid price ID. Please check your STRIPE_PRICE_ID_GOLDEN_MONTHLY in .env.local file.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

