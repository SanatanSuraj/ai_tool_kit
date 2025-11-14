import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { stripe, getOrCreateStripeCustomer } from '@/lib/stripe';
import connectDB from '@/lib/mongodb';
import Subscription from '@/models/Subscription';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const subscription = await Subscription.findOne({
      userId: session.user.id,
    });

    if (!subscription || !subscription.stripeCustomerId) {
      // Create customer if doesn't exist
      const customerId = await getOrCreateStripeCustomer(
        session.user.id,
        session.user.email
      );
      
      // Create billing portal session
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${request.nextUrl.origin}/`,
      });

      return NextResponse.json({ url: portalSession.url });
    }

    // Create billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${request.nextUrl.origin}/`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create portal session' },
      { status: 500 }
    );
  }
}

