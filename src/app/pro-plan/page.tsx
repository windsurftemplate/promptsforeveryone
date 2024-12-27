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
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-[#2563eb]/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-[1000px] h-[1000px] bg-gradient-to-tr from-[#0ea5e9]/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-1 bg-[#2563eb]/10 rounded-full border border-[#2563eb]/20">
            <span className="text-[#2563eb] font-semibold">Limited Time Offer</span>
          </div>
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Upgrade to <span className="bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] bg-clip-text text-transparent">Pro</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Take your prompt engineering to the next level with advanced features, unlimited storage, and priority support.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20 hover:border-[#2563eb]/40 transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2563eb]/20 to-[#0ea5e9]/20 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-4xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Custom Categories</h3>
              <p className="text-white/70">
                Create unlimited custom categories and organize your prompts exactly how you want them.
              </p>
            </div>
          </Card>
          <Card className="p-8 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20 hover:border-[#2563eb]/40 transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2563eb]/20 to-[#0ea5e9]/20 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-4xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Private Prompts</h3>
              <p className="text-white/70">
                Keep your valuable prompts secure with unlimited private storage and sharing controls.
              </p>
            </div>
          </Card>
          <Card className="p-8 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20 hover:border-[#2563eb]/40 transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2563eb]/20 to-[#0ea5e9]/20 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-4xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Priority Support</h3>
              <p className="text-white/70">
                Get fast, personalized support and early access to the latest features and updates.
              </p>
            </div>
          </Card>
        </div>

        {/* Pricing Cards */}
        <Card className="bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20 mb-16 overflow-hidden">
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Monthly Plan */}
              <div className="flex flex-col min-h-[600px] relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2563eb]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                <div className="flex-grow space-y-8 relative">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-white mb-2">$5</div>
                    <div className="text-white/60 text-lg">per month</div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-[#2563eb]/5 p-3 rounded-lg">
                      <span className="text-green-400 text-xl">✓</span>
                      <span className="text-white/90">Unlimited custom categories</span>
                    </div>
                    <div className="flex items-center gap-3 bg-[#2563eb]/5 p-3 rounded-lg">
                      <span className="text-green-400 text-xl">✓</span>
                      <span className="text-white/90">Unlimited private prompts</span>
                    </div>
                    <div className="flex items-center gap-3 bg-[#2563eb]/5 p-3 rounded-lg">
                      <span className="text-green-400 text-xl">✓</span>
                      <span className="text-white/90">Priority email support</span>
                    </div>
                    <div className="flex items-center gap-3 bg-[#2563eb]/5 p-3 rounded-lg">
                      <span className="text-green-400 text-xl">✓</span>
                      <span className="text-white/90">Early access to new features</span>
                    </div>
                    <div className="flex items-center gap-3 bg-[#2563eb]/5 p-3 rounded-lg">
                      <span className="text-green-400 text-xl">✓</span>
                      <span className="text-white/90">Advanced prompt analytics</span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handleUpgradeClick}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-4 rounded-lg transition-all duration-300 text-lg font-semibold mt-8 group-hover:scale-[1.02]"
                >
                  Subscribe Monthly
                </Button>
              </div>

              {/* Yearly Plan */}
              <div className="flex flex-col min-h-[600px] relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2563eb]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                <div className="absolute -top-4 right-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  Save $10
                </div>
                <div className="flex-grow space-y-8 relative">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-white mb-2">$50</div>
                    <div className="text-white/60 text-lg">per year</div>
                    <div className="text-sm text-green-400 mt-1 font-medium">Save $10 with annual billing</div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-[#2563eb]/5 p-3 rounded-lg">
                      <span className="text-green-400 text-xl">✓</span>
                      <span className="text-white/90">Same great features as monthly</span>
                    </div>
                    <div className="flex items-center gap-3 bg-[#2563eb]/5 p-3 rounded-lg">
                      <span className="text-green-400 text-xl">✓</span>
                      <span className="text-white/90">Unlimited custom categories</span>
                    </div>
                    <div className="flex items-center gap-3 bg-[#2563eb]/5 p-3 rounded-lg">
                      <span className="text-green-400 text-xl">✓</span>
                      <span className="text-white/90">Unlimited private prompts</span>
                    </div>
                    <div className="flex items-center gap-3 bg-[#2563eb]/5 p-3 rounded-lg">
                      <span className="text-green-400 text-xl">✓</span>
                      <span className="text-white/90">Priority email support</span>
                    </div>
                    <div className="flex items-center gap-3 bg-[#2563eb]/5 p-3 rounded-lg">
                      <span className="text-green-400 text-xl">✓</span>
                      <span className="text-white/90">Early access to new features</span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handleUpgradeClick}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-4 rounded-lg transition-all duration-300 text-lg font-semibold mt-8 group-hover:scale-[1.02]"
                >
                  Subscribe Yearly
                </Button>
              </div>
            </div>
            <div className="text-center text-white/40 text-sm mt-8 flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure payment with Stripe
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cancel anytime
              </div>
            </div>
          </div>
        </Card>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20 hover:border-[#2563eb]/40 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4">Can I cancel anytime?</h3>
              <p className="text-white/70 leading-relaxed">
                Yes, you can cancel your subscription at any time. You'll continue to have access to Pro features until the end of your billing period.
              </p>
            </Card>
            <Card className="p-8 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20 hover:border-[#2563eb]/40 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4">What payment methods do you accept?</h3>
              <p className="text-white/70 leading-relaxed">
                We accept all major credit cards (Visa, Mastercard, American Express) through Stripe's secure payment processing.
              </p>
            </Card>
            <Card className="p-8 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20 hover:border-[#2563eb]/40 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4">Is my payment secure?</h3>
              <p className="text-white/70 leading-relaxed">
                Yes, all payments are processed securely through Stripe's PCI-compliant platform. We never store your payment information.
              </p>
            </Card>
            <Card className="p-8 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20 hover:border-[#2563eb]/40 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4">What happens after I upgrade?</h3>
              <p className="text-white/70 leading-relaxed">
                You'll get immediate access to all Pro features. Your account will be upgraded instantly, and you can start using Pro features right away.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 