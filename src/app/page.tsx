'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Anton } from 'next/font/google';
import dynamic from 'next/dynamic';
import FeatureCarousel from '@/components/FeatureCarousel';

const TwitterIcon = dynamic(() => import('@/components/icons/TwitterIcon'), { ssr: false });
const GitHubIcon = dynamic(() => import('@/components/icons/GitHubIcon'), { ssr: false });

const anton = Anton({ 
  weight: '400',
  subsets: ['latin'],
});

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const promptSectionRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);

  const titles = [
    'UNLOCK NEW IDEAS',
    'CREATE FASTER. SMARTER. EASIER.',
    'PROMPTS FOR EVERYONE',
    'FIND THE RIGHT PROMPT FOR YOU'
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (promptSectionRef.current) {
      observer.observe(promptSectionRef.current);
    }

    return () => {
      if (promptSectionRef.current) {
        observer.unobserve(promptSectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsFeaturesVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden -mt-24">
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
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div 
            ref={textRef} 
            className="text-center space-y-8 px-4 py-12 max-w-4xl mx-4"
            style={{ transform: 'translate3d(0, 0, 0)' }}
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
              <Link href="/signup">
                <Button className="px-8 py-4 text-lg bg-gradient-to-r from-[#00ffff] to-[#0099ff] hover:from-[#00ffff]/90 hover:to-[#0099ff]/90 text-black font-bold rounded-lg transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                  Sign Up Free
                </Button>
              </Link>
              <Link href="/how-to-start">
                <Button className="px-8 py-4 text-lg bg-gradient-to-r from-[#00ffff]/10 to-[#0099ff]/10 hover:from-[#00ffff]/20 hover:to-[#0099ff]/20 text-[#00ffff] rounded-lg transition-all duration-300 hover:scale-105 border border-[#00ffff]/30 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Animated Waves with glass effect */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="absolute inset-0 backdrop-blur-sm"></div>
          <svg className="waves relative z-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none">
            <defs>
              <path id="wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g className="wave1">
              <use href="#wave" x="50" y="3" fill="rgba(0, 255, 255, 0.1)" />
            </g>
            <g className="wave2">
              <use href="#wave" x="50" y="0" fill="rgba(0, 255, 255, 0.2)" />
            </g>
            <g className="wave3">
              <use href="#wave" x="50" y="9" fill="rgba(0, 255, 255, 0.3)" />
            </g>
          </svg>
        </div>
      </div>

      {/* After Hero Section */}

      {/* Features Section */}
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

      {/* Carousel Section */}
      <section className="relative z-20 bg-black/80">
        <div className="py-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold text-white/90 mb-4">
              Discover More Capabilities
            </h3>
            <p className="text-white/60">
              Explore our full range of features in action
            </p>
          </div>
          <FeatureCarousel />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              Why <span className="bg-gradient-to-r from-[#00ffff] via-[#0099ff] to-[#00ffff] bg-clip-text text-transparent">Prompts Matter</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-gradient-to-br from-black/40 to-[#0099ff]/5 backdrop-blur-sm rounded-xl border border-[#00ffff]/20 hover:border-[#0099ff]/40 transition-all duration-300 group">
                <div className="w-16 h-16 mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00ffff]/10 to-[#0099ff]/10 rounded-lg transform group-hover:scale-110 transition-transform duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-[#00ffff] group-hover:text-[#0099ff] transition-colors">FAST</div>
                </div>
                <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Accelerate Development</h3>
                <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                  Well-crafted prompts can reduce development time by up to 80%, allowing you to focus on what matters most - building great features.
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-black/40 to-[#0099ff]/5 backdrop-blur-sm rounded-xl border border-[#00ffff]/20 hover:border-[#0099ff]/40 transition-all duration-300 group">
                <div className="w-16 h-16 mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00ffff]/10 to-[#0099ff]/10 rounded-lg transform group-hover:scale-110 transition-transform duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-[#00ffff] group-hover:text-[#0099ff] transition-colors">UPD</div>
                </div>
                <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Enhance Code Quality</h3>
                <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                  Get consistent, high-quality code outputs that follow best practices and maintain your project's standards.
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-black/40 to-[#0099ff]/5 backdrop-blur-sm rounded-xl border border-[#00ffff]/20 hover:border-[#0099ff]/40 transition-all duration-300 group">
                <div className="w-16 h-16 mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00ffff]/10 to-[#0099ff]/10 rounded-lg transform group-hover:scale-110 transition-transform duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-[#00ffff] group-hover:text-[#0099ff] transition-colors">IMPRV</div>
                </div>
                <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Improve Accuracy</h3>
                <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                  Precise prompts lead to more accurate results, reducing the need for multiple iterations and revisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              Why Choose <span className="bg-gradient-to-r from-[#00ffff] via-[#0099ff] to-[#00ffff] bg-clip-text text-transparent">Prompts For Everyone</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-12">
                <div className="flex gap-6 items-start group">
                  <div className="w-12 h-12 rounded-lg bg-[#00ffff]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#00ffff]/20 transition-colors duration-300">
                    <span className="font-bold text-[#00ffff] text-sm">EXP</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#00ffff] mb-3">Expert-Crafted Prompts</h3>
                    <p className="text-white/70 leading-relaxed">
                      Access a curated library of prompts created by experienced developers and AI specialists, ensuring high-quality outputs every time.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start group">
                  <div className="w-12 h-12 rounded-lg bg-[#00ffff]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#00ffff]/20 transition-colors duration-300">
                    <span className="font-bold text-[#00ffff] text-sm">UPD</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#00ffff] mb-3">Regular Updates</h3>
                    <p className="text-white/70 leading-relaxed">
                      Our prompt library is continuously updated to keep pace with the latest AI models and development practices.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start group">
                  <div className="w-12 h-12 rounded-lg bg-[#00ffff]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#00ffff]/20 transition-colors duration-300">
                    <span className="font-bold text-[#00ffff] text-sm">COM</span>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-[#00ffff] mb-3">Community-Driven</h3>
                  <p className="text-white/70 leading-relaxed">
                      Join a thriving community of developers sharing insights and best practices for prompt engineering.
                  </p>
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                <div className="flex gap-6 items-start group">
                  <div className="w-12 h-12 rounded-lg bg-[#00ffff]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#00ffff]/20 transition-colors duration-300">
                    <span className="font-bold text-[#00ffff] text-sm">PRV</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#00ffff] mb-3">Private Workspace</h3>
                    <p className="text-white/70 leading-relaxed">
                      Keep your custom prompts secure in your private workspace while having the option to share with the community.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start group">
                  <div className="w-12 h-12 rounded-lg bg-[#00ffff]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#00ffff]/20 transition-colors duration-300">
                    <span className="font-bold text-[#00ffff] text-sm">AI</span>
                    </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#00ffff] mb-3">AI-Powered Assistant</h3>
                    <p className="text-white/70 leading-relaxed">
                      Get help creating and optimizing your prompts with our intelligent AI assistant, making prompt engineering easier than ever.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start group">
                  <div className="w-12 h-12 rounded-lg bg-[#00ffff]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#00ffff]/20 transition-colors duration-300">
                    <span className="font-bold text-[#00ffff] text-sm">PRO</span>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-[#00ffff] mb-3">Analytics & Insights</h3>
                  <p className="text-white/70 leading-relaxed">
                      Track the performance of your prompts and get insights to improve their effectiveness over time.
                  </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Link href="/signup">
                <Button className="bg-[#00ffff] hover:bg-[#00ffff]/80 text-black font-bold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                  Start Building Better Prompts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Divider Section */}
      <div className="relative h-[40vh] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/prompt-engineering.webp')] bg-cover bg-center bg-fixed"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/90"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 px-4 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold">
              Master the Art of
              <span className="bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]"> Prompt Engineering</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Prompt Engineering For Everyone */}
      <div 
        ref={promptSectionRef}
        className={`py-20 transform transition-all duration-[2000ms] ${
          isVisible 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-32 scale-90'
        }`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">
            Prompts For Everyone
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* For Researchers */}
            <div className="group relative animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
              <div className="h-[300px] mb-6 rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-black/40 transform group-hover:bg-black/60 transition-all duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-20 h-20 mb-4 relative">
                    <div className="absolute inset-0 bg-[#00ffff]/10 rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00ffff]/20 to-transparent rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12">
                        <div className="absolute inset-0 border-4 border-[#00ffff]/30 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-[#00ffff]/40 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
                        <div className="absolute inset-[25%] bg-[#00ffff]/20 rounded-full animate-pulse-slow"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-3">For Researchers</h3>
                  <p className="text-white/90">
                    Make research easier and faster with prompts that help you analyze data, test ideas, and improve your writing
                  </p>
                </div>
              </div>
            </div>

            {/* For Business */}
            <div className="group relative animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
              <div className="h-[300px] mb-6 rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-black/40 transform group-hover:bg-black/60 transition-all duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-20 h-20 mb-4 relative">
                    <div className="absolute inset-0 bg-[#00ffff]/10 rounded-lg rotate-45"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00ffff]/20 to-transparent rounded-lg rotate-45 animate-pulse"></div>
                    <div className="absolute inset-[15%] flex items-center justify-center">
                      <div className="w-12 h-12 relative">
                        <div className="absolute inset-0 border-4 border-[#00ffff]/30 rounded-sm rotate-45"></div>
                        <div className="absolute inset-[25%] bg-[#00ffff]/20 rounded-sm rotate-45 animate-ping-slow"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-3">For Business</h3>
                  <p className="text-white/90">
                    Create smarter business apps and automate tasks with prompts designed to streamline workflows and boost productivity
                  </p>
                </div>
              </div>
            </div>

            {/* For Developers */}
            <div className="group relative animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
              <div className="h-[300px] mb-6 rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-black/40 transform group-hover:bg-black/60 transition-all duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-20 h-20 mb-4 relative">
                    <div className="absolute inset-0 bg-[#00ffff]/10 rounded-lg"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#00ffff]/20 to-transparent rounded-lg animate-pulse"></div>
                    <div className="absolute inset-[15%] flex items-center justify-center">
                      <div className="w-12 h-12 relative">
                        <div className="absolute inset-0 border-t-4 border-r-4 border-[#00ffff]/40 rounded-tr-lg animate-spin-slow"></div>
                        <div className="absolute inset-0 border-b-4 border-l-4 border-[#00ffff]/20 rounded-bl-lg animate-spin-slow" style={{ animationDelay: '-2s' }}></div>
                        <div className="absolute inset-[25%] bg-[#00ffff]/20 rounded-lg animate-pulse-slow"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-3">For Developers</h3>
                  <p className="text-white/90">
                    Accelerate app development with prompts that simplify coding, debugging, and building powerful features
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-gradient-to-br from-black to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent animate-fade-in">Choose Your Plan</h2>
          <p className="text-white/70 text-center mb-12 max-w-2xl mx-auto">Select the perfect plan for your needs and start mastering prompt engineering today.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 bg-gradient-to-br from-black/80 to-[#0099ff]/5 backdrop-blur-lg border border-[#00ffff]/20 transform hover:scale-105 transition-all duration-300 animate-slide-in-left hover:border-[#0099ff]/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] relative" style={{ animationDelay: '0.2s' }}>
              <div className="absolute -top-4 right-4 bg-green-500 text-white px-4 py-1 rounded-full text-sm">
                Always Free
              </div>
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-2">Free</h3>
                  <div className="text-4xl font-bold text-white mb-4">$0<span className="text-lg text-white/60">/month</span></div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-white/70">Access to public prompts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-white/70">Basic prompt categories</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-white/70">Community support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">×</span>
                    <span className="text-white/40">Private prompts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">×</span>
                    <span className="text-white/40">Custom categories</span>
                  </div>
                </div>
                <Button 
                  onClick={() => window.location.href = '/signup'}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg transition-all duration-300"
                >
                  Get Started Free
                </Button>
              </div>
            </Card>

            {/* Pro Plan */}
            <Card className="p-8 bg-gradient-to-br from-black/80 to-[#0099ff]/5 backdrop-blur-lg border border-[#00ffff]/20 transform hover:scale-105 transition-all duration-300 animate-slide-in-right hover:border-[#0099ff]/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] relative" style={{ animationDelay: '0.4s' }}>
              <div className="absolute -top-4 right-4 bg-[#00ffff] text-black px-4 py-1 rounded-full text-sm font-bold">
                Most Popular
              </div>
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-2">Pro</h3>
                  <div className="text-4xl font-bold text-white mb-4">$10<span className="text-lg text-white/60">/month</span></div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-white/90">All Free features</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-white/90">Unlimited ustom categories</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-white/90">Private prompts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-white/90">AI Chat to Create Prompts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-white/90">Download Private Prompts</span>
                  </div>
                </div>
                <div className="pt-6">
                  <Link href="/pro-plan">
                    <Button className="w-full bg-[#00ffff] hover:bg-[#00ffff]/80 text-black font-bold py-3 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                      Upgrade to Pro
                </Button>
              </Link>
                  <p className="text-center text-white/60 text-sm mt-4">Or save $20 with <span className="text-[#00ffff]">yearly billing</span></p>
                </div>
            </div>
          </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-black via-[#001a1a] to-black border-t border-[#00ffff]/20 pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Company Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-[#00ffff] via-[#0099ff] to-[#00ffff] bg-clip-text text-transparent">
                PromptsForEveryone
              </h3>
              <p className="text-white/70 leading-relaxed">
                Empowering developers with advanced prompt engineering tools and AI-driven development solutions.
              </p>
              <div className="flex gap-4">
                <Link 
                  href="https://twitter.com/windsurfprompts" 
                  className="text-white/60 hover:text-[#00ffff] transition-all duration-300 transform hover:scale-110"
                >
                  <TwitterIcon className="w-6 h-6" />
                </Link>
                <Link 
                  href="https://github.com/windsurfprompts" 
                  className="text-white/60 hover:text-[#00ffff] transition-all duration-300 transform hover:scale-110"
                >
                  <GitHubIcon className="w-6 h-6" />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-[#00ffff] via-[#0099ff] to-[#00ffff] bg-clip-text text-transparent">
                Quick Links
              </h3>
              <ul className="space-y-4">
                {[
                  ['explore', 'Explore'],
                  ['pro-plan', 'Pricing'],
                  ['dashboard', 'Dashboard']
                ].map(([path, label]) => (
                  <li key={path}>
                    <Link 
                      href={`/${path}`} 
                      className="text-white/70 hover:text-[#00ffff] transition-all duration-300 relative group"
                    >
                      {label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00ffff] to-[#0099ff] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></span>
                    </Link>
                </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-[#00ffff] via-[#0099ff] to-[#00ffff] bg-clip-text text-transparent">
                Resources
              </h3>
              <ul className="space-y-4">
                {[
                  ['how-to-start', 'How to Start'],
                  ['documentation', 'Documentation'],
                  ['blog', 'Blog']
                ].map(([path, label]) => (
                  <li key={path}>
                    <Link 
                      href={`/${path}`} 
                      className="text-white/70 hover:text-[#00ffff] transition-all duration-300 relative group"
                    >
                      {label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00ffff] to-[#0099ff] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></span>
                    </Link>
                </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-[#00ffff] via-[#0099ff] to-[#00ffff] bg-clip-text text-transparent">
                Legal
              </h3>
              <ul className="space-y-4">
                {[
                  ['privacy', 'Privacy Policy'],
                  ['terms', 'Terms of Service'],
                  ['contact', 'Contact Us']
                ].map(([path, label]) => (
                  <li key={path}>
                    <Link 
                      href={`/${path}`} 
                      className="text-white/70 hover:text-[#00ffff] transition-all duration-300 relative group"
                    >
                      {label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00ffff] to-[#0099ff] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></span>
                    </Link>
                </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} Prompts For Everyone. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .waves {
          position: relative;
          width: 100%;
          height: 15vh;
          margin-bottom: -7px;
          min-height: 100px;
          max-height: 150px;
        }
        
        .wave1 use {
          animation: move-forever1 10s linear infinite;
        }
        .wave2 use {
          animation: move-forever2 8s linear infinite;
        }
        .wave3 use {
          animation: move-forever3 6s linear infinite;
        }
        
        @keyframes move-forever1 {
          0% { transform: translate(85px, 0%); }
          100% { transform: translate(-90px, 0%); }
        }
        @keyframes move-forever2 {
          0% { transform: translate(-90px, 0%); }
          100% { transform: translate(85px, 0%); }
        }
        @keyframes move-forever3 {
          0% { transform: translate(85px, 0%); }
          100% { transform: translate(-90px, 0%); }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes number-increase {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slide-in-left 1s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 1s ease-out forwards;
        }

        .animate-number-increase {
          animation: number-increase 1.5s ease-out forwards;
        }

        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }

        @keyframes glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
        }

        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>

      <script dangerouslySetInnerHTML={{
        __html: `
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
              }
            });
          }, { threshold: 0.1 });

          const section = document.getElementById('prompt-engineering-section');
          if (section) {
            observer.observe(section);
          }
        `
      }} />
    </div>
  );
}
