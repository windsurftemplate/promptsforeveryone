'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import Button from './ui/Button';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-xl shadow-lg shadow-cyan-500/10 border-b border-cyan-500/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110">
                <Image 
                  src="/logo.svg" 
                  alt="Logo" 
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
                Prompts For Everyone
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  href="/explore" 
                  className="text-white/80 hover:text-cyan-400 transition-colors duration-300"
                >
                  Explore
                </Link>
                <Link 
                  href="/dashboard" 
                  className="text-white/80 hover:text-cyan-400 transition-colors duration-300"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/chat" 
                  className="text-white/80 hover:text-cyan-400 transition-colors duration-300"
                >
                  Chat
                </Link>
                <Button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-all duration-300 border border-cyan-500/30 hover:border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.1)] hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link 
                  href="/explore" 
                  className="text-white/80 hover:text-cyan-400 transition-colors duration-300"
                >
                  Explore
                </Link>
                <Link 
                  href="/login" 
                  className="text-white/80 hover:text-cyan-400 transition-colors duration-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-all duration-300 border border-cyan-500/30 hover:border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.1)] hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-white/80 hover:text-cyan-400 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
