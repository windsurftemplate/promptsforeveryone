'use client';

import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Anton } from 'next/font/google';

// Lazy load the menu components
const DesktopMenu = lazy(() => import('@/components/navbar/DesktopMenu'));
const MobileMenu = lazy(() => import('@/components/navbar/MobileMenu'));

const anton = Anton({ 
  weight: '400',
  subsets: ['latin'],
});

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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
                  priority
                />
              </div>
              <span className={`${anton.className} text-2xl font-bold text-[#00ffff] tracking-tight leading-none`}>
                <span className="hidden md:inline">Prompts For Everyone</span>
                <span className="md:hidden">PFE</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <Suspense fallback={<div className="hidden md:block w-[400px]" />}>
            <DesktopMenu 
              user={user}
              isAdmin={isAdmin}
              isPaidUser={isPaidUser}
              onSignOut={handleSignOut}
            />
          </Suspense>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-white/80 hover:text-[#00ffff] transition-colors duration-300"
              aria-label="Toggle menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <Suspense fallback={<div className="h-[200px] bg-black/90 backdrop-blur-xl" />}>
          <MobileMenu 
            user={user}
            isAdmin={isAdmin}
            isPaidUser={isPaidUser}
            onSignOut={handleSignOut}
          />
        </Suspense>
      )}
    </nav>
  );
}
