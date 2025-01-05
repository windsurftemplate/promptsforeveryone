'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDownIcon, XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
    <>
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
                <span className="text-xl font-bold bg-gradient-to-r from-[#00ffff] to-white bg-clip-text text-transparent">
                  PromptsForEveryone.com
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
                      <Link href="/explore" className="block px-4 py-2 text-white/80 hover:text-[#00ffff] hover:bg-[#00ffff]/5 transition-colors">Explore</Link>
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
                  <Link href="/chat" className="text-white/80 hover:text-[#00ffff] transition-colors duration-300">
                    Chat
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
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white/80 hover:text-[#00ffff] transition-colors duration-300 p-2"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Updated Mobile menu */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-xl z-[90] md:hidden transition-transform duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto pt-28 pb-8 px-4">
            <div className="max-w-lg mx-auto">
              <div className="flex flex-col space-y-4">
                <div className="border-b border-[#00ffff]/10 pb-4">
                  <div className="text-lg font-semibold text-[#00ffff] mb-4">Product</div>
                  <div className="flex flex-col space-y-4">
                    <Link href="/price" className="text-white/80 hover:text-[#00ffff] transition-colors">Pricing</Link>
                    <Link href="/explore" className="text-white/80 hover:text-[#00ffff] transition-colors">Explore</Link>
                    <Link href="/submit" className="text-white/80 hover:text-[#00ffff] transition-colors">Submit Prompt</Link>
                  </div>
                </div>

                <div className="border-b border-[#00ffff]/10 pb-4">
                  <div className="text-lg font-semibold text-[#00ffff] mb-4">Resources</div>
                  <div className="flex flex-col space-y-4">
                    <Link href="/docs" className="text-white/80 hover:text-[#00ffff] transition-colors">Documentation</Link>
                    <Link href="/guides" className="text-white/80 hover:text-[#00ffff] transition-colors">Guides</Link>
                    <Link href="/blog" className="text-white/80 hover:text-[#00ffff] transition-colors">Blog</Link>
                  </div>
                </div>

                <Link href="/about" className="text-white/80 hover:text-[#00ffff] transition-colors py-4 border-b border-[#00ffff]/10">
                  About
                </Link>

                {user ? (
                  <div className="flex flex-col space-y-4 pt-4">
                    <Link href="/dashboard" className="text-white/80 hover:text-[#00ffff] transition-colors">
                      Dashboard
                    </Link>
                    <Link href="/chat" className="text-white/80 hover:text-[#00ffff] transition-colors">
                      Chat
                    </Link>
                    <Button
                      onClick={handleSignOut}
                      variant="secondary"
                      className="w-full mt-4"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-4 pt-4">
                    <Link href="/login" className="text-white/80 hover:text-[#00ffff] transition-colors">
                      Sign In
                    </Link>
                    <Link href="/register" className="w-full">
                      <Button variant="primary" className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 