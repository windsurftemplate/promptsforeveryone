'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const protectedRoutes = ['/dashboard', '/submit', '/settings'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user && protectedRoutes.includes(pathname)) {
      router.replace('/');
    }
  }, [user, pathname, router]);

  if (!user && protectedRoutes.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}
