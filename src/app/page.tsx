'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Anton } from 'next/font/google';

const anton = Anton({ 
  weight: '400',
  subsets: ['latin'],
});

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);

  const titles = [
    'RIDE THE INTERNET',
    'MASTER THE WAVES',
    'EMBRACE THE AI',
    'SURF WITH CONFIDENCE'
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

  return (
    <div className="relative">
      {/* Hero Section with Parallax */}
      <div className="relative h-[70vh] overflow-hidden">
        <div 
          ref={heroRef}
          className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/90 to-[#1e293b]/90"
          style={{ transform: 'translate3d(0, 0, 0)' }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            ref={textRef} 
            className="text-center space-y-8 px-4"
            style={{ transform: 'translate3d(0, 0, 0)' }}
          >
            <div className={anton.className}>
              <h1 className="text-6xl md:text-[8rem] leading-none">
                <span className="block bg-gradient-to-r from-[#0ea5e9] via-[#2563eb] to-[#4f46e5] bg-clip-text text-transparent animate-gradient">
                  {titles[currentTitleIndex]}
                </span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Save Time and Code Smarter with Prompts for <span className="text-green-400 animate-pulse-subtle drop-shadow-[0_0_6px_rgba(74,222,128,0.6)]">Windsurf IDE</span>
            </p>
            <div className="flex gap-6 justify-center">
              <Link href="/explore">
                <Button className="px-8 py-4 text-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg transition-all duration-300 hover:scale-105">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/how-to-start">
                <Button className="px-8 py-4 text-lg bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 hover:scale-105">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Animated Waves */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none">
            <defs>
              <path id="wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g className="wave1">
              <use href="#wave" x="50" y="3" fill="rgba(37, 99, 235, 0.1)" />
            </g>
            <g className="wave2">
              <use href="#wave" x="50" y="0" fill="rgba(37, 99, 235, 0.2)" />
            </g>
            <g className="wave3">
              <use href="#wave" x="50" y="9" fill="rgba(37, 99, 235, 0.3)" />
            </g>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 -mt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20 transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-[#2563eb]/20 to-[#4f46e5]/20 rounded-lg flex items-center justify-center text-3xl">
                  🌊
                </div>
                <div className="pt-12">
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] bg-clip-text text-transparent mb-4">Your Go-To Destination</h3>
                  <p className="text-white/70 leading-relaxed">
                    Welcome to WindsurfPrompts.com, your go-to destination for windsurfing inspiration, tips, and strategies—designed to help you ride the wind like never before. Whether you're a total beginner or a seasoned pro, our expertly curated prompts and in-depth guides will supercharge your skills.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20 transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-[#2563eb]/20 to-[#4f46e5]/20 rounded-lg flex items-center justify-center text-3xl">
                  📚
                </div>
                <div className="pt-12">
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] bg-clip-text text-transparent mb-4">Extensive Resources</h3>
                  <p className="text-white/70 leading-relaxed">
                    Dive into our extensive library of tutorials, discover new techniques, and connect with a global community of enthusiasts who share your passion for the sport. From selecting the perfect equipment to mastering advanced maneuvers, we're here to guide you.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Visual Divider Section */}
      <div className="relative h-[40vh] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/prompt-engineering.webp')] bg-cover bg-center bg-fixed"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 via-transparent to-[#1e293b]/90"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 px-4 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Master the Art of
              <span className="bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] bg-clip-text text-transparent"> Prompt Engineering</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Prompt Engineering For Everyone */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] bg-clip-text text-transparent animate-fade-in">Prompt Engineering For Everyone</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* For Researchers */}
            <div className="group relative animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
              <div className="h-[300px] mb-6 rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('/research-bg.webp')] bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/50 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-6xl mb-4">🔬</span>
                  <h3 className="text-2xl font-bold text-white mb-3">For Researchers</h3>
                  <p className="text-white/90">
                    Accelerate your research with advanced prompt techniques. Perfect for data analysis, hypothesis testing, and academic writing.
                  </p>
                </div>
              </div>
            </div>

            {/* For Business */}
            <div className="group relative animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
              <div className="h-[300px] mb-6 rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('/business-bg.webp')] bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/50 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-6xl mb-4">💼</span>
                  <h3 className="text-2xl font-bold text-white mb-3">For Business</h3>
                  <p className="text-white/90">
                    Scale your operations with AI. From customer service to content creation, streamline your business processes.
                  </p>
                </div>
              </div>
            </div>

            {/* For Developers */}
            <div className="group relative animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
              <div className="h-[300px] mb-6 rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('/developer-bg.webp')] bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/50 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-6xl mb-4">👨‍💻</span>
                  <h3 className="text-2xl font-bold text-white mb-3">For Developers</h3>
                  <p className="text-white/90">
                    Build better software faster. Leverage AI for code generation, debugging, and technical documentation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] bg-clip-text text-transparent animate-fade-in">Choose Your Plan</h2>
          <p className="text-white/70 text-center mb-12 max-w-2xl mx-auto">Select the perfect plan for your needs and start mastering prompt engineering today.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20 transform hover:scale-105 transition-all duration-300 animate-slide-in-left relative" style={{ animationDelay: '0.2s' }}>
              <div className="absolute -top-4 right-4 bg-green-500 text-white px-4 py-1 rounded-full text-sm">
                Always Free
              </div>
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
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
            <Card className="p-8 bg-[#0f172a]/80 backdrop-blur-lg border-2 border-[#2563eb] transform hover:scale-105 transition-all duration-300 relative animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
              <div className="absolute -top-4 right-4 bg-[#2563eb] text-white px-4 py-1 rounded-full text-sm">
                Most Popular
              </div>
              <div className="absolute -right-16 -top-16 w-32 h-32 bg-[#2563eb]/20 rounded-full blur-2xl"></div>
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                  <div className="text-4xl font-bold text-white mb-1">
                    $5<span className="text-lg text-white/60">/month</span>
                  </div>
                  <div className="text-sm text-white/60">
                    or $50/year (save $10)
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-white/70">Everything in Free</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-white/70">Unlimited private prompts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-white/70">Custom categories</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-white/70">Priority support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-white/70">Early access to features</span>
                  </div>
                </div>
                <Link href="/pro-plan">
                  <Button className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-4 rounded-lg transition-all duration-300 text-lg font-semibold">
                    Get Started
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0f172a] border-t border-[#2563eb]/20 pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Company Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Windsurf IDE</h3>
              <p className="text-white/60 leading-relaxed">
                Empowering developers with advanced prompt engineering tools and AI-driven development solutions.
              </p>
              <div className="flex gap-4">
                <a href="https://twitter.com" className="text-white/60 hover:text-[#2563eb] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="https://github.com" className="text-white/60 hover:text-[#2563eb] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com" className="text-white/60 hover:text-[#2563eb] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/explore" className="text-white/60 hover:text-[#2563eb] transition-colors">
                    Explore
                  </Link>
                </li>
                <li>
                  <Link href="/how-to-start" className="text-white/60 hover:text-[#2563eb] transition-colors">
                    How to Start
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-white/60 hover:text-[#2563eb] transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-white/60 hover:text-[#2563eb] transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Resources</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/docs" className="text-white/60 hover:text-[#2563eb] transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="text-white/60 hover:text-[#2563eb] transition-colors">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="text-white/60 hover:text-[#2563eb] transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/changelog" className="text-white/60 hover:text-[#2563eb] transition-colors">
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Legal</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/privacy" className="text-white/60 hover:text-[#2563eb] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-white/60 hover:text-[#2563eb] transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="text-white/60 hover:text-[#2563eb] transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-[#2563eb]/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/40 text-sm">
                © {new Date().getFullYear()} Windsurf IDE. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link href="/privacy" className="text-white/40 hover:text-[#2563eb] text-sm transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="text-white/40 hover:text-[#2563eb] text-sm transition-colors">
                  Terms
                </Link>
                <Link href="/cookies" className="text-white/40 hover:text-[#2563eb] text-sm transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
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
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
          animation: fade-in-up 1s ease-out forwards;
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
      `}</style>
    </div>
  );
}
