'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Explore', href: '/explore' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Submit', href: '/submit' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-surface border-t border-surface-light/10">
      <div className="flex justify-around">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center px-4 py-2 text-xs font-medium',
                isActive
                  ? 'text-primary-accent'
                  : 'text-text-muted hover:text-text'
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
