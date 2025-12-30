import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface DesktopMenuProps {
  user: any;
  isAdmin: boolean;
  isPaidUser: boolean;
  onSignOut: () => void;
}

export default function DesktopMenu({ user, isAdmin, isPaidUser, onSignOut }: DesktopMenuProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = (dropdown: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="hidden md:flex items-center gap-8">
      {/* Navigation Links */}
      <div className="flex items-center gap-8 text-[11px] font-medium tracking-wide uppercase text-neutral-500">
        {/* Product Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter('product')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className={`flex items-center gap-1 transition-colors duration-300 ${
              activeDropdown === 'product'
                ? 'text-white'
                : 'hover:text-white'
            }`}
          >
            <span>Product</span>
            <ChevronDownIcon className={`w-3 h-3 transition-transform duration-300 ${
              activeDropdown === 'product' ? 'rotate-180' : ''
            }`} />
          </button>
          {activeDropdown === 'product' && (
            <div className="absolute top-full left-0 mt-3 w-48 glass-panel rounded-lg overflow-hidden animate-soft-fade">
              <div className="py-2">
                <Link href="/price" className="block px-4 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                  Pricing
                </Link>
                <Link href="/categories" className="block px-4 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                  Categories
                </Link>
                {isAdmin && (
                  <Link href="/explore" className="block px-4 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                    Explore
                  </Link>
                )}
                <Link href="/popular" className="block px-4 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                  Popular
                </Link>
                <Link href="/submit" className="block px-4 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                  Submit Prompt
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Resources Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter('resources')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className={`flex items-center gap-1 transition-colors duration-300 ${
              activeDropdown === 'resources'
                ? 'text-white'
                : 'hover:text-white'
            }`}
          >
            <span>Resources</span>
            <ChevronDownIcon className={`w-3 h-3 transition-transform duration-300 ${
              activeDropdown === 'resources' ? 'rotate-180' : ''
            }`} />
          </button>
          {activeDropdown === 'resources' && (
            <div className="absolute top-full left-0 mt-3 w-48 glass-panel rounded-lg overflow-hidden animate-soft-fade">
              <div className="py-2">
                <Link href="/guides" className="block px-4 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                  Guides
                </Link>
                <Link href="/blog" className="block px-4 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                  Blog
                </Link>
              </div>
            </div>
          )}
        </div>

        <Link href="/about" className="hover:text-white transition-colors duration-300">
          About
        </Link>

        {user && (
          <Link href="/dashboard" className="hover:text-white transition-colors duration-300">
            Dashboard
          </Link>
        )}
      </div>

      {/* Auth Buttons */}
      {user ? (
        <Button
          onClick={onSignOut}
          variant="outline"
          size="sm"
          className="text-[11px] font-medium"
        >
          Sign Out
        </Button>
      ) : (
        <Link href="/register">
          <Button
            size="sm"
            className="text-[11px] font-medium px-4 py-1.5"
          >
            Get Started
          </Button>
        </Link>
      )}
    </nav>
  );
}
