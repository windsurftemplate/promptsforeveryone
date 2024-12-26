import { loadStripe } from '@stripe/stripe-js';

// Get the Stripe Publishable Key from environment variables
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
console.log('Stripe Publishable Key:', STRIPE_PUBLISHABLE_KEY ? 'Present' : 'Missing');

// Check if the Stripe key is provided
if (!STRIPE_PUBLISHABLE_KEY) {
  console.error('Stripe publishable key is missing');
}

// Load Stripe using the provided publishable key
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY || '');

// Function to handle redirecting to Stripe Checkout
export const redirectToCheckout = async (priceId: string, userId: string) => {
  // Validate that the priceId and userId are provided
  if (!priceId) {
    console.error('Price ID validation failed');
    throw new Error('Stripe price ID is missing');
  }

  if (!userId) {
    console.error('User ID validation failed');
    throw new Error('User ID is required for checkout');
  }

  try {
    // Log the price and user IDs for debugging
    console.log('Starting redirectToCheckout...');
    console.log('- Price ID:', priceId);
    console.log('- User ID:', userId);

    // Ensure that Stripe has been loaded successfully
    const stripe = await stripePromise;
    if (!stripe) {
      console.error('Stripe initialization failed');
      throw new Error('Stripe failed to initialize. Check if your publishable key is correct.');
    }
    console.log('Stripe loaded successfully');

    // Create the checkout session by calling your backend
    console.log('Creating checkout session...');
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,  // The price ID for the product being purchased
        userId,   // The ID of the user making the purchase
      }),
    });

    // Parse the response from the backend
    const data = await response.json();
    if (!response.ok) {
      console.error('Failed to create checkout session:', data.error || 'Unknown error');
      throw new Error(data.error || 'Failed to create checkout session');
    }
    console.log('Session created successfully:', data.sessionId);

    // Redirect to Stripe Checkout with the session ID
    const { error } = await stripe.redirectToCheckout({
      sessionId: data.sessionId,
    });

    // Handle any error during the redirect to checkout
    if (error) {
      console.error('Stripe checkout error:', error.message);
      throw error;
    }
    console.log('Redirected to checkout successfully');
  } catch (error) {
    // Catch any errors during the checkout process and log them
    console.error('Error in redirectToCheckout:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    throw error;  // Rethrow the error to propagate it up if needed
  }
};
