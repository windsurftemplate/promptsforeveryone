'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Anton } from 'next/font/google';
import dynamic from 'next/dynamic';

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
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-[calc(85vh+160px)] overflow-hidden -mt-24">
        <div 
          className="absolute inset-0"
          style={{ transform: 'translate3d(0, 0, 0)' }}
        >
          <div className="absolute inset-0 bg-black"></div>
        </div>
        
        {/* Light effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-radial from-[#00ff00]/30 via-transparent to-transparent opacity-30 animate-pulse-slow"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[120%] h-[120%] bg-gradient-radial from-[#00ffff]/20 via-transparent to-transparent opacity-30 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div 
          ref={heroRef}
          className="absolute inset-0"
          style={{ transform: 'translate3d(0, 0, 0)' }}
        >
          <div className="absolute inset-0 bg-black"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            ref={textRef} 
            className="text-center space-y-8 px-4"
            style={{ transform: 'translate3d(0, 0, 0)' }}
          >
            <div className={anton.className}>
              <h1 className="text-6xl md:text-[8rem] leading-none">
                <span className="block bg-gradient-to-r from-[#00ff00] via-[#00ffff] to-[#00ffff] bg-clip-text text-transparent animate-gradient drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                  {titles[currentTitleIndex]}
                </span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Save Time and Code Smarter with Prompts for <span className="text-[#00ff00] animate-pulse-subtle drop-shadow-[0_0_8px_rgba(0,255,0,0.7)]">Windsurf IDE</span>
            </p>
            <div className="flex gap-6 justify-center">
              <Link href="/explore">
                <Button className="px-8 py-4 text-lg bg-[#00ffff] hover:bg-[#00ffff]/80 text-black font-bold rounded-lg transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/how-to-start">
                <Button className="px-8 py-4 text-lg bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] rounded-lg transition-all duration-300 hover:scale-105 border border-[#00ffff]/30 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
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

      {/* Features Section */}
      <div 
        ref={featuresRef} 
        className={`relative z-10 py-20 bg-black transform transition-all duration-[2000ms] ${
          isFeaturesVisible 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-32 scale-90'
        }`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">
            Explore Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 transform hover:scale-105 transition-all duration-300 hover:border-[#00ffff]/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]">
              <div className="relative">
                <div className="w-16 h-16 mb-6 bg-gradient-to-br from-[#00ffff]/20 to-[#00ffff]/10 rounded-lg flex items-center justify-center text-3xl">
                  🌊
                </div>
                <div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-4">Your Go-To Destination</h3>
                  <p className="text-white/70 leading-relaxed">
                    Welcome to WindsurfPrompts.com, your go-to destination for windsurfing inspiration, tips, and strategies—designed to help you ride the wind like never before. Whether you're a total beginner or a seasoned pro, our expertly curated prompts and in-depth guides will supercharge your skills.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 transform hover:scale-105 transition-all duration-300 hover:border-[#00ffff]/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]">
              <div className="relative">
                <div className="w-16 h-16 mb-6 bg-gradient-to-br from-[#00ffff]/20 to-[#00ffff]/10 rounded-lg flex items-center justify-center text-3xl">
                  📚
                </div>
                <div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-4">Extensive Resources</h3>
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
            Prompt Engineering For Everyone
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* For Researchers */}
            <div className="group relative animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
              <div className="h-[300px] mb-6 rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('/research-bg.webp')] bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-6xl mb-4">🔬</span>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-3">For Researchers</h3>
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
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-6xl mb-4">💼</span>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-3">For Business</h3>
                  <p className="text-white/90">
                    Enhance your business communications and documentation with AI-powered prompts designed for professional excellence.
                  </p>
                </div>
              </div>
            </div>

            {/* For Developers */}
            <div className="group relative animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
              <div className="h-[300px] mb-6 rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('/developer-bg.webp')] bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-6xl mb-4">👨‍💻</span>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-3">For Developers</h3>
                  <p className="text-white/90">
                    Streamline your development workflow with prompts tailored for coding, debugging, and technical documentation.
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
            <Card className="p-8 bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 transform hover:scale-105 transition-all duration-300 animate-slide-in-left hover:border-[#00ffff]/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] relative" style={{ animationDelay: '0.2s' }}>
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
            <Card className="p-8 bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 transform hover:scale-105 transition-all duration-300 animate-slide-in-right hover:border-[#00ffff]/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] relative" style={{ animationDelay: '0.4s' }}>
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
                    <span className="text-white/90">Unlimited custom categories</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-white/90">Private prompts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-white/90">Priority support</span>
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
      <footer className="bg-black border-t border-[#00ffff]/20 pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Company Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">WindsurfPrompts</h3>
              <p className="text-white/60 leading-relaxed">
                Empowering developers with advanced prompt engineering tools and AI-driven development solutions.
              </p>
              <div className="flex gap-4">
                <Link href="https://twitter.com/windsurfprompts" className="text-white/60 hover:text-[#00ffff] transition-colors">
                  <TwitterIcon className="w-6 h-6" />
                </Link>
                <Link href="https://github.com/windsurfprompts" className="text-white/60 hover:text-[#00ffff] transition-colors">
                  <GitHubIcon className="w-6 h-6" />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/explore" className="text-white/60 hover:text-[#00ffff] transition-colors">Explore</Link>
                </li>
                <li>
                  <Link href="/pro-plan" className="text-white/60 hover:text-[#00ffff] transition-colors">Pricing</Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-white/60 hover:text-[#00ffff] transition-colors">Dashboard</Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">Resources</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/how-to-start" className="text-white/60 hover:text-[#00ffff] transition-colors">How to Start</Link>
                </li>
                <li>
                  <Link href="/documentation" className="text-white/60 hover:text-[#00ffff] transition-colors">Documentation</Link>
                </li>
                <li>
                  <Link href="/blog" className="text-white/60 hover:text-[#00ffff] transition-colors">Blog</Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">Legal</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/privacy" className="text-white/60 hover:text-[#00ffff] transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms" className="text-white/60 hover:text-[#00ffff] transition-colors">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-white/60 hover:text-[#00ffff] transition-colors">Contact Us</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center text-white/40 text-sm">
            <p>© {new Date().getFullYear()} WindsurfPrompts. All rights reserved.</p>
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
