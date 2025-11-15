import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    // Convert userId string to ObjectId for proper querying
    let userId: mongoose.Types.ObjectId | string = session.user.id;
    try {
      if (mongoose.Types.ObjectId.isValid(session.user.id)) {
        userId = new mongoose.Types.ObjectId(session.user.id);
      }
    } catch (error) {
      console.warn('Could not convert userId to ObjectId, using string:', error);
    }
    
    // Find subscription to get Stripe customer ID
    const subscription = await Subscription.findOne({
      userId: userId,
    });

    if (!subscription || !subscription.stripeCustomerId) {
      return NextResponse.json({
        invoices: [],
        message: 'No payment history found',
      });
    }

    try {
      // Fetch invoices from Stripe
      const invoices = await stripe.invoices.list({
        customer: subscription.stripeCustomerId,
        limit: 100, // Get last 100 invoices
      });

      // Format invoices for frontend
      const formattedInvoices = invoices.data.map((invoice) => {
        const amount = invoice.amount_paid / 100; // Convert from cents to dollars
        const currency = invoice.currency.toUpperCase();
        
        return {
          id: invoice.id,
          number: invoice.number,
          status: invoice.status,
          amount,
          currency,
          date: new Date(invoice.created * 1000).toISOString(),
          periodStart: invoice.period_start ? new Date(invoice.period_start * 1000).toISOString() : null,
          periodEnd: invoice.period_end ? new Date(invoice.period_end * 1000).toISOString() : null,
          invoicePdf: invoice.invoice_pdf,
          hostedInvoiceUrl: invoice.hosted_invoice_url,
          description: invoice.description || invoice.lines.data[0]?.description || 'Subscription payment',
        };
      });

      return NextResponse.json({
        invoices: formattedInvoices,
      });
    } catch (error: any) {
      console.error('Error fetching invoices from Stripe:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch payment history' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error fetching payment history:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch payment history' },
      { status: 500 }
    );
  }
}

