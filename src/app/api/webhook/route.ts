import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase';
import { ref, set, get } from 'firebase/database';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not configured in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia'
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature') || '';

    if (!webhookSecret) {
      console.error('Webhook secret is not configured');
      return new NextResponse('Webhook secret is not configured', { status: 500 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new NextResponse('Webhook signature verification failed', { status: 400 });
    }

    console.log('Received Stripe webhook event:', event.type);
    console.log('Event data:', JSON.stringify(event.data.object, null, 2));

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const userId = session.client_reference_id;
        const subscriptionId = session.subscription as string;

        console.log('Processing completed checkout:', {
          customerId,
          userId,
          subscriptionId,
          sessionId: session.id,
          paymentStatus: session.payment_status
        });

        if (!userId) {
          console.error('No userId found in session');
          return new NextResponse('No userId found in session', { status: 400 });
        }

        try {
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          console.log('Subscription details:', subscription);

          // Get existing user data
          const userRef = ref(db, `users/${userId}`);
          const snapshot = await get(userRef);
          const existingData = snapshot.val() || {};

          console.log('Existing user data:', existingData);

          // Prepare updated user data
          const updatedData = {
            ...existingData,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripeSubscriptionStatus: subscription.status,
            plan: subscription.status === 'active' ? 'pro' : 'free',
            updatedAt: new Date().toISOString()
          };

          // Update user's subscription status in Firebase
          await set(userRef, updatedData);

          console.log('Successfully updated user subscription status:', {
            userId,
            plan: updatedData.plan,
            subscriptionId,
            status: subscription.status,
            updatedData
          });
        } catch (error) {
          console.error('Error updating user data in Firebase:', error);
          throw error;
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const status = subscription.status;

        console.log('Processing subscription update:', {
          customerId,
          status,
          subscriptionId: subscription.id
        });

        // Find user by stripeCustomerId
        const userRef = ref(db, 'users');
        const snapshot = await get(userRef);
        const users = snapshot.val();

        if (users) {
          const userId = Object.keys(users).find(
            key => users[key].stripeCustomerId === customerId
          );

          if (userId) {
            const userRef = ref(db, `users/${userId}`);
            const userSnapshot = await get(userRef);
            const existingData = userSnapshot.val() || {};

            // Update subscription status based on Stripe status
            const updatedData = {
              ...existingData,
              plan: status === 'active' ? 'pro' : 'free',
              stripeSubscriptionStatus: status,
              updatedAt: new Date().toISOString()
            };

            await set(userRef, updatedData);
            console.log('Updated subscription status:', {
              userId,
              status,
              updatedData
            });
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        console.log('Processing subscription deletion:', {
          customerId,
          subscriptionId: subscription.id
        });

        // Find user by stripeCustomerId
        const userRef = ref(db, 'users');
        const snapshot = await get(userRef);
        const users = snapshot.val();

        if (users) {
          const userId = Object.keys(users).find(
            key => users[key].stripeCustomerId === customerId
          );

          if (userId) {
            const userRef = ref(db, `users/${userId}`);
            const userSnapshot = await get(userRef);
            const existingData = userSnapshot.val() || {};

            // Update user's subscription status
            const updatedData = {
              ...existingData,
              plan: 'free',
              stripeSubscriptionId: null,
              stripeSubscriptionStatus: 'canceled',
              updatedAt: new Date().toISOString()
            };

            await set(userRef, updatedData);
            console.log('Subscription cancelled for user:', {
              userId,
              updatedData
            });
          }
        }
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return new NextResponse('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    return new NextResponse('Error processing webhook', { status: 500 });
  }
} 