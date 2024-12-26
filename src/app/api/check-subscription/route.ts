import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getAdminDB } from '@/lib/firebase-admin';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not configured in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia'
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, email } = body;

    console.log('Checking subscription for user:', { userId, email: email ? '[REDACTED]' : undefined });

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get Firebase Admin database instance
    const db = getAdminDB();
    if (!db) {
      console.error('Firebase Admin database connection not initialized');
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }

    // Fetch user data from Firebase
    const userRef = db.ref(`users/${userId}`);
    const snapshot = await userRef.get();
    const userData = snapshot.val() || {};

    console.log('User data from Firebase:', {
      ...userData,
      email: userData?.email ? '[REDACTED]' : undefined,
      hasStripeCustomerId: !!userData?.stripeCustomerId
    });

    let subscription = null;

    // First, try to get subscription by existing customer ID
    if (userData?.stripeCustomerId) {
      try {
        console.log('Checking subscriptions for existing customer:', userData.stripeCustomerId);
        const subscriptions = await stripe.subscriptions.list({
          customer: userData.stripeCustomerId,
          limit: 1,
          status: 'active',
          expand: ['data.latest_invoice']
        });

        if (subscriptions.data.length > 0) {
          subscription = subscriptions.data[0];
          console.log('Found active subscription:', {
            id: subscription.id,
            status: subscription.status
          });
        }
      } catch (error) {
        console.error('Error fetching subscription by customer ID:', error);
      }
    }

    // If no subscription found and email provided, try to find by email
    if (!subscription && email) {
      try {
        console.log('Searching for customer by email');
        const customers = await stripe.customers.list({
          email: email,
          limit: 1,
          expand: ['data.subscriptions']
        });

        if (customers.data.length > 0) {
          const customer = customers.data[0];
          console.log('Found customer by email:', customer.id);

          // Update user's customer ID in Firebase
          await userRef.update({
            stripeCustomerId: customer.id,
            updatedAt: new Date().toISOString()
          });

          // Check for active subscriptions
          const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            limit: 1,
            status: 'active'
          });

          if (subscriptions.data.length > 0) {
            subscription = subscriptions.data[0];
            console.log('Found active subscription for customer:', {
              id: subscription.id,
              status: subscription.status
            });
          }
        }
      } catch (error) {
        console.error('Error searching for customer by email:', error);
      }
    }

    // If we found a subscription, update user data
    if (subscription) {
      const updatedData = {
        ...userData,
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        stripeSubscriptionStatus: subscription.status,
        plan: subscription.status === 'active' ? 'pro' : 'free',
        updatedAt: new Date().toISOString()
      };

      console.log('Updating user data:', {
        plan: updatedData.plan,
        status: updatedData.stripeSubscriptionStatus
      });

      await userRef.set(updatedData);
    } else {
      console.log('No active subscription found');
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error checking subscription:', error);
    return NextResponse.json({
      error: 'Error checking subscription',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
