import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
console.log('Stripe Secret Key:', stripeSecretKey ? 'Present' : 'Missing');

if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY is not configured in environment variables');
  throw new Error('STRIPE_SECRET_KEY is not configured in environment variables');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
  typescript: true
});

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not properly initialized' }, { status: 500 });
  }

  try {
    const { priceId, userId } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    console.log('Creating checkout session...');
    console.log('- Price ID:', priceId);
    console.log('- User ID:', userId);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/dashboard`,
      cancel_url: `${req.headers.get('origin')}/dashboard`,
      client_reference_id: userId,
      metadata: {
        userId: userId
      }
    });

    console.log('Checkout session created:', session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ 
        error: `Stripe error: ${error.message}`,
        code: error.code,
        type: error.type
      }, { status: error.statusCode || 500 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
} 