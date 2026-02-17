'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { CheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

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
    <div className="min-h-screen bg-background-base">
      <div className="container mx-auto px-4 py-24 relative z-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(139,92,246,0.12),transparent_70%)]"></div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-12">
              Simplified Pricing
            </h1>
            <p className="text-xl text-gray-400">Start for free upgrade to save private collections</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-background-elevated border border-white/8 rounded-xl p-8 hover:border-violet/25 transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Free</h3>
                <div className="text-4xl font-bold text-white mb-4">$0</div>
                <p className="text-gray-400">Perfect for sharing and always free!</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <CheckIcon className="h-5 w-5 text-violet-400 mr-2 shrink-0" />
                  <span>Access to Community Prompts</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckIcon className="h-5 w-5 text-violet-400 mr-2 shrink-0" />
                  <span>Basic Prompt Creation</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckIcon className="h-5 w-5 text-violet-400 mr-2 shrink-0" />
                  <span>Discover and Share Ideas</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckIcon className="h-5 w-5 text-violet-400 mr-2 shrink-0" />
                  <span>AI Random Prompt Generator</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckIcon className="h-5 w-5 text-violet-400 mr-2 shrink-0" />
                  <span>AI Prompt Coach </span>
                </li>
              </ul>
              <Link href="/register" className="block">
                <Button 
                  variant="outline" 
                  className="w-full"
                >
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-background-elevated border border-violet-500 rounded-xl p-8 hover:bg-violet/8 transition-all duration-300 transform hover:-translate-y-1 relative shadow-glow">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-violet-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Pro</h3>
                <div className="text-4xl font-bold text-white mb-4">$9</div>
                <p className="text-gray-400">Everything you need</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <CheckIcon className="h-5 w-5 text-violet-400 mr-2 shrink-0" />
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckIcon className="h-5 w-5 text-violet-400 mr-2 shrink-0" />
                  <span>Advanced Prompt Creation</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckIcon className="h-5 w-5 text-violet-400 mr-2 shrink-0" />
                  <span>Save and Organize Unlimited Prompts</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckIcon className="h-5 w-5 text-violet-400 mr-2 shrink-0" />
                  <span>Priority Access to New Features</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckIcon className="h-5 w-5 text-violet-400 mr-2 shrink-0" />
                  <span>Ad-Free Experience</span>
                </li>
              </ul>
              <Link href="/register?plan=pro" className="block">
                <Button className="w-full">
                  Join Us
                </Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-background-elevated border border-white/8 rounded-xl p-8 hover:border-violet/25 transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Enterprise</h3>
                <div className="text-4xl font-bold text-white mb-4">Custom</div>
                <p className="text-gray-400">For large teams & organizations</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <CheckIcon className="h-5 w-5 text-violet-400 mr-2 shrink-0" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckIcon className="h-5 w-5 text-violet-400 mr-2 shrink-0" />
                  <span>Custom Integrations</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckIcon className="h-5 w-5 text-violet-400 mr-2 shrink-0" />
                  <span>Dedicated Support</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckIcon className="h-5 w-5 text-violet-400 mr-2 shrink-0" />
                  <span>SLA Guarantees</span>
                </li>
              </ul>
              <Link href="/contact" className="block">
                <Button 
                  variant="outline" 
                  className="w-full"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 