'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ref, query, orderByChild, equalTo, onValue, remove, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { PencilIcon, TrashIcon, ClipboardDocumentIcon, ChartBarIcon, DocumentIcon, FolderIcon, HomeIcon, FolderOpenIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useDashboard } from '@/contexts/DashboardContext';
import PromptModal from '@/components/PromptModal';
import PromptCard from '@/components/PromptCard';
import ProfileSettings from '@/components/dashboard/ProfileSettings';

import { Prompt } from '@/types';

interface Category {
  id: string;
  name: string;
  items?: { id: string; name: string }[];
  isPrivate?: boolean;
  subcategories?: { [key: string]: { id: string; name: string } };
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
  const { selectedCategory, selectedSubcategory, setSelectedCategory, setSelectedSubcategory } = useDashboard();
  const [categories, setCategories] = useState<Category[]>([]);
  const [privateCategories, setPrivateCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'prompts' | 'profile'>('prompts');
  const [userStats, setUserStats] = useState({
    totalPrompts: 0,
    privateCategories: 0,
    publicPrompts: 0
  });

  // Get current category and subcategory
  const currentCategory = useMemo(() => {
    if (!selectedCategory) return null;
    const categoryList = selectedCategory.isPrivate ? privateCategories : categories;
    return categoryList.find(c => c.id === selectedCategory.id) || null;
  }, [selectedCategory, categories, privateCategories]);

  const currentSubcategory = useMemo(() => {
    if (!selectedSubcategory || !currentCategory?.subcategories) return null;
    const subcategory = currentCategory.subcategories[selectedSubcategory.id];
    return subcategory || null;
  }, [selectedSubcategory, currentCategory]);

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
              subcategories: category.subcategories ? Object.entries(category.subcategories).reduce((acc, [subId, sub]: [string, any]) => ({
                ...acc,
                [subId]: { id: subId, name: sub.name }
              }), {}) : {},
              items: [],
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
                subcategories: category.subcategories ? Object.entries(category.subcategories).reduce((acc, [subId, sub]: [string, any]) => ({
                  ...acc,
                  [subId]: { id: subId, name: sub.name }
                }), {}) : {},
                items: [],
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

        // Check if user has access to private prompts
        const userRef = ref(db, `users/${user.uid}`);
        const userSnapshot = await get(userRef);
        const userData = userSnapshot.val();
        const hasAccess = userData?.role === 'admin' || userData?.plan === 'paid' || userData?.stripeSubscriptionStatus === 'active';

        if (selectedCategory?.id === 'all-prompts') {
          // Fetch private prompts only for users with access
          if (hasAccess) {
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
          }

          // Always fetch public prompts for all users
          const publicPromptsRef = ref(db, 'prompts');
          try {
            const publicSnapshot = await get(publicPromptsRef);
            if (publicSnapshot.exists()) {
              const publicPrompts = Object.entries(publicSnapshot.val())
                .filter(([id]) => !seenPromptIds.has(id))
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
            // Only fetch private prompts if user has access
            if (hasAccess) {
              const privatePromptsRef = ref(db, `users/${user.uid}/prompts`);
              try {
                const privateSnapshot = await get(privatePromptsRef);
                if (privateSnapshot.exists()) {
                  const privatePrompts = Object.entries(privateSnapshot.val())
                    .filter(([_, data]: [string, any]) => {
                      const categoryMatch = data.categoryId === selectedCategory.id;
                      if (!selectedSubcategory) return categoryMatch;
                      return categoryMatch && data.subcategoryId === selectedSubcategory.id;
                    })
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
            }
          } else {
            // Fetch public prompts for the selected category (available to all users)
            const publicPromptsRef = ref(db, 'prompts');
            try {
              const publicSnapshot = await get(publicPromptsRef);
              if (publicSnapshot.exists()) {
                const publicPrompts = Object.entries(publicSnapshot.val())
                  .filter(([_, data]: [string, any]) => {
                    const categoryMatch = data.categoryId === selectedCategory.id;
                    if (!selectedSubcategory) return categoryMatch;
                    return categoryMatch && data.subcategoryId === selectedSubcategory.id;
                  })
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

        // Sort all prompts by creation date
        promptsToShow.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setPrompts(promptsToShow);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching prompts:', error);
        setError('Failed to load prompts');
        setLoading(false);
      }
    };

    fetchPrompts();
  }, [user, selectedCategory, selectedSubcategory]);

  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleEdit = (prompt: Prompt) => {
    const slug = createSlug(prompt.title);
    window.history.pushState({}, '', `/dashboard/${slug}`);
    setSelectedPrompt(prompt);
  };

  const handleCloseModal = () => {
    window.history.pushState({}, '', '/dashboard');
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
            {/* File Path Bar */}
            <div className="bg-black/40 backdrop-blur-sm border border-[#00ffff]/10 rounded-lg p-4 mb-8 flex items-center gap-2 group hover:border-[#00ffff]/20 transition-all duration-300">
              <div className="flex items-center gap-2 text-sm">
                <button 
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSubcategory(null);
                  }}
                  className="text-[#00ffff] hover:text-[#00ffff]/80 transition-colors duration-200 flex items-center gap-1.5"
                >
                  <HomeIcon className="h-4 w-4" />
                  Home
                </button>
                {selectedCategory && (
                  <>
                    <span className="text-[#00ffff]/40">/</span>
                    <button 
                      onClick={() => {
                        setSelectedCategory(selectedCategory);
                        setSelectedSubcategory(null);
                      }}
                      className="text-[#00ffff] hover:text-[#00ffff]/80 transition-colors duration-200 flex items-center gap-1.5"
                    >
                      <FolderOpenIcon className="h-4 w-4" />
                      {selectedCategory.isPrivate ? 'private' : 'public'}
                    </button>
                    {currentCategory && (
                      <>
                        <span className="text-[#00ffff]/40">/</span>
                        <span className="text-[#00ffff] flex items-center gap-1.5">
                          <FolderIcon className="h-4 w-4" />
                          {currentCategory.name}
                        </span>
                      </>
                    )}
                    {currentSubcategory && (
                      <>
                        <span className="text-[#00ffff]/40">/</span>
                        <span className="text-[#00ffff] flex items-center gap-1.5">
                          <DocumentTextIcon className="h-4 w-4" />
                          {currentSubcategory.name}
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
              <div className="ml-auto flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ffff]/5 border border-[#00ffff]/10">
                <DocumentIcon className="h-4 w-4 text-[#00ffff]/60" />
                <span className="text-[#00ffff]/60 text-sm">
                  {prompts.length} {prompts.length === 1 ? 'prompt' : 'prompts'}
                </span>
              </div>
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
