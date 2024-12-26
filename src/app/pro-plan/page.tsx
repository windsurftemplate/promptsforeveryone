'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function ProPlanPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] py-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] bg-clip-text text-transparent mb-6">
            Unlock the Full Power of Prompt Engineering
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Take your prompt engineering to the next level with our Pro plan. Get access to exclusive features and tools designed for serious developers.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0ea5e9]/20 to-[#2563eb]/20 rounded-lg flex items-center justify-center text-2xl">
                🔒
              </div>
              <h3 className="text-xl font-semibold text-white">Private Prompts</h3>
              <p className="text-white/70">
                Create and store your private prompts securely. Perfect for proprietary workflows and sensitive projects.
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0ea5e9]/20 to-[#2563eb]/20 rounded-lg flex items-center justify-center text-2xl">
                📊
              </div>
              <h3 className="text-xl font-semibold text-white">Advanced Analytics</h3>
              <p className="text-white/70">
                Track your prompt performance, usage patterns, and optimization opportunities with detailed analytics.
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0ea5e9]/20 to-[#2563eb]/20 rounded-lg flex items-center justify-center text-2xl">
                🎯
              </div>
              <h3 className="text-xl font-semibold text-white">Custom Categories</h3>
              <p className="text-white/70">
                Organize your prompts your way with custom categories and tags for efficient workflow management.
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0ea5e9]/20 to-[#2563eb]/20 rounded-lg flex items-center justify-center text-2xl">
                ⚡
              </div>
              <h3 className="text-xl font-semibold text-white">Priority Support</h3>
              <p className="text-white/70">
                Get faster responses and dedicated support to help you maximize your prompt engineering effectiveness.
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0ea5e9]/20 to-[#2563eb]/20 rounded-lg flex items-center justify-center text-2xl">
                🔄
              </div>
              <h3 className="text-xl font-semibold text-white">Version History</h3>
              <p className="text-white/70">
                Keep track of your prompt evolution with full version history and the ability to revert changes.
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0ea5e9]/20 to-[#2563eb]/20 rounded-lg flex items-center justify-center text-2xl">
                🎓
              </div>
              <h3 className="text-xl font-semibold text-white">Advanced Training</h3>
              <p className="text-white/70">
                Access exclusive tutorials and advanced prompt engineering techniques from industry experts.
              </p>
            </div>
          </Card>
        </div>

        {/* Pricing Card */}
        <div className="max-w-lg mx-auto">
          <Card className="p-8 bg-[#0f172a]/80 backdrop-blur-lg border-2 border-[#2563eb]">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Pro Plan</h3>
                <div className="text-4xl font-bold text-white mb-4">
                  $19<span className="text-lg text-white/60">/month</span>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white/70">All features listed above</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white/70">Cancel anytime</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white/70">14-day money-back guarantee</span>
                </li>
              </ul>
              <Button 
                onClick={async () => {
                  try {
                    const { redirectToCheckout } = await import('@/lib/stripe');
                    await redirectToCheckout('price_XXXXX');
                  } catch (error) {
                    console.error('Error:', error);
                  }
                }}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-4 rounded-lg transition-all duration-300 text-lg font-semibold"
              >
                Upgrade to Pro
              </Button>
              <p className="text-center text-white/40 text-sm">
                Secure payment with Stripe
              </p>
            </div>
          </Card>
        </div>

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
              <h3 className="text-xl font-semibold text-white mb-3">Is there a free trial?</h3>
              <p className="text-white/70">
                While we don't offer a free trial, we do provide a 14-day money-back guarantee if you're not satisfied with the Pro features.
              </p>
            </Card>
            <Card className="p-6 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20">
              <h3 className="text-xl font-semibold text-white mb-3">What payment methods are accepted?</h3>
              <p className="text-white/70">
                We accept all major credit cards through Stripe's secure payment processing system.
              </p>
            </Card>
            <Card className="p-6 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20">
              <h3 className="text-xl font-semibold text-white mb-3">Can I switch back to Free?</h3>
              <p className="text-white/70">
                Yes, you can downgrade to the Free plan at any time. Your private prompts will be archived and accessible if you upgrade again.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 