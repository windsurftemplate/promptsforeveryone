'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import { DashboardProvider } from '@/contexts/DashboardContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <DashboardProvider>
      <div className="flex min-h-screen bg-black">
        <div className="relative h-screen sticky top-0">
          <Sidebar />
        </div>
        <div className="flex-1 transition-all duration-300">
          {children}
        </div>
      </div>
    </DashboardProvider>
  );
} 