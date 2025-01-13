'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Anton } from 'next/font/google';

const anton = Anton({ 
  weight: '400',
  subsets: ['latin'],
});

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user) return;

      try {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setIsAdmin(userData.role === 'admin');
          setIsPaidUser(userData.plan === 'paid' || userData.role === 'admin');
        } else {
          setIsPaidUser(false);
        }
      } catch (error) {
        console.error('Error checking user status:', error);
        setIsPaidUser(false);
      }
    };

    checkUserStatus();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDropdownClick = (dropdown: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav 
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl transition-all duration-300 rounded-2xl ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-xl shadow-lg shadow-[#00ffff]/10 border border-[#00ffff]/10' 
          : 'bg-black/50 backdrop-blur-md border border-white/5'
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
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
              <span className={`${anton.className} text-2xl font-bold text-[#00ffff] tracking-tight leading-none`}>
                Prompts For Everyone
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8" ref={dropdownRef}>
            {/* Product Dropdown */}
            <div className="relative">
              <button 
                className={`flex items-center space-x-1 transition-colors duration-300 ${
                  activeDropdown === 'product' 
                    ? 'text-[#00ffff]' 
                    : 'text-white/80 hover:text-[#00ffff]'
                }`}
                onClick={(e) => handleDropdownClick('product', e)}
              >
                <span>Product</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${
                  activeDropdown === 'product' ? 'rotate-180' : ''
                }`} />
              </button>
              {activeDropdown === 'product' && (
                <div className="absolute top-full left-0 mt-2 w-48 rounded-lg bg-black/90 backdrop-blur-xl border border-[#00ffff]/20 shadow-lg shadow-[#00ffff]/5">
                  <div className="py-2">
                    <Link href="/price" className="block px-4 py-2 text-white/80 hover:text-[#00ffff] hover:bg-[#00ffff]/5 transition-colors">Pricing</Link>
                    <Link href="/categories" className="block px-4 py-2 text-white/80 hover:text-[#00ffff] hover:bg-[#00ffff]/5 transition-colors">Categories</Link>
                    {isAdmin && (
                      <Link href="/explore" className="block px-4 py-2 text-white/80 hover:text-[#00ffff] hover:bg-[#00ffff]/5 transition-colors">Explore</Link>
                    )}
                    <Link href="/popular" className="block px-4 py-2 text-white/80 hover:text-[#00ffff] hover:bg-[#00ffff]/5 transition-colors">Popular</Link>
                    <Link href="/submit" className="block px-4 py-2 text-white/80 hover:text-[#00ffff] hover:bg-[#00ffff]/5 transition-colors">Submit Prompt</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative">
              <button 
                className={`flex items-center space-x-1 transition-colors duration-300 ${
                  activeDropdown === 'resources' 
                    ? 'text-[#00ffff]' 
                    : 'text-white/80 hover:text-[#00ffff]'
                }`}
                onClick={(e) => handleDropdownClick('resources', e)}
              >
                <span>Resources</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${
                  activeDropdown === 'resources' ? 'rotate-180' : ''
                }`} />
              </button>
              {activeDropdown === 'resources' && (
                <div className="absolute top-full left-0 mt-2 w-48 rounded-lg bg-black/90 backdrop-blur-xl border border-[#00ffff]/20 shadow-lg shadow-[#00ffff]/5">
                  <div className="py-2">
                    <Link href="/docs" className="block px-4 py-2 text-white/80 hover:text-[#00ffff] hover:bg-[#00ffff]/5 transition-colors">Documentation</Link>
                    <Link href="/guides" className="block px-4 py-2 text-white/80 hover:text-[#00ffff] hover:bg-[#00ffff]/5 transition-colors">Guides</Link>
                    <Link href="/blog" className="block px-4 py-2 text-white/80 hover:text-[#00ffff] hover:bg-[#00ffff]/5 transition-colors">Blog</Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/about" className="text-white/80 hover:text-[#00ffff] transition-colors duration-300">
              About
            </Link>

            {user ? (
              <>
                <Link href="/dashboard" className="text-white/80 hover:text-[#00ffff] transition-colors duration-300">
                  Dashboard
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="secondary"
                  size="sm"
                  className="ml-4"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-white/80 hover:text-[#00ffff] transition-colors duration-300">
                  Sign In
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-white/80 hover:text-[#00ffff] transition-colors duration-300"
              aria-label="Toggle menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
          <Link href="/explore" className="block px-3 py-2 text-white/80 hover:text-[#00ffff] transition-colors duration-300">
            Explore
          </Link>
          <Link href="/categories" className="block px-3 py-2 text-white/80 hover:text-[#00ffff] transition-colors duration-300">
            Categories
          </Link>
          <Link href="/popular" className="block px-3 py-2 text-white/80 hover:text-[#00ffff] transition-colors duration-300">
            Popular
          </Link>
        </div>
      )}
    </nav>
  );
}
