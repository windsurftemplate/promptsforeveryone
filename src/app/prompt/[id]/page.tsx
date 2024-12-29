'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { ref, get, update, remove, set } from 'firebase/database';
import { Prompt, PromptCategory } from '@/types/prompt';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

// Public categories
const publicCategories: PromptCategory[] = [
  'General Prompts',
  'Project Initialization & Setup',
  'Frontend Design & Development',
  'Backend Development',
  'Database Design & Integration',
  'Full-Stack Features',
  'Styling & Theming',
  'Responsive Design',
  'Forms & User Input Handling',
  'API Integration & Development',
  'Animations & Interactivity',
  'E-Commerce Features',
  'Authentication & Security',
  'Testing & Debugging',
  'Performance Optimization',
  'DevOps & Deployment',
  'Internationalization & Localization',
  'Real-Time Features',
  'Documentation & Knowledge Sharing',
  'Accessibility & Compliance',
  'Workflow Automation',
  'Third-Party Integration',
  'Algorithm & Data Structures',
  'Custom Components & Utilities'
];

interface Props {
  params: {
    id: string;
  };
}

export default function PromptPage({ params: { id } }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editedPrompt, setEditedPrompt] = useState<Prompt | null>(null);
  const [privateCategories, setPrivateCategories] = useState<{ name: string; subcategories: string[] }[]>([]);
  const [isPro, setIsPro] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

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

  // Check if prompt is favorited
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user?.uid) return;
      
      try {
        const favoriteRef = ref(db, `users/${user.uid}/favorites/${id}`);
        const snapshot = await get(favoriteRef);
        setIsFavorited(snapshot.exists());
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [user, id]);

  // Toggle favorite
  const toggleFavorite = async () => {
    if (!user?.uid || !isPro || favoriteLoading) return;
    
    setFavoriteLoading(true);
    try {
      const favoriteRef = ref(db, `users/${user.uid}/favorites/${id}`);
      if (isFavorited) {
        await remove(favoriteRef);
      } else {
        await set(favoriteRef, {
          promptId: id,
          addedAt: new Date().toISOString()
        });
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Load prompt data
  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const promptRef = ref(db, `prompts/${id}`);
        const snapshot = await get(promptRef);
        
        if (snapshot.exists()) {
          const promptData = snapshot.val();
          setPrompt({ ...promptData, id });
          setEditedPrompt({ ...promptData, id });
        } else {
          setError('Prompt not found');
        }
      } catch (err) {
        console.error('Error fetching prompt:', err);
        setError('Failed to fetch prompt');
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, [id]);

  // Load private categories
  useEffect(() => {
    const loadPrivateCategories = async () => {
      if (!user?.uid) return;
      
      try {
        const userRef = ref(db, `users/${user.uid}/categories`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        
        if (userData) {
          const categories = Object.values(userData).map((cat: any) => ({
            name: cat.name,
            subcategories: cat.subcategories || []
          }));
          setPrivateCategories(categories);
        }
      } catch (error) {
        console.error('Error loading private categories:', error);
      }
    };

    loadPrivateCategories();
  }, [user?.uid]);

  const handleSave = async () => {
    if (!editedPrompt || !user) return;

    try {
      const promptRef = ref(db, `prompts/${id}`);
      await update(promptRef, {
        ...editedPrompt,
        updatedAt: new Date().toISOString()
      });
      setPrompt(editedPrompt);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating prompt:', err);
      setError('Failed to update prompt');
    }
  };

  const handleDelete = async () => {
    if (!user || !prompt) return;
    
    if (!window.confirm('Are you sure you want to delete this prompt?')) {
      return;
    }

    try {
      const promptRef = ref(db, `prompts/${id}`);
      await remove(promptRef);
      router.push('/dashboard');
    } catch (err) {
      console.error('Error deleting prompt:', err);
      setError('Failed to delete prompt');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00ffff]"></div>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="min-h-screen bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
            <p className="text-white/60">{error || 'Prompt not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{prompt.title}</h1>
              <p className="text-white/60">{prompt.description}</p>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <button
                  onClick={toggleFavorite}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    isPro
                      ? 'hover:bg-[#00ffff]/10 text-[#00ffff]'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!isPro || favoriteLoading}
                  title={isPro ? 'Toggle favorite' : 'Upgrade to Pro to favorite prompts'}
                >
                  {isFavorited ? (
                    <StarIconSolid className="h-6 w-6" />
                  ) : (
                    <StarIcon className="h-6 w-6" />
                  )}
                </button>
              )}
              {prompt.userId === user?.uid && (
                <>
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] rounded-lg transition-all duration-300 border border-[#00ffff]/30"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-black/50 hover:bg-black/70 text-white/60 hover:text-white rounded-lg transition-all duration-300 border border-white/10"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] rounded-lg transition-all duration-300 border border-[#00ffff]/30"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-black/50 hover:bg-red-500/20 text-white/60 hover:text-red-500 rounded-lg transition-all duration-300 border border-white/10"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="space-y-6">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-[#00ffff] text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={editedPrompt?.description}
                    onChange={(e) => setEditedPrompt(prev => prev ? { ...prev, description: e.target.value } : null)}
                    rows={3}
                    className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff]"
                  />
                </div>

                <div>
                  <label className="block text-[#00ffff] text-sm font-medium mb-2">Content</label>
                  <textarea
                    value={editedPrompt?.content}
                    onChange={(e) => setEditedPrompt(prev => prev ? { ...prev, content: e.target.value } : null)}
                    rows={8}
                    className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white font-mono focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff]"
                  />
                </div>

                <div>
                  <label className="block text-[#00ffff] text-sm font-medium mb-2">Category</label>
                  <select
                    value={editedPrompt?.category}
                    onChange={(e) => setEditedPrompt(prev => prev ? { ...prev, category: e.target.value as PromptCategory } : null)}
                    className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff]"
                  >
                    {privateCategories.length > 0 && (
                      <optgroup label="Private Categories" className="bg-black text-white">
                        {privateCategories.map((category) => (
                          <option key={category.name} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    <optgroup label="Public Categories" className="bg-black text-white">
                      {publicCategories.map((category: PromptCategory) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h2 className="text-[#00ffff] text-sm font-medium mb-2">Description</h2>
                  <p className="text-white/80">{prompt.description}</p>
                </div>

                <div>
                  <h2 className="text-[#00ffff] text-sm font-medium mb-2">Content</h2>
                  <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-4">
                    <pre className="whitespace-pre-wrap font-mono text-white/80">{prompt.content}</pre>
                  </div>
                </div>

                <div>
                  <h2 className="text-[#00ffff] text-sm font-medium mb-2">Category</h2>
                  <p className="text-white/80">{prompt.category}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
