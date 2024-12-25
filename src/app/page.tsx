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
      <div className="relative h-screen overflow-hidden">
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
            Save Time and Code Smarter with Prompts for Windsurf IDE
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

      {/* Call to Action */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2563eb]/10 to-[#4f46e5]/10 transform -skew-y-6" />
        <div className="container mx-auto px-4 relative">
          <Card className="p-12 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] bg-clip-text text-transparent mb-6">Ready to Harness the Wind?</h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto text-lg">
              Ready to conquer the waves and ignite your sense of adventure? Join us at WindsurfPrompts.com and set sail toward unforgettable windsurfing experiences.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/explore">
                <Button className="px-8 py-4 text-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg transition-all duration-300 hover:scale-105">
                  Explore Prompts
                </Button>
              </Link>
              <Link href="/how-to-start">
                <Button className="px-8 py-4 text-lg bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 hover:scale-105">
                  Learn More
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

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
      `}</style>
    </div>
  );
}
