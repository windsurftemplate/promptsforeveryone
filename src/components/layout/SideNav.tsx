'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function SideNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Submit', href: '/submit', icon: '📝' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  return (
    <nav className="h-full py-6 flex flex-col gap-6">
      {/* Logo/Home Link */}
      <Link href="/" className="px-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-[#A78BFA] via-[#818CF8] to-[#60A5FA] bg-clip-text text-transparent">
          WindsurfPrompts
        </h1>
      </Link>

      {/* Navigation Links */}
      <div className="space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-white/[0.06] text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
