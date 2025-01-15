'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/solid';

interface Favorite {
  promptId: string;
  addedAt: string;
}

interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
  category: string;
  subcategory: string;
}

export default function FavoritesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<(Favorite & Prompt)[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const isUserPro = userData.role === 'admin' || userData.plan === 'paid';
          setIsPro(isUserPro);
          
          if (!isUserPro) {
            router.push('/pro-plan');
          }
        }
      } catch (error) {
        console.error('Error checking pro status:', error);
      }
    };

    checkAccess();
  }, [user, router]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.uid || !isPro) return;

      try {
        // Get favorites
        const favoritesRef = ref(db, `users/${user.uid}/favorites`);
        const favoritesSnapshot = await get(favoritesRef);
        if (!favoritesSnapshot.exists()) {
          setFavorites([]);
          setLoading(false);
          return;
        }

        const favoritesData = favoritesSnapshot.val();
        
        // Get prompts for each favorite
        const promptsPromises = Object.entries(favoritesData).map(async ([promptId, favorite]: [string, any]) => {
          const promptRef = ref(db, `prompts/${promptId}`);
          const promptSnapshot = await get(promptRef);
          if (!promptSnapshot.exists()) return null;
          
          const promptData = promptSnapshot.val();
          return {
            ...favorite,
            ...promptData,
            id: promptId
          };
        });

        const promptsData = await Promise.all(promptsPromises);
        const validPrompts = promptsData.filter((prompt): prompt is (Favorite & Prompt) => prompt !== null);
        
        // Sort by added date
        validPrompts.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
        
        setFavorites(validPrompts);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, isPro]);

  if (!user || !isPro) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00ffff]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <StarIcon className="h-8 w-8 text-[#00ffff]" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">
            Favorite Prompts
          </h1>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
            <p className="text-white/60">You haven't favorited any prompts yet.</p>
            <Link
              href="/explore"
              className="inline-block mt-4 text-[#00ffff] hover:text-[#00ffff]/80 transition-colors"
            >
              Explore Prompts →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((prompt) => (
              <Link
                key={prompt.id}
                href={`/categories/${prompt.category}/${prompt.subcategory}/prompts/${prompt.id}`}
                className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6 hover:border-[#00ffff]/40 transition-all duration-300"
              >
                <h2 className="text-xl font-semibold text-white mb-2">{prompt.title}</h2>
                <p className="text-white/60 mb-4">{prompt.description}</p>
                <div className="flex justify-between items-center text-sm text-white/40">
                  <span>By {prompt.userName}</span>
                  <span>Added {new Date(prompt.addedAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 