'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export default function ProPlanPage() {
  const { user } = useAuth();

  const handleUpgradeClick = async () => {
    try {
      if (!user?.uid) {
        alert('Please sign in to upgrade to Pro.');
        return;
      }

      const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
      if (!priceId) {
        console.error('Stripe price ID is not configured');
        alert('Sorry, there was an error initiating the checkout. Please try again later.');
        return;
      }

      const { redirectToCheckout } = await import('@/lib/stripe');
      await redirectToCheckout(priceId, user.uid);
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      alert('Sorry, there was an error initiating the checkout. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-center text-white mb-12">
              Upgrade to Pro
            </h1>
            <div className="space-y-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">$9.99</div>
                <div className="text-white/60">per month</div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white/70">Custom categories</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white/70">Private prompts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white/70">Priority support</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white/70">Early access to new features</span>
                </div>
              </div>
              <Button 
                onClick={handleUpgradeClick}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-4 rounded-lg transition-all duration-300 text-lg font-semibold"
              >
                Upgrade to Pro
              </Button>
              <p className="text-center text-white/40 text-sm">
                Secure payment with Stripe
              </p>
            </div>
          </div>
        </Card>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20">
              <h3 className="text-xl font-semibold text-white mb-3">Can I cancel anytime?</h3>
              <p className="text-white/70">
                Yes, you can cancel your subscription at any time. You'll continue to have access to Pro features until the end of your billing period.
              </p>
            </Card>
            <Card className="p-6 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20">
              <h3 className="text-xl font-semibold text-white mb-3">What payment methods do you accept?</h3>
              <p className="text-white/70">
                We accept all major credit cards through Stripe's secure payment processing.
              </p>
            </Card>
            <Card className="p-6 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20">
              <h3 className="text-xl font-semibold text-white mb-3">Is my payment secure?</h3>
              <p className="text-white/70">
                Yes, all payments are processed securely through Stripe. We never store your payment information.
              </p>
            </Card>
            <Card className="p-6 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20">
              <h3 className="text-xl font-semibold text-white mb-3">What happens after I upgrade?</h3>
              <p className="text-white/70">
                You'll get immediate access to all Pro features, including custom categories and private prompts.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 