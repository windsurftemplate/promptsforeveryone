'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import SideNav from '@/components/layout/SideNav';
import NavBar from '@/components/NavBar';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const checkProStatus = async () => {
      if (!user) return;
      
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();
      setIsPro(userData?.plan === 'pro');
    };

    checkProStatus();
  }, [user]);

  // Don't show the black navigation sidebar on any pages except when explicitly needed
  const showSidebar = false; // Removing sidebar from all pages as it's not needed

  return (
    <div className="relative min-h-screen">
      <div className="flex h-screen">
        {/* Black Navigation Sidebar */}
        {showSidebar && (
          <div className="w-64 shrink-0 border-r border-white/[0.06]">
            <SideNav />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <NavBar />
          <main className={showSidebar ? 'p-6' : ''}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 