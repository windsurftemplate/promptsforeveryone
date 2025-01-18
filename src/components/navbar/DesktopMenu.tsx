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
    }, 150); // Small delay to prevent menu from closing when moving between button and dropdown
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="hidden md:flex items-center space-x-8">
      {/* Product Dropdown */}
      <div 
        className="relative"
        onMouseEnter={() => handleMouseEnter('product')}
        onMouseLeave={handleMouseLeave}
      >
        <button 
          className={`flex items-center space-x-1 transition-colors duration-300 ${
            activeDropdown === 'product' 
              ? 'text-[#00ffff]' 
              : 'text-white/80 hover:text-[#00ffff]'
          }`}
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
      <div 
        className="relative"
        onMouseEnter={() => handleMouseEnter('resources')}
        onMouseLeave={handleMouseLeave}
      >
        <button 
          className={`flex items-center space-x-1 transition-colors duration-300 ${
            activeDropdown === 'resources' 
              ? 'text-[#00ffff]' 
              : 'text-white/80 hover:text-[#00ffff]'
          }`}
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
            onClick={onSignOut}
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
            Login
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm">
              Sign Up
            </Button>
          </Link>
        </>
      )}
    </div>
  );
} 