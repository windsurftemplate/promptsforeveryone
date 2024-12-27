'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';

const protectedRoutes = ['/dashboard', '/submit'];

export default function NavBar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Don't show protected routes if user is not logged in
  const isProtectedRoute = protectedRoutes.includes(pathname);
  if (!mounted || (!user && isProtectedRoute)) {
    return null;
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/how-to-start', label: 'How to Start' },
    ...(user ? [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/submit', label: 'Submit' }
    ] : [])
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/70 backdrop-blur-lg border-b border-white/5">
      {/* Light effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.1),_transparent_50%)]"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and main navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-white hover:text-[#2563eb] transition-colors duration-300">
                  Windsurf Prompts
                </span>
              </Link>
            </div>

            <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg ${
                    pathname === href 
                      ? 'text-[#2563eb]' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - User menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <>
                <span className="text-sm text-white/70">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <button className="px-4 py-2 text-sm bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-lg transition-all duration-300 hover:scale-105">
                    Sign In
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="px-4 py-2 text-sm bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] hover:opacity-90 text-white rounded-lg transition-all duration-300 hover:scale-105">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/[0.05] transition-all duration-300"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block px-4 py-2 rounded-lg text-base font-medium transition-all duration-300 ${
                pathname === href
                  ? 'text-white bg-[#2563eb]/20'
                  : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {label}
            </Link>
          ))}
          {!user && (
            <div className="mt-4 px-3 space-y-2">
              <Link href="/signin" className="block">
                <button className="w-full px-4 py-2 text-sm bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-lg transition-all duration-300">
                  Sign In
                </button>
              </Link>
              <Link href="/signup" className="block">
                <button className="w-full px-4 py-2 text-sm bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] hover:opacity-90 text-white rounded-lg transition-all duration-300">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
