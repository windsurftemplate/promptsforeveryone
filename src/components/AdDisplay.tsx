import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import { useEffect, useState } from 'react';

interface Ad {
  id: string;
  title: string;
  type: 'banner' | 'inline';
  content: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface AdDisplayProps {
  ad: Ad;
}

export default function AdDisplay({ ad }: AdDisplayProps) {
  const { user } = useAuth();
  const [shouldShowAd, setShouldShowAd] = useState(true);

  useEffect(() => {
    const checkUserPlan = async () => {
      if (!user) {
        setShouldShowAd(true);
        return;
      }

      try {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          // Hide ads for paid users or admins
          const shouldHideAds = 
            userData.plan === 'paid' || 
            userData.role === 'admin' || 
            userData.stripeSubscriptionStatus === 'active';
          setShouldShowAd(!shouldHideAds);
        }
      } catch (error) {
        console.error('Error checking user plan:', error);
        setShouldShowAd(true);
      }
    };

    checkUserPlan();
  }, [user]);

  if (!shouldShowAd || ad.status !== 'active') {
    return null;
  }

  return (
    <div 
      className={`relative ${
        ad.type === 'banner' 
          ? 'col-span-full bg-black/40 backdrop-blur-sm border border-[#00ffff]/10 rounded-lg p-4'
          : 'bg-black/40 backdrop-blur-sm border border-[#00ffff]/10 rounded-lg p-4'
      }`}
    >
      <div className="absolute top-2 right-2 text-xs text-[#00ffff]/40">Ad</div>
      <div 
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: ad.content }}
      />
    </div>
  );
} 