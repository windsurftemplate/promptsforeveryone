export const runtime = 'edge';

import Stripe from 'stripe';
import { db } from '@/lib/firebase';
import { ref, set, query, orderByChild, get, update } from 'firebase/database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const userId = session.client_reference_id;

        if (!userId) {
          console.error('No user ID found in session:', session.id);
          return Response.json({ error: 'No user ID found' }, { status: 400 });
        }

        const timestamp = new Date().toISOString();
        const userRef = ref(db, `users/${userId}`);
        const versionRef = ref(db, `users/${userId}/versionHistory/${timestamp}`);

        // Get current user data for version tracking
        const userSnapshot = await get(userRef);
        const currentData = userSnapshot.val() || {};

        // Create version entry
        await set(versionRef, {
          previousState: {
            plan: currentData.plan || 'free',
            stripeSubscriptionStatus: currentData.stripeSubscriptionStatus || 'inactive'
          },
          newState: {
            plan: 'paid',
            stripeSubscriptionStatus: 'active'
          },
          source: 'stripe_webhook',
          event: 'checkout.session.completed',
          timestamp
        });

        // Update user's subscription status
        await update(userRef, {
          stripeCustomerId: customerId,
          plan: 'paid',
          stripeSubscriptionStatus: 'active',
          updatedAt: timestamp
        });

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user with this stripeCustomerId
        const usersRef = ref(db, 'users');
        const userQuery = query(usersRef, orderByChild('stripeCustomerId'));
        const snapshot = await get(userQuery);
        
        let userId: string | null = null;
        snapshot.forEach((child) => {
          if (child.val().stripeCustomerId === customerId) {
            userId = child.key;
          }
        });

        if (userId) {
          const timestamp = new Date().toISOString();
          const userRef = ref(db, `users/${userId}`);
          const versionRef = ref(db, `users/${userId}/versionHistory/${timestamp}`);

          // Get current user data for version tracking
          const userSnapshot = await get(userRef);
          const currentData = userSnapshot.val();

          // Create version entry
          await set(versionRef, {
            previousState: {
              plan: currentData.plan,
              stripeSubscriptionStatus: currentData.stripeSubscriptionStatus
            },
            newState: {
              plan: 'free',
              stripeSubscriptionStatus: 'canceled'
            },
            source: 'stripe_webhook',
            event: 'customer.subscription.deleted',
            timestamp
          });

          // Update user status
          await update(userRef, {
            plan: 'free',
            stripeSubscriptionStatus: 'canceled',
            updatedAt: timestamp
          });
        }

        break;
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 