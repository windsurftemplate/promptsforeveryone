'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Anton } from 'next/font/google';
import dynamic from 'next/dynamic';
import FeatureCarousel from '@/components/FeatureCarousel';
import Image from 'next/image';

const TwitterIcon = dynamic(() => import('@/components/icons/TwitterIcon'), { ssr: false });
const GitHubIcon = dynamic(() => import('@/components/icons/GitHubIcon'), { ssr: false });

const anton = Anton({ 
  weight: '400',
  subsets: ['latin'],
});

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const promptSectionRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
  const [currentNumberIndex, setCurrentNumberIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const numbers = ['01', '02', '03', '04', '05'];

  const titles = [
    'UNLOCK NEW IDEAS',
    'CREATE FASTER. SMARTER. EASIER.',
    'PROMPTS FOR EVERYONE',
    'FIND THE RIGHT PROMPT FOR YOU'
  ];

  const carouselItems = [
    { id: 'Item 1', image: '/carousel/claude-logo.png' },
    { id: 'Item 2', image: '/carousel/gemini-logo.webp' },
    { id: 'Item 3', image: '/carousel/midjourney-logo.png' },
    { id: 'Item 4', image: '/carousel/openai-logo.svg' },
    { id: 'Item 5', image: '/carousel/meta-logo.png' },
    // Add more items as needed
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitleIndex((current) =>
        current === titles.length - 1 ? 0 : current + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current && textRef.current) {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.5;
        heroRef.current.style.transform = `translate3d(0, ${rate}px, 0)`;
        textRef.current.style.transform = `translate3d(0, ${rate * 0.8}px, 0)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSliding(true);
      setTimeout(() => {
        setCurrentNumberIndex((current) =>
          current === numbers.length - 1 ? 0 : current + 1
        );
        setIsSliding(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/80"></div>
        
          {/* Light effects */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#00ffff]/10 to-[#0099ff]/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-[#00ffff]/10 to-[#0099ff]/10 rounded-full filter blur-3xl"></div>
          </div>
        </div>
        
        {/* Content wrapper */}
        <div className="absolute inset-0 flex flex-col items-center z-10 pt-24">
          <div 
            ref={textRef} 
            className="text-center space-y-8 px-4 max-w-4xl mx-4"
          >
            <div className={anton.className}>
              <h1 className="text-6xl md:text-[8rem] leading-none">
                <span className="block bg-gradient-to-r from-[#00ffff] via-[#0099ff] to-[#00ffff] bg-clip-text text-transparent animate-gradient drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                  {titles[currentTitleIndex]}
                </span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Unlock AI-driven prompts that save time and enhance creativity. Start for free today.
            </p>
            <div className="flex gap-6 justify-center">
              <Link href="/register">
                <Button variant="default" size="lg" className="text-lg font-bold shadow-[0_0_15px_rgba(0,255,255,0.5)] hover:scale-105 transition-transform duration-300">
                  Sign Up Free
                </Button>
              </Link>
              <Link href="/how-to-start">
                <Button variant="secondary" size="lg" className="text-lg font-bold shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:scale-105 transition-transform duration-300">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="absolute bottom-0 left-0 right-0 z-10 h-40 overflow-hidden">
          <div className="relative w-[200%] flex">
            <div className="flex w-1/2 animate-scroll justify-around">
              {carouselItems.map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[180px] h-full flex items-center justify-center px-2"
                >
                  <div className="relative w-full h-28 bg-transparent rounded-lg overflow-hidden group hover:bg-[#00ffff]/10 transition-all duration-300">
                    <img
                      src={item.image}
                      alt={item.id}
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex w-1/2 animate-scroll justify-around" aria-hidden="true">
              {carouselItems.map((item, index) => (
                <div
                  key={`duplicate-${index}`}
                  className="flex-shrink-0 w-[180px] h-full flex items-center justify-center px-2"
                >
                  <div className="relative w-full h-28 bg-transparent rounded-lg overflow-hidden group hover:bg-[#00ffff]/10 transition-all duration-300">
                    <img
                      src={item.image}
                      alt={item.id}
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section - Moved above Features */}
      <section className="relative z-20 py-24 bg-gradient-to-b from-black to-black/95">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-6">
              How It Works
            </h2>
            <p className="text-white/60 text-center max-w-3xl mx-auto text-lg">
              Get started with Prompts For Everyone in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 mb-6 mx-auto flex items-center justify-center bg-gradient-to-r from-[#00ffff]/10 to-[#0099ff]/10 rounded-full">
                <span className="text-[#00ffff] text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-[#00ffff] mb-3">Sign Up</h3>
              <p className="text-white/70">
                Create your free account and get instant access to our platform
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mb-6 mx-auto flex items-center justify-center bg-gradient-to-r from-[#00ffff]/10 to-[#0099ff]/10 rounded-full">
                <span className="text-[#00ffff] text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-[#00ffff] mb-3">Create & Organize</h3>
              <p className="text-white/70">
                Start creating and organizing your prompts with our intuitive tools
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mb-6 mx-auto flex items-center justify-center bg-gradient-to-r from-[#00ffff]/10 to-[#0099ff]/10 rounded-full">
                <span className="text-[#00ffff] text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-[#00ffff] mb-3">Share & Collaborate</h3>
              <p className="text-white/70">
                Share your prompts with others and collaborate in real-time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Now after How It Works */}
      <section className="relative z-20 py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-6">
              Explore Our Features
            </h2>
            <p className="text-white/60 text-center max-w-3xl mx-auto text-lg mb-4">
              A comprehensive suite of tools designed to help you create, manage, and optimize your AI prompts
            </p>
            <p className="text-white/40 text-center max-w-2xl mx-auto text-base">
              From basic prompt management to advanced optimization techniques, we provide everything you need to master prompt engineering
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Feature Cards */}
            <div className="p-6 bg-gradient-to-br from-black/40 to-[#0099ff]/5 backdrop-blur-sm rounded-xl border border-[#00ffff]/20 hover:border-[#0099ff]/40 transition-all duration-300 group">
              <div className="w-12 h-12 mb-6 flex items-center justify-center bg-gradient-to-r from-[#00ffff]/10 to-[#0099ff]/10 rounded-lg">
                <span className="text-[#00ffff] font-bold">SAVE</span>
              </div>
              <h3 className="text-xl font-semibold text-[#00ffff] mb-3 group-hover:text-[#0099ff] transition-colors">Store & Organize</h3>
              <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                Create your personal prompt library with intelligent organization, tags, and categories. Keep your valuable prompts secure and easily accessible.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-black/40 to-[#0099ff]/5 backdrop-blur-sm rounded-xl border border-[#00ffff]/20 hover:border-[#0099ff]/40 transition-all duration-300 group">
              <div className="w-12 h-12 mb-6 flex items-center justify-center bg-gradient-to-r from-[#00ffff]/10 to-[#0099ff]/10 rounded-lg">
                <span className="text-[#00ffff] font-bold">SHARE</span>
              </div>
              <h3 className="text-xl font-semibold text-[#00ffff] mb-3 group-hover:text-[#0099ff] transition-colors">Collaborate & Share</h3>
              <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                Share prompts with team members, collaborate in real-time, and build a knowledge base of effective prompts for your organization.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-black/40 to-[#0099ff]/5 backdrop-blur-sm rounded-xl border border-[#00ffff]/20 hover:border-[#0099ff]/40 transition-all duration-300 group">
              <div className="w-12 h-12 mb-6 flex items-center justify-center bg-gradient-to-r from-[#00ffff]/10 to-[#0099ff]/10 rounded-lg">
                <span className="text-[#00ffff] font-bold">OPT</span>
              </div>
              <h3 className="text-xl font-semibold text-[#00ffff] mb-3 group-hover:text-[#0099ff] transition-colors">Optimize & Improve</h3>
              <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                Use AI-powered suggestions to enhance your prompts. Get insights on performance and recommendations for improvements.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-black/40 to-[#0099ff]/5 backdrop-blur-sm rounded-xl border border-[#00ffff]/20 hover:border-[#0099ff]/40 transition-all duration-300 group">
              <div className="w-12 h-12 mb-6 flex items-center justify-center bg-gradient-to-r from-[#00ffff]/10 to-[#0099ff]/10 rounded-lg">
                <span className="text-[#00ffff] font-bold">TEST</span>
              </div>
              <h3 className="text-xl font-semibold text-[#00ffff] mb-3 group-hover:text-[#0099ff] transition-colors">Test & Validate</h3>
              <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                Thoroughly test your prompts across different scenarios. Ensure consistency and reliability before deployment.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-black/40 to-[#0099ff]/5 backdrop-blur-sm rounded-xl border border-[#00ffff]/20 hover:border-[#0099ff]/40 transition-all duration-300 group">
              <div className="w-12 h-12 mb-6 flex items-center justify-center bg-gradient-to-r from-[#00ffff]/10 to-[#0099ff]/10 rounded-lg">
                <span className="text-[#00ffff] font-bold">VER</span>
              </div>
              <h3 className="text-xl font-semibold text-[#00ffff] mb-3 group-hover:text-[#0099ff] transition-colors">Version Control</h3>
              <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                Track changes, maintain history, and roll back to previous versions. Never lose your prompt improvements.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-black/40 to-[#0099ff]/5 backdrop-blur-sm rounded-xl border border-[#00ffff]/20 hover:border-[#0099ff]/40 transition-all duration-300 group">
              <div className="w-12 h-12 mb-6 flex items-center justify-center bg-gradient-to-r from-[#00ffff]/10 to-[#0099ff]/10 rounded-lg">
                <span className="text-[#00ffff] font-bold">API</span>
              </div>
              <h3 className="text-xl font-semibold text-[#00ffff] mb-3 group-hover:text-[#0099ff] transition-colors">API Integration</h3>
              <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                Connect with popular AI models and development tools. Seamlessly integrate prompts into your workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-20 py-24 bg-gradient-to-b from-black/95 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-white/60 text-center max-w-3xl mx-auto text-lg">
              Choose the plan that best fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 bg-gradient-to-br from-black/40 to-[#0099ff]/5 backdrop-blur-sm rounded-xl border border-[#00ffff]/20 hover:border-[#0099ff]/40 transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[#00ffff] mb-2">Free</h3>
                <p className="text-white/60">Perfect for getting started</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-white/60">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-white/80">
                  <svg className="w-5 h-5 mr-3 text-[#00ffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Store up to 50 prompts
                </li>
                <li className="flex items-center text-white/80">
                  <svg className="w-5 h-5 mr-3 text-[#00ffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Basic organization tools
                </li>
                <li className="flex items-center text-white/80">
                  <svg className="w-5 h-5 mr-3 text-[#00ffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Community support
                </li>
              </ul>
              <Link href="/register">
                <Button variant="secondary" className="w-full">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-8 bg-gradient-to-br from-[#00ffff]/10 to-[#0099ff]/10 backdrop-blur-sm rounded-xl border border-[#00ffff]/30 hover:border-[#0099ff]/50 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-[#00ffff]/20 text-[#00ffff] text-sm font-medium rounded-full">
                  Popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[#00ffff] mb-2">Pro</h3>
                <p className="text-white/60">For power users</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$9</span>
                <span className="text-white/60">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-white/80">
                  <svg className="w-5 h-5 mr-3 text-[#00ffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Unlimited prompts
                </li>
                <li className="flex items-center text-white/80">
                  <svg className="w-5 h-5 mr-3 text-[#00ffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Advanced organization
                </li>
                <li className="flex items-center text-white/80">
                  <svg className="w-5 h-5 mr-3 text-[#00ffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Priority support
                </li>
                <li className="flex items-center text-white/80">
                  <svg className="w-5 h-5 mr-3 text-[#00ffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  API access
                </li>
                <li className="flex items-center text-white/80">
                  <svg className="w-5 h-5 mr-3 text-[#00ffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Team collaboration
                </li>
              </ul>
              <Link href="/price">
                <Button className="w-full">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-20 py-24 bg-gradient-to-b from-black/95 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00ffff] via-[#0099ff] to-[#00ffff] bg-clip-text text-transparent mb-6 animate-gradient">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join thousands of users who are already using Prompts For Everyone to enhance their AI workflows
            </p>
            <div className="flex gap-6 justify-center">
              <Link href="/register">
                <Button className="px-8 py-4 text-lg">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/explore">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-[#00ffff] font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-white/60 hover:text-[#00ffff] transition-colors">Features</Link></li>
                <li><Link href="/price" className="text-white/60 hover:text-[#00ffff] transition-colors">Pricing</Link></li>
                <li><Link href="/docs" className="text-white/60 hover:text-[#00ffff] transition-colors">Documentation</Link></li>
                <li><Link href="/guides" className="text-white/60 hover:text-[#00ffff] transition-colors">Guides</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#00ffff] font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-white/60 hover:text-[#00ffff] transition-colors">About</Link></li>
                <li><Link href="/blog" className="text-white/60 hover:text-[#00ffff] transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="text-white/60 hover:text-[#00ffff] transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="text-white/60 hover:text-[#00ffff] transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#00ffff] font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/community" className="text-white/60 hover:text-[#00ffff] transition-colors">Community</Link></li>
                <li><Link href="/discord" className="text-white/60 hover:text-[#00ffff] transition-colors">Discord</Link></li>
                <li><Link href="/github" className="text-white/60 hover:text-[#00ffff] transition-colors">GitHub</Link></li>
                <li><Link href="/support" className="text-white/60 hover:text-[#00ffff] transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#00ffff] font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-white/60 hover:text-[#00ffff] transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="text-white/60 hover:text-[#00ffff] transition-colors">Terms</Link></li>
                <li><Link href="/security" className="text-white/60 hover:text-[#00ffff] transition-colors">Security</Link></li>
                <li><Link href="/cookies" className="text-white/60 hover:text-[#00ffff] transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#00ffff]/10">
            <div className="text-white/60 text-sm mb-4 md:mb-0">
              © 2024 Prompts For Everyone. All rights reserved.
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
      </footer>
    </div>
  );
}
