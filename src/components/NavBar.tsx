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
    ...(user ? [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/submit', label: 'Submit' }
    ] : [])
  ];

  return (
    <nav className="bg-surface border-b border-surface-light/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          {/* Left side - Logo and main navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-primary-accent">Windsurf Prompts</span>
              </Link>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === href 
                      ? 'text-primary-accent bg-primary-accent/10 rounded-md' 
                      : 'text-text-muted hover:text-text hover:bg-surface-light/80 rounded-md'
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
                <span className="text-sm text-text-muted">
                  {user.displayName || user.email}
                </span>
                <Button
                  onClick={handleSignOut}
                  variant="secondary"
                  className="text-sm"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <Button variant="secondary" className="text-sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" className="text-sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-text-muted hover:text-text hover:bg-surface-light/80"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu button */}
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
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === href
                  ? 'text-primary-accent bg-primary-accent/10'
                  : 'text-text-muted hover:text-text hover:bg-surface-light/80'
              }`}
            >
              {label}
            </Link>
          ))}
          {!user && (
            <div className="mt-4 px-3 space-y-2">
              <Link href="/signin">
                <Button variant="secondary" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" className="w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
