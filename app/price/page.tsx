'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { CheckIcon } from '@heroicons/react/24/outline';

const PRO_FEATURES = [
  "Everything in Free",
  "Advanced Prompt Creation",
  "Private Collections",
  "Priority Support",
  "AI Assistant Access",
  "Export Functionality",
  "Team Collaboration Tools",
  "Custom Branding",
  "Advanced Analytics",
  "API Access"
];

const FREE_FEATURES = [
  "Access to Community Prompts",
  "Basic Prompt Creation",
  "Community Support",
  "Public Collections",
  "Basic Analytics"
];

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleUpgrade = async (interval: 'month' | 'year') => {
    try {
      if (!user?.uid) {
        alert('Please sign in to upgrade to Pro.');
        router.push('/login');
        return;
      }

      const priceId = interval === 'month'
        ? process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_ID
        : process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY_ID;

      if (!priceId) {
        console.error('Stripe price ID is not configured');
        alert('Sorry, there was an error initiating the checkout. Please try again later.');
        return;
      }

      try {
        const { redirectToCheckout } = await import('@/lib/stripe');
        await redirectToCheckout(priceId, user.uid);
      } catch (checkoutError) {
        console.error('Checkout error:', checkoutError);
        alert('Failed to start checkout process. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Sorry, there was an error initiating the checkout. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#00ffff] mb-4">
            Pricing
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Start for free, upgrade if you need it
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-black/50 backdrop-blur-lg border border-[#00ffff]/10 rounded-xl p-8 hover:border-[#00ffff]/30 transition-all duration-300">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Free</h3>
              <div className="text-4xl font-bold text-[#00ffff] mb-4">$0</div>
              <p className="text-gray-400">Perfect for getting started</p>
            </div>
            <ul className="space-y-4 mb-8">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center text-gray-300">
                  <CheckIcon className="h-5 w-5 text-[#00ffff] mr-2 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => router.push('/register')}
              variant="outline"
              className="w-full border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff]/10"
            >
              Get Started
            </Button>
          </div>

          {/* Pro Monthly Plan */}
          <div className="bg-black/50 backdrop-blur-lg border-2 border-[#00ffff] rounded-xl p-8 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all duration-300 transform hover:scale-105 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-[#00ffff] text-black px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Pro Monthly</h3>
              <div className="text-4xl font-bold text-[#00ffff] mb-4">$9</div>
              <p className="text-gray-400">Everything you need</p>
            </div>
            <ul className="space-y-4 mb-8">
              {PRO_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center text-gray-300">
                  <CheckIcon className="h-5 w-5 text-[#00ffff] mr-2 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleUpgrade('month')}
              className="w-full bg-[#00ffff] hover:bg-[#00ffff]/90 text-black font-semibold"
            >
              Join Us
            </Button>
          </div>

          {/* Pro Yearly Plan */}
          <div className="bg-black/50 backdrop-blur-lg border border-[#00ffff]/10 rounded-xl p-8 hover:border-[#00ffff]/30 transition-all duration-300">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Pro Yearly</h3>
              <div className="text-4xl font-bold text-[#00ffff] mb-4">$89</div>
              <p className="text-gray-400">Save 17% yearly</p>
            </div>
            <ul className="space-y-4 mb-8">
              {PRO_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center text-gray-300">
                  <CheckIcon className="h-5 w-5 text-[#00ffff] mr-2 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleUpgrade('year')}
              className="w-full bg-[#00ffff] hover:bg-[#00ffff]/90 text-black font-semibold"
            >
              Join Us
            </Button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-24">
          <h2 className="text-3xl font-bold text-[#00ffff] mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-black/50 backdrop-blur-lg border border-[#00ffff]/10 rounded-xl p-6 hover:border-[#00ffff]/30 transition-colors">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-2">What's included in the Pro plan?</h3>
              <p className="text-gray-400">
                The Pro plan includes all features listed above, including advanced prompt creation, private collections, priority support, and more. You'll have access to advanced features and unlimited usage.
              </p>
            </div>
            <div className="bg-black/50 backdrop-blur-lg border border-[#00ffff]/10 rounded-xl p-6 hover:border-[#00ffff]/30 transition-colors">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-400">
                Yes, you can cancel your subscription at any time. You'll continue to have access to Pro features until the end of your billing period.
              </p>
            </div>
            <div className="bg-black/50 backdrop-blur-lg border border-[#00ffff]/10 rounded-xl p-6 hover:border-[#00ffff]/30 transition-colors">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-2">Is there a refund policy?</h3>
              <p className="text-gray-400">
                We offer a 30-day money-back guarantee. If you're not satisfied with your Pro subscription, contact us within 30 days for a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 