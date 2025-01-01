'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

const FEATURES = [
  "Create Custom Categories",
  "Private Prompts",
  "Priority Support",
  "Early Access to New Features",
  "Advanced Prompt Analytics",
  "API Access",
  "Team Collaboration Tools",
  "Custom Branding",
  "Unlimited Prompt History",
  "Export Functionality"
];

export default function ProPlanPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-6">
            Upgrade to Pro
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Take your prompt engineering to the next level with advanced features and unlimited access.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Monthly Plan */}
          <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-8 flex flex-col hover:border-[#00ffff]/40 hover:shadow-[0_0_30px_rgba(0,255,255,0.1)] transition-all duration-300">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#00ffff] mb-2">Monthly</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">$10</span>
                <span className="text-white/60">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-white/80">
                  <span className="text-[#00ffff]">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handleUpgrade('month')}
              className="w-full bg-[#00ffff] hover:bg-[#00ffff]/80 text-black font-bold py-3 rounded-lg transition-colors"
            >
              Get Started
            </Button>
          </div>

          {/* Yearly Plan */}
          <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-8 flex flex-col hover:border-[#00ffff]/40 hover:shadow-[0_0_30px_rgba(0,255,255,0.1)] transition-all duration-300">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-[#00ffff]">Yearly</h3>
                <span className="text-sm px-2 py-1 rounded-full bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/30">
                  Save 17%
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">$100</span>
                <span className="text-white/60">/year</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-white/80">
                  <span className="text-[#00ffff]">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handleUpgrade('year')}
              className="w-full bg-[#00ffff] hover:bg-[#00ffff]/80 text-black font-bold py-3 rounded-lg transition-colors"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-24">
          <h2 className="text-3xl font-bold text-[#00ffff] mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="border border-[#00ffff]/20 rounded-lg p-6 hover:border-[#00ffff]/40 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-2">What's included in the Pro plan?</h3>
              <p className="text-white/60">
                The Pro plan includes all features listed above, including custom categories, private prompts, priority support, and more. You'll have access to advanced features and unlimited usage.
              </p>
            </div>
            <div className="border border-[#00ffff]/20 rounded-lg p-6 hover:border-[#00ffff]/40 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-2">Can I cancel anytime?</h3>
              <p className="text-white/60">
                Yes, you can cancel your subscription at any time. You'll continue to have access to Pro features until the end of your billing period.
              </p>
            </div>
            <div className="border border-[#00ffff]/20 rounded-lg p-6 hover:border-[#00ffff]/40 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-2">Is there a refund policy?</h3>
              <p className="text-white/60">
                We offer a 30-day money-back guarantee. If you're not satisfied with your Pro subscription, contact us within 30 days for a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 