'use client';

import React, { useState, useEffect, lazy, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { useRouter, usePathname } from 'next/navigation';
import {
  Bars3Icon,
  XMarkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';

// Lazy load the menu components
const DesktopMenu = lazy(() => import('@/components/navbar/DesktopMenu'));
const MobileMenu = lazy(() => import('@/components/navbar/MobileMenu'));

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
    <header
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/6'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-6 h-6">
              <SparklesIcon className="w-6 h-6 text-violet transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="font-semibold tracking-tight text-white text-sm uppercase">
              <span className="hidden md:inline">Prompts For Everyone</span>
              <span className="md:hidden">PFE</span>
            </span>
          </Link>

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
              className="text-neutral-400 hover:text-white transition-colors duration-300 p-2"
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
    </header>
  );
}
