'use client';

import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Anton } from 'next/font/google';
import dynamic from 'next/dynamic';
import { SparklesIcon, LightBulbIcon, ChatBubbleBottomCenterTextIcon, ShieldCheckIcon, ArrowPathIcon, CloudArrowUpIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardPreview from '@/components/DashboardPreview';

// Lazy load non-critical components
const ChatWindow = dynamic(() => import('@/components/ChatWindow'), { 
  ssr: false,
  loading: () => <div className="w-[400px] h-[500px] bg-black/50 animate-pulse rounded-lg" />
});
const FeatureCarousel = dynamic(() => import('@/components/FeatureCarousel'), { ssr: false });
const TwitterIcon = dynamic(() => import('@/components/icons/TwitterIcon'), { ssr: false });
const GitHubIcon = dynamic(() => import('@/components/icons/GitHubIcon'), { ssr: false });

const anton = Anton({ 
  weight: '400',
  subsets: ['latin'],
});

// First, let's add a reusable geometric animation component
const GeometricAnimations = () => (
  <div className="absolute inset-0 opacity-20 pointer-events-none">
    <div className="absolute top-20 right-20 w-24 h-24 border border-[#00ffff] rotate-45 animate-spin-slow"></div>
    <div className="absolute bottom-10 left-1/4 w-40 h-40 border-2 border-[#00ffff] rounded-full animate-pulse delay-300"></div>
    <div className="absolute bottom-20 right-1/4 w-20 h-20 border border-[#00ffff] rotate-12 animate-spin-slow delay-500"></div>
  </div>
);

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
  const { ref: howItWorksRef, isVisible: howItWorksVisible } = useScrollAnimation();
  const { ref: whyUseRef, isVisible: whyUseVisible } = useScrollAnimation();
  const { ref: pricingRef, isVisible: pricingVisible } = useScrollAnimation();

  const titles = [
    'Unleash AI\'s Power With Questions',
    'Ask Better, Generate More Magic',
    'Explore Our Library of Prompts',
  ];

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Only run title rotation on desktop and when component is visible
  useEffect(() => {
    if (window.innerWidth >= 768) { // md breakpoint
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );

      if (textRef.current) {
        observer.observe(textRef.current);
      }

      let interval: NodeJS.Timeout;
      if (isVisible) {
        interval = setInterval(() => {
          setCurrentTitleIndex((current) =>
            current === titles.length - 1 ? 0 : current + 1
          );
        }, 3000);
      }

      return () => {
        observer.disconnect();
        if (interval) clearInterval(interval);
      };
    }
  }, [isVisible]);

  // Optimize scroll handler with throttling
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (heroRef.current && textRef.current) {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.5;
            heroRef.current.style.transform = `translate3d(0, ${rate}px, 0)`;
            textRef.current.style.transform = `translate3d(0, ${rate * 0.8}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-100px)]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#000000]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#001a1a] to-[#000000] opacity-80"></div>
        </div>
        
        {/* Content wrapper */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          {/* Main content container */}
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-16">
              {/* Left side content */}
              <div 
                ref={textRef} 
                className="text-left space-y-8 max-w-2xl animate-fadeIn"
              >
                <h1 className={`${anton.className} text-6xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight`}>
                  <span className="text-white block md:hidden">
                    Organize, Discover, and Share Ideas
                  </span>
                  <span className="text-white hidden md:block">
                    {titles[currentTitleIndex]}
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-400 max-w-xl leading-relaxed">
                  Join our community of prompt enthusiasts because creativity isn't an accident — it's a question waiting for the perfect answer.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href="/categories">
                    <Button 
                      className="bg-[#00ffff] hover:bg-[#00ffff]/90 text-black px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                    >
                      Browse Categories
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button 
                      variant="outline"
                      className="border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff]/10 px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300"
                    >
                      Join Community
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right side - Chat Window */}
              <div className="hidden md:block">
                <ChatWindow />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Vision Section */}
      <section className="relative z-20 min-h-screen flex items-center bg-gradient-to-b from-black via-black/95 to-black/90 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,255,255,0.05),transparent_70%)]"></div>
        <GeometricAnimations />
        <div className="container mx-auto px-4">
          <div 
            ref={whyUseRef} 
            className={`max-w-3xl mx-auto transition-all duration-1000 transform ${
              whyUseVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="bg-black/70 backdrop-blur-xl border border-[#00ffff]/20 rounded-xl p-8 hover:border-[#00ffff]/40 transition-all duration-300 shadow-[0_0_50px_rgba(0,255,255,0.1)] hover:shadow-[0_0_50px_rgba(0,255,255,0.2)]">
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                I used to think mastering the latest tech trends was the key to unlocking AI's full potential. 
                But here's the reality: it's never been about the algorithm—it's about the AI prompts you feed it. 
                Without the right questions, you'll never see the possibilities sitting just beyond your reach. 
                In other words, <span className="text-[#00ffff] font-semibold">better prompts mean bigger breakthroughs</span>.
              </p>

              <p className="text-xl text-gray-300 leading-relaxed">
                Now, think about why most online content feels so bland and predictable. 
                It's not that content creators lack talent—they're just stuck recycling the same prompts over and over. 
                That's exactly why <span className="text-[#00ffff] font-semibold">PromptsForEveryone.com</span> was built: to shatter the cycle of half-baked ideas and ignite unstoppable momentum. 
                This prompt library transforms ordinary brainstorming into a springboard for innovation, productivity, and creativity. 
                It's time to break free from the same old scripts and discover what you're truly capable of when you ask the right questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-20 min-h-screen flex items-center bg-gradient-to-b from-black/90 via-black/95 to-black/90 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,255,255,0.05),transparent_70%)]"></div>
        <GeometricAnimations />
        <div className="container mx-auto px-4">
          <div 
            ref={howItWorksRef}
            className={`max-w-4xl mx-auto transition-all duration-1000 transform ${
              howItWorksVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl md:text-4xl font-bold text-center text-[#00ffff] mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center p-6 bg-black/50 rounded-xl border border-[#00ffff]/10 hover:border-[#00ffff]/30 transition-colors">
                <div className="w-16 h-16 mb-6 mx-auto flex items-center justify-center bg-[#00ffff]/10 rounded-full">
                  <span className="text-[#00ffff] text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold text-[#00ffff] mb-3">Sign Up</h3>
                <p className="text-gray-400">
                Set up your free account and dive straight into our platform
                </p>
              </div>

              <div className="text-center p-6 bg-black/50 rounded-xl border border-[#00ffff]/10 hover:border-[#00ffff]/30 transition-colors">
                <div className="w-16 h-16 mb-6 mx-auto flex items-center justify-center bg-[#00ffff]/10 rounded-full">
                  <span className="text-[#00ffff] text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold text-[#00ffff] mb-3">Create & Organize</h3>
                <p className="text-gray-400">
                Craft your prompts and keep them neatly organized in one place
                </p>
              </div>

              <div className="text-center p-6 bg-black/50 rounded-xl border border-[#00ffff]/10 hover:border-[#00ffff]/30 transition-colors">
                <div className="w-16 h-16 mb-6 mx-auto flex items-center justify-center bg-[#00ffff]/10 rounded-full">
                  <span className="text-[#00ffff] text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold text-[#00ffff] mb-3">Share & Collaborate</h3>
                <p className="text-gray-400">
                Put your prompts to work share them with the community and watch ideas grow!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Showcase Section */}
      <section className="relative z-20 min-h-screen flex items-center bg-gradient-to-b from-black/90 via-black/95 to-black/90 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,255,255,0.05),transparent_70%)]"></div>
        <GeometricAnimations />
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#00ffff] to-white bg-clip-text text-transparent mb-4">
              Explore Our Categories
            </h2>
          </div>
          <FeatureCarousel />
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="relative z-20 min-h-screen flex items-center bg-gradient-to-b from-black/90 via-black/95 to-black/90 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,255,255,0.05),transparent_70%)]"></div>
        <GeometricAnimations />
        <DashboardPreview />
      </section>

      {/* Why Use Section */}
      <section className="relative z-20 min-h-screen flex items-center bg-gradient-to-b from-black/90 via-black/95 to-black/90 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,255,255,0.05),transparent_70%)]"></div>
        <GeometricAnimations />
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-4xl font-bold text-center text-[#00ffff] mb-12">
              Benefits of PromptsForEveryone
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="bg-black/50 backdrop-blur-lg border border-[#00ffff]/10 rounded-xl p-6 hover:border-[#00ffff]/30 transition-all duration-300">
              <div className="rounded-full bg-[#00ffff]/10 w-12 h-12 flex items-center justify-center mb-4">
                <SparklesIcon className="h-6 w-6 text-[#00ffff]" />
              </div>
              <h3 className="text-xl font-semibold text-[#00ffff] mb-3">Boost Creativity and Overcome Writer's Block</h3>
              <p className="text-gray-400">Access fresh ideas and inspiration to spark creativity for writing, coding, or brainstorming</p>
            </div>

            <div className="bg-black/50 backdrop-blur-lg border border-[#00ffff]/10 rounded-xl p-6 hover:border-[#00ffff]/30 transition-all duration-300">
              <div className="rounded-full bg-[#00ffff]/10 w-12 h-12 flex items-center justify-center mb-4">
                <LightBulbIcon className="h-6 w-6 text-[#00ffff]" />
              </div>
              <h3 className="text-xl font-semibold text-[#00ffff] mb-3">Smart Categories</h3>
              <p className="text-gray-400">Organize prompts with intelligent categorization and easy-to-navigate subcategories.</p>
            </div>

            <div className="bg-black/50 backdrop-blur-lg border border-[#00ffff]/10 rounded-xl p-6 hover:border-[#00ffff]/30 transition-all duration-300">
              <div className="rounded-full bg-[#00ffff]/10 w-12 h-12 flex items-center justify-center mb-4">
                <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-[#00ffff]" />
              </div>
              <h3 className="text-xl font-semibold text-[#00ffff] mb-3">Voting & Rating System</h3>
              <p className="text-gray-400">Feature top contributors on a leaderboard, inspiring others to participate and earn visibility.</p>
            </div>

            <div className="bg-black/50 backdrop-blur-lg border border-[#00ffff]/10 rounded-xl p-6 hover:border-[#00ffff]/30 transition-all duration-300">
              <div className="rounded-full bg-[#00ffff]/10 w-12 h-12 flex items-center justify-center mb-4">
                <ShieldCheckIcon className="h-6 w-6 text-[#00ffff]" />
              </div>
              <h3 className="text-xl font-semibold text-[#00ffff] mb-3">Private Collections</h3>
              <p className="text-gray-400">Create and manage private prompt collections for personal or team use for Pro users.</p>
            </div>

            <div className="bg-black/50 backdrop-blur-lg border border-[#00ffff]/10 rounded-xl p-6 hover:border-[#00ffff]/30 transition-all duration-300">
              <div className="rounded-full bg-[#00ffff]/10 w-12 h-12 flex items-center justify-center mb-4">
                <ArrowPathIcon className="h-6 w-6 text-[#00ffff]" />
              </div>
              <h3 className="text-xl font-semibold text-[#00ffff] mb-3">Learn and Grow Skills</h3>
              <p className="text-gray-400">Explore prompt categories to learn new techniques, expand skill sets, and enhance productivity</p>
            </div>

            <div className="bg-black/50 backdrop-blur-lg border border-[#00ffff]/10 rounded-xl p-6 hover:border-[#00ffff]/30 transition-all duration-300">
              <div className="rounded-full bg-[#00ffff]/10 w-12 h-12 flex items-center justify-center mb-4">
                <CloudArrowUpIcon className="h-6 w-6 text-[#00ffff]" />
              </div>
              <h3 className="text-xl font-semibold text-[#00ffff] mb-3">Save Time with Ready-to-Use Prompts</h3>
              <p className="text-gray-400">Eliminate the need to start from scratch by using pre-made prompts that accelerate workflows</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-20 min-h-screen flex items-center bg-gradient-to-b from-black/90 via-black/95 to-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,255,255,0.05),transparent_70%)]"></div>
        <GeometricAnimations />
        <div className="container mx-auto px-4">
          <div 
            ref={pricingRef}
            className={`max-w-6xl mx-auto transition-all duration-1000 transform ${
              pricingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-center text-[#00ffff] mb-12">
                Simplified Pricing
              </h2>
              <p className="text-xl text-gray-400">Start for free upgrade to save private collections</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Free Plan */}
              <div className="bg-black/50 backdrop-blur-lg border border-[#00ffff]/10 rounded-xl p-8 hover:border-[#00ffff]/30 transition-all duration-300">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Free</h3>
                  <div className="text-4xl font-bold text-[#00ffff] mb-4">$0</div>
                  <p className="text-gray-400">Perfect for sharing and always free!</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-300">
                    <CheckIcon className="h-5 w-5 text-[#00ffff] mr-2 shrink-0" />
                    <span>Access to Community Prompts</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckIcon className="h-5 w-5 text-[#00ffff] mr-2 shrink-0" />
                    <span>Basic Prompt Creation</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckIcon className="h-5 w-5 text-[#00ffff] mr-2 shrink-0" />
                    <span>Discover and Share Ideas</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckIcon className="h-5 w-5 text-[#00ffff] mr-2 shrink-0" />
                    <span>AI Random Prompt Generator</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckIcon className="h-5 w-5 text-[#00ffff] mr-2 shrink-0" />
                    <span>AI Prompt Coach </span>
                  </li>
                </ul>
                <Link href="/register" className="block">
                  <Button 
                    variant="outline" 
                    className="w-full border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff]/10"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="bg-black/50 backdrop-blur-lg border-2 border-[#00ffff] rounded-xl p-8 hover:border-[#00ffff] hover:bg-[#00ffff]/5 transition-all duration-300 transform hover:-translate-y-1 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#00ffff] text-black px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Pro</h3>
                  <div className="text-4xl font-bold text-[#00ffff] mb-4">$9</div>
                  <p className="text-gray-400">Everything you need</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-300">
                    <CheckIcon className="h-5 w-5 text-[#00ffff] mr-2 shrink-0" />
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckIcon className="h-5 w-5 text-[#00ffff] mr-2 shrink-0" />
                    <span>Advanced Prompt Creation</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckIcon className="h-5 w-5 text-[#00ffff] mr-2 shrink-0" />
                    <span>Save and Organize Unlimited Prompts</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckIcon className="h-5 w-5 text-[#00ffff] mr-2 shrink-0" />
                    <span>Priority Access to New Features</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckIcon className="h-5 w-5 text-[#00ffff] mr-2 shrink-0" />
                    <span>Ad-Free Experience</span>
                  </li>
                </ul>
                <Link href="/register?plan=pro" className="block">
                  <Button className="w-full bg-[#00ffff] hover:bg-[#00ffff]/90 text-black font-semibold">
                    Join Us
                  </Button>
                </Link>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-black/50 backdrop-blur-lg border border-[#00ffff]/10 rounded-xl p-8 hover:border-[#00ffff]/30 transition-all duration-300">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Enterprise</h3>
                  <div className="text-4xl font-bold text-[#00ffff] mb-4">Custom</div>
                  <p className="text-gray-400">For large teams & organizations</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-300">
                    <CheckIcon className="h-5 w-5 text-[#00ffff] mr-2 shrink-0" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckIcon className="h-5 w-5 text-[#00ffff] mr-2 shrink-0" />
                    <span>Custom Integrations</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckIcon className="h-5 w-5 text-[#00ffff] mr-2 shrink-0" />
                    <span>Dedicated Support</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckIcon className="h-5 w-5 text-[#00ffff] mr-2 shrink-0" />
                    <span>SLA Guarantees</span>
                  </li>
                </ul>
                <Link href="/contact" className="block">
                  <Button 
                    variant="outline" 
                    className="w-full border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff]/10"
                  >
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Get Started Section */}
      <section className="relative z-20 min-h-screen flex items-center bg-gradient-to-b from-black/95 to-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,255,255,0.1),transparent_70%)]"></div>
        <GeometricAnimations />
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00ffff] via-[#0099ff] to-[#00ffff] bg-clip-text text-transparent mb-6 animate-gradient">
            Ready to see what happens when AI meets true human insight?
            </h2>
            <div className="flex gap-6 justify-center">
              <Link href="/register">
                <Button className="px-8 py-4 text-lg">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="secondary" className="px-8 py-4 text-lg">
                  Explore Prompts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-12 bg-black border-t border-[#00ffff]/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
              <div className="text-center">
                <h3 className="text-[#00ffff] font-semibold mb-4">Product</h3>
                <ul className="space-y-3">
                  <li><Link href="/explore" className="text-white/60 hover:text-[#00ffff] transition-colors">Explore</Link></li>
                  <li><Link href="/submit" className="text-white/60 hover:text-[#00ffff] transition-colors">Submit Prompt</Link></li>
                  <li><Link href="/price" className="text-white/60 hover:text-[#00ffff] transition-colors">Pricing</Link></li>
                </ul>
              </div>
              <div className="text-center">
                <h3 className="text-[#00ffff] font-semibold mb-4">Resources</h3>
                <ul className="space-y-3">
                  <li><Link href="/guides" className="text-white/60 hover:text-[#00ffff] transition-colors">Guides</Link></li>
                  <li><Link href="/blog" className="text-white/60 hover:text-[#00ffff] transition-colors">Blog</Link></li>
                  <li><Link href="/about" className="text-white/60 hover:text-[#00ffff] transition-colors">About</Link></li>
                  <li><Link href="/careers" className="text-white/60 hover:text-[#00ffff] transition-colors">Careers</Link></li>
                </ul>
              </div>
              <div className="text-center">
                <h3 className="text-[#00ffff] font-semibold mb-4">Legal</h3>
                <ul className="space-y-3">
                  <li><Link href="/terms" className="text-white/60 hover:text-[#00ffff] transition-colors">Terms</Link></li>
                  <li><Link href="/privacy" className="text-white/60 hover:text-[#00ffff] transition-colors">Privacy</Link></li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#00ffff]/10">
              <div className="text-white/60 text-sm mb-4 md:mb-0">
                © 2025 Prompts For Everyone. All rights reserved.
              </div>
              <div className="flex gap-6">
                <Link href="https://twitter.com" className="text-white/60 hover:text-[#00ffff] transition-colors">
                  <TwitterIcon className="w-5 h-5" />
                </Link>
                <Link href="https://github.com" className="text-white/60 hover:text-[#00ffff] transition-colors">
                  <GitHubIcon className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
