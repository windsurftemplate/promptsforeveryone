import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { ref, get, update } from 'firebase/database';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user data from Firebase
    const userRef = ref(db, `users/${userId}`);
    const userSnapshot = await get(userRef);
    
    if (!userSnapshot.exists()) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userSnapshot.val();
    const stripeSubscriptionId = userData.stripeSubscriptionId;

    if (!stripeSubscriptionId) {
      return NextResponse.json(
        { message: 'No active subscription found' },
        { status: 400 }
      );
    }

    // Cancel the subscription in Stripe
    const subscription = await stripe.subscriptions.update(stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    // Update Firebase
    await update(userRef, {
      stripeCancelAtPeriodEnd: true,
      stripeSubscriptionStatus: subscription.status,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({
      message: 'Subscription cancelled successfully',
      subscription
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json(
      { message: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
} 