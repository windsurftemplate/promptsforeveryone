'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
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

  return (
    <div className="relative min-h-screen">
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <Navbar />
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 