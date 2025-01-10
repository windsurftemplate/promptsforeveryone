'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';

export default function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [navigation, setNavigation] = useState([
    { name: 'Home', href: '/' },
    { name: 'Popular', href: '/popular' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Submit', href: '/submit' },
  ]);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user) return;

      try {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setIsAdmin(userData.role === 'admin');
          if (userData.role === 'admin') {
            setNavigation(prev => [
              { name: 'Home', href: '/' },
              { name: 'Explore', href: '/explore' },
              { name: 'Popular', href: '/popular' },
              { name: 'Dashboard', href: '/dashboard' },
              { name: 'Submit', href: '/submit' },
            ]);
          }
        }
      } catch (error) {
        console.error('Error checking user status:', error);
      }
    };

    checkUserStatus();
  }, [user]);

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
