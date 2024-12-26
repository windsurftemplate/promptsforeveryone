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
    router.push('/signin');
    return null;
  }

  return (
    <DashboardContext.Provider value={{ filterTag, setFilterTag }}>
      <div className="flex min-h-screen bg-[#0f172a]">
        <Sidebar onFilterChange={setFilterTag} />
        <div className={`flex-1 ${!isPro ? 'pl-0' : ''}`}>
          {children}
        </div>
      </div>
    </DashboardContext.Provider>
  );
} 