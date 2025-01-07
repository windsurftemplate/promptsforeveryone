'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ref, query, orderByChild, equalTo, onValue, remove, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { PencilIcon, TrashIcon, ClipboardDocumentIcon, ChartBarIcon, DocumentIcon, FolderIcon } from '@heroicons/react/24/outline';
import { useDashboard } from '@/contexts/DashboardContext';
import PromptModal from '@/components/PromptModal';
import PromptCard from '@/components/PromptCard';
import ProfileSettings from '@/components/dashboard/ProfileSettings';

import { Prompt } from '@/types';

interface Category {
  id: string;
  name: string;
  items: { id: string; name: string }[];
  isPrivate?: boolean;
}

interface SelectedCategory {
  id: string;
  isPrivate: boolean;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const { selectedCategory, selectedSubcategory } = useDashboard();
  const [categories, setCategories] = useState<Category[]>([]);
  const [privateCategories, setPrivateCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'prompts' | 'profile'>('prompts');
  const [userStats, setUserStats] = useState({
    totalPrompts: 0,
    privateCategories: 0,
    publicPrompts: 0
  });

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    // Check user's subscription status
    const userRef = ref(db, `users/${user.uid}`);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const hasAccess = userData.role === 'admin' || userData.stripeSubscriptionStatus === 'active';
        
        // Fetch categories
        const publicCategoriesRef = ref(db, 'categories');
        const privateCategoriesRef = ref(db, `users/${user.uid}/categories`);

        const unsubscribePublic = onValue(publicCategoriesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const categoriesArray = Object.entries(data).map(([id, category]: [string, any]) => ({
              id,
              name: category.name,
              items: Object.entries(category.items || {}).map(([itemId, item]: [string, any]) => ({
                id: itemId,
                name: item.name,
              })),
            }));
            setCategories(categoriesArray);
          }
        });

        // Only fetch private categories if user has access
        if (hasAccess) {
          const unsubscribePrivate = onValue(privateCategoriesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const categoriesArray = Object.entries(data).map(([id, category]: [string, any]) => ({
                id,
                name: category.name,
                items: Object.entries(category.items || {}).map(([itemId, item]: [string, any]) => ({
                  id: itemId,
                  name: item.name,
                })),
                isPrivate: true,
              }));
              setPrivateCategories(categoriesArray);
            }
          });

          return () => {
            unsubscribePublic();
            unsubscribePrivate();
          };
        }

        return () => {
          unsubscribePublic();
        };
      }
    });

    // Fetch user stats
    const userPromptsRef = ref(db, `users/${user.uid}/prompts`);
    const publicPromptsRef = ref(db, 'prompts');

    const fetchStats = async () => {
      onValue(userPromptsRef, (snapshot) => {
        const totalPrompts = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
        setUserStats(prev => ({ ...prev, totalPrompts }));
      });

      onValue(publicPromptsRef, (snapshot) => {
        if (snapshot.exists()) {
          const publicPrompts = Object.values(snapshot.val()).filter((prompt: any) => prompt.userId === user.uid).length;
          setUserStats(prev => ({ ...prev, publicPrompts }));
        }
      });
    };

    fetchStats();

    const fetchPrompts = async () => {
      try {
        let promptsToShow = [];
        const seenPromptIds = new Set();

        if (selectedCategory?.id === 'all-prompts') {
          // Fetch all prompts (both private and public)
          // Fetch private prompts first
          const privatePromptsRef = ref(db, `users/${user.uid}/prompts`);
          try {
            const privateSnapshot = await get(privatePromptsRef);
            if (privateSnapshot.exists()) {
              const privatePrompts = Object.entries(privateSnapshot.val())
                .filter(([id]) => !seenPromptIds.has(id))
                .map(([id, data]: [string, any]) => {
                  seenPromptIds.add(id);
                  return {
                    id: `private-${id}`,
                    ...data,
                    isPrivate: true
                  };
                });
              promptsToShow.push(...privatePrompts);
            }
          } catch (error) {
            console.error('Error fetching private prompts:', error);
          }

          // Fetch public prompts
          const publicPromptsRef = ref(db, 'prompts');
          try {
            const publicSnapshot = await get(publicPromptsRef);
            if (publicSnapshot.exists()) {
              const publicPrompts = Object.entries(publicSnapshot.val())
                .filter(([id, data]: [string, any]) => 
                  data.userId === user.uid && !seenPromptIds.has(id)
                )
                .map(([id, data]: [string, any]) => {
                  seenPromptIds.add(id);
                  return {
                    id: `public-${id}`,
                    ...data,
                    isPrivate: false
                  };
                });
              promptsToShow.push(...publicPrompts);
            }
          } catch (error) {
            console.error('Error fetching public prompts:', error);
          }
        } else if (selectedCategory) {
          // Fetch prompts based on selected category
          if (selectedCategory.isPrivate) {
            // Fetch private prompts for the selected category
            const privatePromptsRef = ref(db, `users/${user.uid}/prompts`);
            try {
              const privateSnapshot = await get(privatePromptsRef);
              if (privateSnapshot.exists()) {
                const privatePrompts = Object.entries(privateSnapshot.val())
                  .filter(([_, data]: [string, any]) => data.categoryId === selectedCategory.id)
                  .map(([id, data]: [string, any]) => ({
                    id: `private-${id}`,
                    ...data,
                    isPrivate: true
                  }));
                promptsToShow.push(...privatePrompts);
              }
            } catch (error) {
              console.error('Error fetching private prompts:', error);
            }
          } else {
            // Fetch public prompts for the selected category
            const publicPromptsRef = ref(db, 'prompts');
            try {
              const publicSnapshot = await get(publicPromptsRef);
              if (publicSnapshot.exists()) {
                const publicPrompts = Object.entries(publicSnapshot.val())
                  .filter(([_, data]: [string, any]) => 
                    data.userId === user.uid && data.categoryId === selectedCategory.id
                  )
                  .map(([id, data]: [string, any]) => ({
                    id: `public-${id}`,
                    ...data,
                    isPrivate: false
                  }));
                promptsToShow.push(...publicPrompts);
              }
            } catch (error) {
              console.error('Error fetching public prompts:', error);
            }
          }
        }

        // Filter by subcategory if selected
        if (selectedSubcategory) {
          promptsToShow = promptsToShow.filter(prompt => prompt.subcategory === selectedSubcategory.id);
        }

        // Sort by creation date
        promptsToShow.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setPrompts(promptsToShow);
      } catch (error) {
        console.error('Error fetching prompts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompts();
  }, [user, selectedCategory, selectedSubcategory]);

  const handleEdit = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
  };

  const handleCloseModal = () => {
    setSelectedPrompt(null);
  };

  const handleEditInModal = (prompt: Prompt) => {
    router.push(`/submit?edit=${prompt.id}`);
    setSelectedPrompt(null);
  };

  const handleDelete = async (promptId: string | undefined) => {
    if (!promptId || !user) return;
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      try {
        console.log('Attempting to delete prompt:', promptId);
        
        // Remove the prefix to get the original ID
        const originalId = promptId.replace(/^(private-|public-)/, '');
        console.log('Original ID after removing prefix:', originalId);
        
        // Try to delete from both locations to ensure it's removed
        const privatePromptRef = ref(db, `users/${user.uid}/prompts/${originalId}`);
        const publicPromptRef = ref(db, `prompts/${originalId}`);
        
        console.log('Checking private path:', `users/${user.uid}/prompts/${originalId}`);
        console.log('Checking public path:', `prompts/${originalId}`);
        
        // Check if the prompt exists in either location
        const [privateSnapshot, publicSnapshot] = await Promise.all([
          get(privatePromptRef),
          get(publicPromptRef)
        ]);
        
        let deleted = false;
        
        if (privateSnapshot.exists()) {
          console.log('Found prompt in private location, deleting...');
          await remove(privatePromptRef);
          deleted = true;
        }
        
        if (publicSnapshot.exists()) {
          const promptData = publicSnapshot.val();
          if (promptData.userId === user.uid) {
            console.log('Found prompt in public location, deleting...');
            await remove(publicPromptRef);
            deleted = true;
          } else {
            throw new Error('You do not have permission to delete this prompt');
          }
        }
        
        if (!deleted) {
          console.error('Prompt not found in database. Details:', {
            promptId,
            originalId,
            privateExists: privateSnapshot.exists(),
            publicExists: publicSnapshot.exists(),
            userId: user.uid
          });
        }
        // Always refresh the page after deletion attempt
        window.location.reload();
      } catch (error) {
        console.error('Error deleting prompt:', error);
        alert('Failed to delete prompt. Please try again.');
      }
    }
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  // Get current category and subcategory names
  const getCurrentCategory = () => {
    if (!selectedCategory) return null;
    const categoryList = selectedCategory.isPrivate ? privateCategories : categories;
    return categoryList.find((cat: Category) => cat.id === selectedCategory.id);
  };

  const getCurrentSubcategory = () => {
    if (!selectedCategory || !selectedSubcategory) return null;
    const category = getCurrentCategory();
    return category?.items.find((item: { id: string; name: string }) => item.id === selectedSubcategory.id);
  };

  const currentCategory = getCurrentCategory();
  const currentSubcategory = getCurrentSubcategory();

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6 flex items-center">
            <div className="rounded-full bg-[#00ffff]/10 p-3 mr-4">
              <DocumentIcon className="h-6 w-6 text-[#00ffff]" />
            </div>
            <div>
              <p className="text-white/60">Total Prompts</p>
              <p className="text-2xl font-bold text-white">{userStats.totalPrompts}</p>
            </div>
          </div>
          <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6 flex items-center">
            <div className="rounded-full bg-[#00ffff]/10 p-3 mr-4">
              <FolderIcon className="h-6 w-6 text-[#00ffff]" />
            </div>
            <div>
              <p className="text-white/60">Private Categories</p>
              <p className="text-2xl font-bold text-white">{userStats.privateCategories}</p>
            </div>
          </div>
          <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6 flex items-center">
            <div className="rounded-full bg-[#00ffff]/10 p-3 mr-4">
              <ChartBarIcon className="h-6 w-6 text-[#00ffff]" />
            </div>
            <div>
              <p className="text-white/60">Public Prompts</p>
              <p className="text-2xl font-bold text-white">{userStats.publicPrompts}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#00ffff]/20 mb-8">
          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'prompts'
                ? 'text-[#00ffff] border-b-2 border-[#00ffff]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Prompts
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'profile'
                ? 'text-[#00ffff] border-b-2 border-[#00ffff]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Profile Settings
          </button>
        </div>

        {activeTab === 'prompts' ? (
          <>
            {/* Header Section with Category Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">
                  {selectedCategory 
                    ? `${selectedCategory.isPrivate ? 'Private' : 'Public'} Prompts`
                    : 'All Prompts'}
                </h1>
                {currentCategory && (
                  <div className="flex items-center mt-2 text-white/60">
                    <span className="text-[#00ffff]">{currentCategory.name}</span>
                    {currentSubcategory && (
                      <>
                        <span className="mx-2">→</span>
                        <span className="text-[#00ffff]">{currentSubcategory.name}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <Link href="/submit">
                <Button variant="default" className="shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                  Create New Prompt
                </Button>
              </Link>
            </div>

            {/* Prompts Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00ffff]"></div>
              </div>
            ) : prompts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/60 mb-4">
                  {selectedCategory 
                    ? `No prompts found in this ${selectedSubcategory ? 'subcategory' : 'category'}.`
                    : "You haven't created any prompts yet."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 m-[15px]">
                {prompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    id={prompt.id || ''}
                    title={prompt.title || ''}
                    description={prompt.description || ''}
                    content={prompt.content || ''}
                    tags={prompt.tags || []}
                    onDelete={(id) => handleDelete(id)}
                    onCopy={(content) => handleCopy(content)}
                    onClick={() => handleEdit(prompt)}
                  />
                ))}
              </div>
            )}

            {selectedPrompt && selectedPrompt.id && (
              <PromptModal
                prompt={selectedPrompt}
                onClose={handleCloseModal}
                onEdit={handleEditInModal}
                onDelete={handleDelete}
              />
            )}
          </>
        ) : (
          <ProfileSettings />
        )}
      </div>
    </div>
  );
}
