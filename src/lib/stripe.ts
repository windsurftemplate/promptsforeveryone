import { loadStripe, Stripe } from '@stripe/stripe-js';

// Get the Stripe Publishable Key from environment variables
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Initialize Stripe promise
let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    if (!STRIPE_PUBLISHABLE_KEY) {
      console.error('Stripe publishable key is missing. Please check your environment variables.');
      return Promise.reject(new Error('Stripe publishable key is missing'));
    }
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// Function to handle redirecting to Stripe Checkout
export const redirectToCheckout = async (priceId: string, userId: string) => {
  // Validate inputs
  if (!priceId) {
    throw new Error('Price ID is required');
  }
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    // Get Stripe instance
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Failed to initialize Stripe');
    }

    // Create checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    const { sessionId } = await response.json();

    // Redirect to checkout
    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
};
