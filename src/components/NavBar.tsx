'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';

const protectedRoutes = ['/dashboard', '/submit'];

export default function NavBar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkProStatus = async () => {
      if (!user) return;
      
      try {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setIsPro(userData.isPro === true || userData.stripeSubscriptionStatus === 'active');
        }
      } catch (error) {
        console.error('Error checking pro status:', error);
      }
    };

    checkProStatus();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navLinks = [
    { href: '/explore', label: 'Explore' },
    { href: '/how-to-start', label: 'Tutorial' },
    { href: '/jobs', label: 'Jobs' },
    { href: '/dashboard', label: 'Dashboard', protected: true },
    { href: '/chat', label: 'AI Chat', protected: true, proOnly: true },
    { href: '/pro-plan', label: 'Pricing' },
  ];

  const filteredNavLinks = navLinks.filter(link => 
    (!link.protected || (link.protected && user)) &&
    (!link.proOnly || (link.proOnly && isPro))
  );

  if (!mounted) return null;

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="bg-black/50 backdrop-blur-lg border border-white/10 rounded-2xl px-6 py-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              Prompts For Everyone
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {filteredNavLinks.map(link => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`text-white hover:text-[#00ffff] transition-colors ${
                    pathname === link.href ? 'text-[#00ffff]' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="text-white hover:text-[#00ffff] transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link href="/login" className="text-white hover:text-[#00ffff] transition-colors">
                    Login
                  </Link>
                  <Link href="/signup" className="text-white hover:text-[#00ffff] transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white hover:text-[#00ffff] transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 space-y-4">
              {filteredNavLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block text-white hover:text-[#00ffff] transition-colors ${
                    pathname === link.href ? 'text-[#00ffff]' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left text-white hover:text-[#00ffff] transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block text-white hover:text-[#00ffff] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block text-white hover:text-[#00ffff] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
