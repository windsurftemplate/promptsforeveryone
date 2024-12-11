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
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and main navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-indigo-600">Windsurf Prompts</span>
              </Link>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${pathname === href ? 'border-b-2 border-indigo-600' : 'border-b-2 border-transparent'} hover:border-gray-300`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - User menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700">
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

          {/* Mobile menu */}
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`block pl-3 pr-4 py-2 ${pathname === href ? 'border-l-4 border-indigo-600' : 'border-l-4 border-transparent'} text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300`}
                >
                  {label}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
