'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Explore', href: '/explore' },
];

const categories = [
  { name: 'ChatGPT', href: '/category/chatgpt' },
  { name: 'Code Assistant', href: '/category/code-assistant' },
  { name: 'Writing', href: '/category/writing' },
  { name: 'Translation', href: '/category/translation' },
  { name: 'Data Analysis', href: '/category/data-analysis' },
  { name: 'Image Generation', href: '/category/image-generation' },
  { name: 'Research', href: '/category/research' },
  { name: 'Education', href: '/category/education' },
  { name: 'Business', href: '/category/business' },
];

export default function SideNav() {
  const pathname = usePathname();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  return (
    <nav className="h-full w-full bg-surface-dark">
      <div className="px-4 py-6">
        <Link href="/" className="flex items-center space-x-3">
          <span className="text-xl font-bold text-text">Windsurf Prompts</span>
        </Link>
      </div>
      <div className="px-2 py-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-accent/10 text-primary-accent'
                  : 'text-text-muted hover:bg-surface-light hover:text-text'
              )}
            >
              {item.name}
            </Link>
          );
        })}

        {/* Categories Dropdown */}
        <div className="space-y-1">
          <button
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-2 rounded-md text-sm font-medium transition-colors',
              pathname.startsWith('/category')
                ? 'bg-primary-accent/10 text-primary-accent'
                : 'text-text-muted hover:bg-surface-light hover:text-text'
            )}
          >
            <span>Categories</span>
            <svg
              className={cn(
                'w-4 h-4 transition-transform duration-200',
                isCategoriesOpen ? 'transform rotate-180' : ''
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Content */}
          {isCategoriesOpen && (
            <div className="pl-4 space-y-1">
              {categories.map((category) => {
                const isActive = pathname === category.href;
                return (
                  <Link
                    key={category.name}
                    href={category.href}
                    className={cn(
                      'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-accent/10 text-primary-accent'
                        : 'text-text-muted hover:bg-surface-light hover:text-text'
                    )}
                  >
                    {category.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
