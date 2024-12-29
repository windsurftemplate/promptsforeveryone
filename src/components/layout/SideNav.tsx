'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import { StarIcon } from '@heroicons/react/24/outline';

interface SideNavProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function SideNav({ isCollapsed, setIsCollapsed }: SideNavProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user is pro
  useEffect(() => {
    const checkProStatus = async () => {
      if (!user?.uid) return;
      
      try {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setIsPro(userData.isPro === true || userData.stripeSubscriptionStatus === 'active');
        }
      } catch (error) {
        console.error('Error checking pro status:', error);
      }
    };

    checkProStatus();
  }, [user]);

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.uid || !isPro) {
        setLoading(false);
        return;
      }

      try {
        const favoritesRef = ref(db, `users/${user.uid}/favorites`);
        const favoritesSnapshot = await get(favoritesRef);
        
        if (!favoritesSnapshot.exists()) {
          setFavorites([]);
          setLoading(false);
          return;
        }

        const favoritesData = favoritesSnapshot.val();
        const promptsPromises = Object.entries(favoritesData).map(async ([promptId, data]: [string, any]) => {
          const promptRef = ref(db, `prompts/${promptId}`);
          const promptSnapshot = await get(promptRef);
          if (!promptSnapshot.exists()) return null;
          
          const promptData = promptSnapshot.val();
          return {
            id: promptId,
            ...promptData,
            addedAt: data.addedAt
          };
        });

        const promptsData = await Promise.all(promptsPromises);
        const validPrompts = promptsData.filter(prompt => prompt !== null);
        validPrompts.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
        
        setFavorites(validPrompts.slice(0, 5)); // Show only the 5 most recent favorites
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, isPro]);

  if (!user) {
    return null;
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Submit', href: '/submit', icon: '📝' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  return (
    <div className={`transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-64 opacity-100'}`}>
      <nav className="h-full py-6 flex flex-col gap-6">
        {/* Logo/Home Link */}
        <div className="flex items-center justify-between px-6">
          <Link href="/" className="flex-1">
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">
              WindsurfPrompts
            </h1>
          </Link>
          <button
            onClick={() => setIsCollapsed(true)}
            className="text-gray-400 hover:text-white"
          >
            ←
          </button>
        </div>

        {/* Navigation Links */}
        <div className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-white/[0.06] text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Favorites Section */}
        {isPro && (
          <div className="mt-6 px-3">
            <div className="flex items-center gap-2 px-3 mb-3">
              <StarIcon className="h-5 w-5 text-[#00ffff]" />
              <h2 className="text-sm font-semibold text-[#00ffff]">Favorites</h2>
            </div>
            {loading ? (
              <div className="px-3 py-2 text-white/60 text-sm">Loading...</div>
            ) : favorites.length === 0 ? (
              <div className="px-3 py-2 text-white/60 text-sm">No favorites yet</div>
            ) : (
              <div className="space-y-1">
                {favorites.map((prompt) => (
                  <Link
                    key={prompt.id}
                    href={`/prompt/${prompt.id}`}
                    className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                      pathname === `/prompt/${prompt.id}`
                        ? 'bg-white/[0.06] text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    {prompt.title}
                  </Link>
                ))}
                {favorites.length >= 5 && (
                  <Link
                    href="/favorites"
                    className="block px-3 py-2 text-sm text-[#00ffff] hover:text-[#00ffff]/80 transition-colors"
                  >
                    View All →
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}
