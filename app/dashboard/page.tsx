'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ref, query, orderByChild, equalTo, onValue, remove } from 'firebase/database';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { PencilIcon, TrashIcon, ClipboardDocumentIcon, ChartBarIcon, DocumentIcon, FolderIcon } from '@heroicons/react/24/outline';
import { useDashboard } from '@/contexts/DashboardContext';
import PromptModal from '@/components/PromptModal';

import { Prompt } from '@/types';

interface Category {
  id: string;
  name: string;
  items: { id: string; name: string }[];
  isPrivate?: boolean;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { selectedCategory, selectedSubcategory } = useDashboard();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [privateCategories, setPrivateCategories] = useState<Category[]>([]);
  const [userStats, setUserStats] = useState({
    totalPrompts: 0,
    privateCategories: 0,
    publicPrompts: 0,
  });

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

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

    let promptsRef;
    if (selectedCategory?.isPrivate) {
      promptsRef = ref(db, `users/${user.uid}/prompts`);
    } else {
      promptsRef = ref(db, 'prompts');
    }

    const unsubscribe = onValue(
      promptsRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setPrompts([]);
          setIsLoading(false);
          return;
        }

        const promptsData = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
          id,
          ...data,
        }));

        const filteredPrompts = promptsData.filter((prompt) => {
          if (!selectedCategory) return true;
          const categoryMatch = prompt.categoryId === selectedCategory.id;
          if (!selectedSubcategory) return categoryMatch;
          return categoryMatch && prompt.subcategoryId === selectedSubcategory.id;
        });

        setPrompts(filteredPrompts);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching prompts:', error);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribePublic();
      unsubscribePrivate();
      unsubscribe();
    };
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
        const promptRef = selectedCategory?.isPrivate
          ? ref(db, `users/${user.uid}/prompts/${promptId}`)
          : ref(db, `prompts/${promptId}`);
        await remove(promptRef);
      } catch (error) {
        console.error('Error deleting prompt:', error);
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
        {/* Stats Section */}
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

        {/* Existing prompt grid and modal */}
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
              <div
                key={prompt.id}
                onClick={() => handleEdit(prompt)}
                className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6 hover:border-[#00ffff]/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all duration-300 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-white hover:text-[#00ffff] transition-colors">
                    {prompt.title}
                  </h2>
                  <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(prompt.content || '');
                      }}
                      className="text-white/60 hover:text-[#00ffff] transition-colors"
                      title="Copy prompt"
                    >
                      <ClipboardDocumentIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(prompt.id);
                      }}
                      className="text-white/60 hover:text-[#00ffff] transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-white/60 mb-4 line-clamp-3">{prompt.description}</p>
                <div className="flex flex-wrap gap-2">
                  {prompt.tags?.map((tag: string, index: number) => (
                    <span
                      key={`${tag}-${index}`}
                      className="text-sm px-3 py-1 rounded-full bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
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
      </div>
    </div>
  );
}
