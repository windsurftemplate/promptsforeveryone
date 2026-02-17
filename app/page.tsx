'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import dynamic from 'next/dynamic';
import {
  SparklesIcon,
  LightBulbIcon,
  ChatBubbleBottomCenterTextIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
  CheckIcon,
  ChevronDownIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Lazy load non-critical components
const FeatureCarousel = dynamic(() => import('@/components/FeatureCarousel'), { ssr: false });

// Reveal animation hook
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return ref;
}

// Reveal wrapper component
function Reveal({ children, className = '', delay = '' }: { children: React.ReactNode; className?: string; delay?: string }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${delay} ${className}`}>
      {children}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="relative bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-24 md:pt-48 md:pb-36 flex flex-col overflow-hidden text-center px-6 relative items-center">
        <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto">
          {/* Decorative Icon */}
          <div className="mb-8 opacity-80">
            <div className="w-16 h-16 rounded-2xl bg-violet/10 border border-violet/20 flex items-center justify-center">
              <SparklesIcon className="w-8 h-8 text-violet" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium text-gray-900 tracking-tighter mb-8 leading-[0.95] font-display">
            Discover Prompts That
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-violet-500 to-violet-700">
              Spark Innovation.
            </span>
          </h1>

          <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto mb-12 leading-relaxed font-light tracking-wide">
            Join a community of AI enthusiasts sharing powerful prompts.
            Find inspiration, save time, and unlock the full potential of AI
            with our curated prompt library.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center">
            {/* Shimmer Button */}
            <Link
              href="/categories"
              className="group relative inline-flex cursor-pointer overflow-hidden rounded-full transition-all duration-300 hover:scale-105 hover:shadow-glow-lg w-full sm:w-auto justify-center"
            >
              <div className="absolute inset-0 rounded-full">
                <div className="absolute inset-[-200%] w-[400%] h-[400%] animate-rotate-gradient">
                  <div className="absolute inset-0 bg-[conic-gradient(from_270deg,transparent_0,rgba(255,255,255,0.6)_90deg,transparent_90deg)]" />
                </div>
              </div>
              <div className="absolute inset-[1px] rounded-full bg-violet-600/90 backdrop-blur" />
              <span className="relative z-10 flex items-center gap-2 py-3.5 px-8 text-xs uppercase font-semibold tracking-wider text-white whitespace-nowrap">
                Browse Prompts
              </span>
            </Link>

            <Link
              href="/register"
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 text-xs uppercase font-medium tracking-wider rounded-full transition-colors w-full sm:w-auto group shadow-sm"
            >
              Join Community
              <ChevronDownIcon className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors rotate-[-90deg]" />
            </Link>
          </div>
        </div>

        {/* Decorative Line */}
        <div className="mt-32 h-px w-full max-w-[200px] bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-auto" />
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 border-y border-gray-100 relative bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Reveal>
              <div className="bg-white border border-gray-100 shadow-sm p-8 rounded-xl text-center group hover:border-violet/30 hover:shadow-md transition-all duration-500">
                <div className="text-4xl font-semibold text-gray-900 mb-3 tracking-tighter group-hover:text-violet transition-colors">
                  1000+
                </div>
                <div className="h-px w-8 bg-gray-200 mx-auto my-4 group-hover:bg-violet/50 transition-colors" />
                <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-2">Prompts</p>
                <p className="text-[10px] text-gray-400 leading-relaxed max-w-[180px] mx-auto">
                  Curated prompts across multiple categories ready to use.
                </p>
              </div>
            </Reveal>

            <Reveal delay="delay-75">
              <div className="bg-white border border-gray-100 shadow-sm p-8 rounded-xl text-center group hover:border-violet/30 hover:shadow-md transition-all duration-500">
                <div className="text-4xl font-semibold text-gray-900 mb-3 tracking-tighter group-hover:text-violet transition-colors">
                  50+
                </div>
                <div className="h-px w-8 bg-gray-200 mx-auto my-4 group-hover:bg-violet/50 transition-colors" />
                <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-2">Categories</p>
                <p className="text-[10px] text-gray-400 leading-relaxed max-w-[180px] mx-auto">
                  From coding to creative writing, find your niche.
                </p>
              </div>
            </Reveal>

            <Reveal delay="delay-150">
              <div className="bg-white border border-gray-100 shadow-sm p-8 rounded-xl text-center group hover:border-violet/30 hover:shadow-md transition-all duration-500">
                <div className="text-4xl font-semibold text-gray-900 mb-3 tracking-tighter group-hover:text-violet transition-colors">
                  Free
                </div>
                <div className="h-px w-8 bg-gray-200 mx-auto my-4 group-hover:bg-violet/50 transition-colors" />
                <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-2">Access</p>
                <p className="text-[10px] text-gray-400 leading-relaxed max-w-[180px] mx-auto">
                  Start using community prompts at no cost.
                </p>
              </div>
            </Reveal>

            <Reveal delay="delay-200">
              <div className="bg-white border border-gray-100 shadow-sm p-8 rounded-xl text-center group hover:border-violet/30 hover:shadow-md transition-all duration-500">
                <div className="text-4xl font-semibold text-gray-900 mb-3 tracking-tighter group-hover:text-violet transition-colors">
                  AI+
                </div>
                <div className="h-px w-8 bg-gray-200 mx-auto my-4 group-hover:bg-violet/50 transition-colors" />
                <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-2">Tools</p>
                <p className="text-[10px] text-gray-400 leading-relaxed max-w-[180px] mx-auto">
                  Prompt coach, generator, and learning modules.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-32 px-6 border-b border-gray-100 relative z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <Reveal className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 tracking-tighter font-display">
              Stop Starting From Scratch.
            </h2>
            <div className="space-y-8">
              <div className="flex items-start gap-5 group">
                <div className="w-0.5 h-12 bg-gray-200 group-hover:bg-gray-300 transition-colors mt-1" />
                <div>
                  <h4 className="text-gray-900 text-sm font-medium mb-2">The Blank Page Problem</h4>
                  <p className="text-gray-500 text-sm font-light leading-relaxed">
                    Spending hours crafting the perfect prompt? Most people struggle
                    to get quality outputs because they don't know where to start.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-5 group">
                <div className="w-0.5 h-12 bg-violet shadow-glow mt-1" />
                <div>
                  <h4 className="text-gray-900 text-sm font-medium mb-2">The Community Solution</h4>
                  <p className="text-gray-600 text-sm font-light leading-relaxed">
                    Access battle-tested prompts from creators worldwide. Learn from
                    the best, adapt to your needs, and share your discoveries.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay="delay-100">
            <div className="bg-white border border-gray-100 shadow-md p-10 rounded-2xl relative overflow-hidden group hover:border-violet/20 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-violet/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <CpuChipIcon className="w-16 h-16 text-gray-900" />
              </div>
              <p className="text-xl md:text-2xl font-light text-gray-700 leading-relaxed mb-8 relative z-10">
                "Better prompts mean bigger breakthroughs. The right question unlocks
                possibilities you never knew existed."
              </p>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-6 h-px bg-violet" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-violet-500 font-semibold">
                  Prompts For Everyone
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-6 border-b border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="text-2xl font-medium text-gray-900 tracking-tight mb-16 text-center font-display">
              How It Works
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-6 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent -z-10" />

            <Reveal className="flex flex-col md:items-center md:text-center">
              <div className="w-12 h-12 bg-white border border-gray-200 shadow-sm rounded-full flex items-center justify-center text-sm font-bold text-gray-700 mb-6 z-10">
                01
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                Explore
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
                Browse our curated library of prompts across 50+ categories.
              </p>
            </Reveal>

            <Reveal delay="delay-75" className="flex flex-col md:items-center md:text-center">
              <div className="w-12 h-12 bg-violet rounded-full flex items-center justify-center text-sm font-bold text-white mb-6 z-10 shadow-glow ring-4 ring-violet/10">
                02
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                Create & Save
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
                Craft your own prompts or save favorites to your collection.
              </p>
            </Reveal>

            <Reveal delay="delay-150" className="flex flex-col md:items-center md:text-center">
              <div className="w-12 h-12 bg-white border border-gray-200 shadow-sm rounded-full flex items-center justify-center text-sm font-bold text-gray-700 mb-6 z-10">
                03
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                Share & Grow
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
                Contribute to the community and learn from others.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2 rounded bg-violet/10 border border-violet/20">
                <BoltIcon className="w-4 h-4 text-violet" />
              </div>
              <h2 className="text-2xl font-medium text-gray-900 tracking-tight font-display">
                Powerful Features
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Reveal>
              <div className="bg-white border border-gray-100 shadow-sm p-8 rounded-xl hover:border-violet/25 hover:shadow-md group transition-all duration-500">
                <div className="w-10 h-10 rounded-lg bg-violet/10 flex items-center justify-center mb-6 text-violet group-hover:scale-110 transition-transform duration-500">
                  <SparklesIcon className="w-5 h-5" />
                </div>
                <h3 className="text-gray-900 font-medium mb-2">AI Prompt Coach</h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  Get personalized suggestions to improve your prompts for better AI outputs.
                </p>
              </div>
            </Reveal>

            <Reveal delay="delay-75">
              <div className="bg-white border border-gray-100 shadow-sm p-8 rounded-xl hover:border-violet/25 hover:shadow-md group transition-all duration-500">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-6 text-gray-500 group-hover:text-violet group-hover:bg-violet/10 group-hover:scale-110 transition-all duration-500">
                  <LightBulbIcon className="w-5 h-5" />
                </div>
                <h3 className="text-gray-900 font-medium mb-2">Smart Categories</h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  Intelligent categorization with easy-to-navigate subcategories.
                </p>
              </div>
            </Reveal>

            <Reveal delay="delay-100">
              <div className="bg-white border border-gray-100 shadow-sm p-8 rounded-xl hover:border-violet/25 hover:shadow-md group transition-all duration-500">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-6 text-gray-500 group-hover:text-violet group-hover:bg-violet/10 group-hover:scale-110 transition-all duration-500">
                  <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                </div>
                <h3 className="text-gray-900 font-medium mb-2">Community Voting</h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  Top contributors featured on our leaderboard for visibility.
                </p>
              </div>
            </Reveal>

            <Reveal delay="delay-150">
              <div className="bg-white border border-gray-100 shadow-sm p-8 rounded-xl hover:border-violet/25 hover:shadow-md group transition-all duration-500">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-6 text-gray-500 group-hover:text-violet group-hover:bg-violet/10 group-hover:scale-110 transition-all duration-500">
                  <ShieldCheckIcon className="w-5 h-5" />
                </div>
                <h3 className="text-gray-900 font-medium mb-2">Private Collections</h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  Create and manage private prompt collections for Pro users.
                </p>
              </div>
            </Reveal>

            <Reveal delay="delay-200">
              <div className="bg-white border border-gray-100 shadow-sm p-8 rounded-xl hover:border-violet/25 hover:shadow-md group transition-all duration-500">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-6 text-gray-500 group-hover:text-violet group-hover:bg-violet/10 group-hover:scale-110 transition-all duration-500">
                  <ArrowPathIcon className="w-5 h-5" />
                </div>
                <h3 className="text-gray-900 font-medium mb-2">Learning Modules</h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  Interactive lessons to master the art of prompt engineering.
                </p>
              </div>
            </Reveal>

            <Reveal delay="delay-300">
              <div className="bg-white border border-gray-100 shadow-sm p-8 rounded-xl hover:border-violet/25 hover:shadow-md group transition-all duration-500">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-6 text-gray-500 group-hover:text-violet group-hover:bg-violet/10 group-hover:scale-110 transition-all duration-500">
                  <RocketLaunchIcon className="w-5 h-5" />
                </div>
                <h3 className="text-gray-900 font-medium mb-2">Prompt Generator</h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  Auto-generate prompts from simple descriptions with AI.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 px-6 relative overflow-hidden bg-gray-50 border-t border-gray-100">
        <div className="relative max-w-5xl mx-auto text-center">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-medium text-gray-900 tracking-tighter mb-8 font-display">
              Simple, Transparent Pricing.
            </h2>
            <p className="text-gray-500 mb-16 text-sm font-light">
              Start for free. Upgrade to unlock private collections.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Free Plan */}
            <Reveal>
              <div className="bg-white border border-gray-200 shadow-sm p-8 rounded-2xl hover:border-gray-300 hover:shadow-md transition-all flex flex-col items-center relative overflow-hidden">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-4">
                  Free
                </span>
                <span className="text-3xl font-bold text-gray-900 mb-2">$0</span>
                <span className="text-xs text-gray-400 mb-8">Forever free</span>

                <ul className="space-y-3 mb-8 text-left w-full">
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckIcon className="w-4 h-4 text-violet-500 shrink-0" />
                    <span>Access to Community Prompts</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckIcon className="w-4 h-4 text-violet-500 shrink-0" />
                    <span>Basic Prompt Creation</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckIcon className="w-4 h-4 text-violet-500 shrink-0" />
                    <span>AI Prompt Coach</span>
                  </li>
                </ul>

                <Link href="/register" className="w-full">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </Reveal>

            {/* Pro Plan */}
            <Reveal delay="delay-75">
              <div className="relative p-8 rounded-2xl bg-violet/10 border border-violet-500 hover:bg-violet/15 transition-all flex flex-col items-center overflow-hidden shadow-glow transform md:-translate-y-4">
                <div className="absolute inset-0 bg-gradient-to-b from-violet/10 to-transparent opacity-50" />
                <div className="absolute top-0 px-4 py-1 bg-violet-500 text-white text-[10px] uppercase font-bold tracking-widest rounded-b-lg">
                  Most Popular
                </div>

                <span className="text-xs text-violet-600 font-bold uppercase tracking-widest mb-4 mt-2 relative z-10">
                  Pro
                </span>
                <span className="text-3xl font-bold text-gray-900 mb-2 relative z-10">$9</span>
                <span className="text-xs text-gray-500 mb-8 relative z-10">per month</span>

                <ul className="space-y-3 mb-8 text-left w-full relative z-10">
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckIcon className="w-4 h-4 text-violet-500 shrink-0" />
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckIcon className="w-4 h-4 text-violet-500 shrink-0" />
                    <span>Unlimited Private Prompts</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckIcon className="w-4 h-4 text-violet-500 shrink-0" />
                    <span>Ad-Free Experience</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckIcon className="w-4 h-4 text-violet-500 shrink-0" />
                    <span>Priority Features</span>
                  </li>
                </ul>

                <Link href="/register?plan=pro" className="w-full relative z-10">
                  <Button className="w-full">
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            </Reveal>

            {/* Enterprise Plan */}
            <Reveal delay="delay-150">
              <div className="bg-white border border-gray-200 shadow-sm p-8 rounded-2xl hover:border-gray-300 hover:shadow-md transition-all flex flex-col items-center relative overflow-hidden">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-4">
                  Enterprise
                </span>
                <span className="text-3xl font-bold text-gray-900 mb-2">Custom</span>
                <span className="text-xs text-gray-400 mb-8">Contact us</span>

                <ul className="space-y-3 mb-8 text-left w-full">
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckIcon className="w-4 h-4 text-violet-500 shrink-0" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckIcon className="w-4 h-4 text-violet-500 shrink-0" />
                    <span>Custom Integrations</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckIcon className="w-4 h-4 text-violet-500 shrink-0" />
                    <span>Dedicated Support</span>
                  </li>
                </ul>

                <Link href="/contact" className="w-full">
                  <Button variant="outline" className="w-full">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden border-t border-gray-100 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(139,92,246,0.06),transparent_70%)]" />
        <Reveal>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-medium text-gray-900 tracking-tighter mb-8 font-display">
              Ready to unlock AI's potential?
            </h2>
            <p className="text-gray-500 mb-12 text-sm font-light">
              Join thousands of creators using better prompts for better results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="px-8">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline" size="lg" className="px-8">
                  Explore Prompts
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-100 text-center bg-gray-50">
        <p className="text-sm font-semibold text-gray-900 tracking-tight mb-2 font-display">
          PROMPTS FOR EVERYONE
        </p>
        <p className="text-[10px] text-gray-400 mb-10">
          Empowering creators with better AI interactions.
        </p>

        <div className="flex justify-center gap-8 text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-8">
          <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
          <Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
          <Link href="/about" className="hover:text-gray-900 transition-colors">About</Link>
        </div>

        <p className="text-[10px] text-gray-300">
          © 2025 Prompts For Everyone. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
