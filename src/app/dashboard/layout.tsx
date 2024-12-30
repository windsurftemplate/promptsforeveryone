'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import { DashboardContext } from '@/contexts/DashboardContext';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [filterTag, setFilterTag] = useState('');
  const [isPro, setIsPro] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <DashboardContext.Provider value={{ filterTag, setFilterTag }}>
      <div className="flex min-h-screen bg-[#0f172a]">
        <div className="relative h-screen sticky top-0">
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="absolute left-0 top-4 bg-surface hover:bg-surface-hover p-2 rounded-r-lg transition-colors border border-l-0 border-white/10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div className={`h-screen transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-64 opacity-100'}`}>
            {!isCollapsed && (
              <div className="h-full">
                <Sidebar 
                  onFilterChange={setFilterTag} 
                  isCollapsed={isCollapsed}
                  onToggle={() => setIsCollapsed(!isCollapsed)}
                />
              </div>
            )}
          </div>
        </div>

        <div className={`flex-1 transition-all duration-300 ${!isPro ? 'pl-0' : ''}`}>
          {children}
        </div>
      </div>
    </DashboardContext.Provider>
  );
} 