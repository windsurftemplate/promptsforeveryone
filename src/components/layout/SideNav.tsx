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

export default function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="h-full w-full bg-surface-dark">
      <div className="px-4 py-6">
        <Link href="/" className="flex items-center space-x-3">
          <span className="text-xl font-bold text-text">Windsurf Prompts</span>
        </Link>
      </div>
      <div className="px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-2 my-1 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-accent/10 text-primary-accent'
                  : 'text-text-muted hover:bg-surface-light hover:text-text'
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
