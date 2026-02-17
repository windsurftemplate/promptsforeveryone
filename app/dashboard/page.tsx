'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ref, query, orderByChild, equalTo, onValue, remove, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { PencilIcon, TrashIcon, ClipboardDocumentIcon, ChartBarIcon, DocumentIcon, FolderIcon, HomeIcon, FolderOpenIcon, DocumentTextIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';
import { useDashboard } from '@/contexts/DashboardContext';
import PromptModal from '@/components/PromptModal';
import PromptCard from '@/components/PromptCard';
import ProfileSettings from '@/components/dashboard/ProfileSettings';
import { default as PromptGenerator } from '@/components/prompt-generator/PromptGenerator';
import { default as PromptCoach } from '@/components/prompt-coach/PromptCoach';
import AdDisplay from '@/components/AdDisplay';
import { ads } from '@/config/ads';
import PromptList from '@/components/PromptList';
import { Prompt, PromptCategory, PromptVisibility } from '@/types/prompt';
import { motion } from 'framer-motion';
import TemplateGenerator from '@/components/templates/TemplateGenerator';
import PromptLearning from '@/components/prompt-learning/PromptLearning';
import InteractiveLearning from '@/components/prompt-learning/InteractiveLearning';
import CheatSheets from '@/components/prompt-learning/CheatSheets';

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

interface Ad {
  id: string;
  title: string;
  type: 'banner' | 'inline';
  content: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const { selectedCategory, selectedSubcategory, isSidebarCollapsed, setSelectedCategory, viewMode, setViewMode } = useDashboard();
  const [categories, setCategories] = useState<Category[]>([]);
  const [privateCategories, setPrivateCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'prompts' | 'generator' | 'coach' | 'profile' | 'templates' | 'learn' | 'interactive' | 'cheatsheets'>('prompts');
  const [userStats, setUserStats] = useState({
    totalPrompts: 0,
    privateCategories: 0,
    publicPrompts: 0
  });
  const [visiblePrompts, setVisiblePrompts] = useState<Prompt[]>([]);
  const [hasScrolledToThreshold, setHasScrolledToThreshold] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const [localAds] = useState(ads);

  // Get current category
  const currentCategory = useMemo(() => {
    if (!selectedCategory) return null;
    const categoryList = selectedCategory.isPrivate ? privateCategories : categories;
    return categoryList.find(c => c.id === selectedCategory.id) || null;
  }, [selectedCategory, categories, privateCategories]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      if (scrolledToBottom && visibleCount < prompts.length) {
        setVisibleCount(prevCount => Math.min(prevCount + 20, prompts.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCount, prompts.length]);

  useEffect(() => {
    setVisiblePrompts(prompts.slice(0, visibleCount));
  }, [prompts, visibleCount]);

  // Reset visible count when category changes
  useEffect(() => {
    setVisibleCount(20);
  }, [selectedCategory]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
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
          if (snapshot.exists()) {
            const data = snapshot.val();
            const categoriesArray = Object.entries(data).map(([id, category]: [string, any]) => ({
              id,
              name: category.name,
              subcategories: category.subcategories ? Object.entries(category.subcategories).reduce((acc, [subId, sub]: [string, any]) => ({
                ...acc,
                [subId]: { id: subId, name: sub.name }
              }), {}) : {},
              isPrivate: false,
            }));
            setCategories(categoriesArray);
          }
        });

        // Only fetch private categories if user has access
        if (hasAccess) {
          const unsubscribePrivate = onValue(privateCategoriesRef, (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              const categoriesArray = Object.entries(data).map(([id, category]: [string, any]) => ({
                id,
                name: category.name,
                subcategories: category.subcategories ? Object.entries(category.subcategories).reduce((acc, [subId, sub]: [string, any]) => ({
                  ...acc,
                  [subId]: { id: subId, name: sub.name }
                }), {}) : {},
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

    // Fetch prompts based on category and subcategory
    const promptsRef = selectedCategory?.isPrivate 
      ? ref(db, `users/${user.uid}/prompts`)
      : ref(db, 'prompts');

    const unsubscribePrompts = onValue(promptsRef, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();

        const promptsData = Object.entries(rawData)
          .map(([id, data]: [string, any]) => {
            const prompt = {
              id,
              ...data,
              // Keep original category and subcategory IDs
              categoryId: data.categoryId || data.category || '',
              subcategoryId: data.subcategoryId || '',
              visibility: selectedCategory?.isPrivate ? 'private' : 'public' as PromptVisibility,
            };
            return prompt;
          });

        // Filter by category and subcategory
        const filteredPrompts = promptsData.filter(prompt => {
          // Show all prompts if no category is selected or if "all-prompts" is selected
          if (!selectedCategory || selectedCategory.id === 'all-prompts') {
            return true;
          }

          // Show user's prompts for "my-prompts"
          if (selectedCategory.id === 'my-prompts') {
            return prompt.userId === user.uid;
          }

          // For specific category filtering
          const categoryMatch = selectedCategory.id === prompt.categoryId;

          if (!categoryMatch) {
            return false;
          }

          // For subcategory filtering
          if (selectedSubcategory) {
            return selectedSubcategory.id === prompt.subcategoryId;
          }

          return true;
        });

        // Sort prompts by creation date
        const sortedPrompts = filteredPrompts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setPrompts(sortedPrompts);
      } else {
        setPrompts([]);
      }
      setLoading(false);
    });

    return () => {
      unsubscribePrompts();
    };
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
        const originalId = promptId.replace(/^(private-|public-)/, '');

        const privatePromptRef = ref(db, `users/${user.uid}/prompts/${originalId}`);
        const publicPromptRef = ref(db, `prompts/${originalId}`);

        // Check if the prompt exists in either location
        const [privateSnapshot, publicSnapshot] = await Promise.all([
          get(privatePromptRef),
          get(publicPromptRef)
        ]);
        
        let deleted = false;
        
        if (privateSnapshot.exists()) {
          await remove(privatePromptRef);
          deleted = true;
        }

        if (publicSnapshot.exists()) {
          const promptData = publicSnapshot.val();
          if (promptData.userId === user.uid) {
            await remove(publicPromptRef);
            deleted = true;
          } else {
            throw new Error('You do not have permission to delete this prompt');
          }
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

  // Function to insert ads between prompts
  const promptsWithAds = useMemo(() => {
    const result = [];
    const activeInlineAds = localAds.filter(ad => ad.type === 'inline' && ad.status === 'active');
    const activeBannerAds = localAds.filter(ad => ad.type === 'banner' && ad.status === 'active');
    
    // Add banner ad at the top if available
    if (activeBannerAds.length > 0) {
      result.push(
        <AdDisplay key={`ad-banner-top`} ad={activeBannerAds[0]} />
      );
    }

    visiblePrompts.forEach((prompt, index) => {
      result.push(
        <PromptCard
          key={prompt.id}
          id={prompt.id || ''}
          title={prompt.title || ''}
          description={prompt.description || ''}
          content={prompt.content || ''}
          tags={prompt.tags || []}
          userId={prompt.userId}
          category={prompt.category}
          onDelete={(id) => handleDelete(id)}
          onCopy={(content) => handleCopy(content)}
          onClick={() => handleEdit(prompt)}
        />
      );

      // Insert inline ad every 5 prompts
      if ((index + 1) % 5 === 0 && activeInlineAds.length > 0) {
        const adIndex = Math.floor(index / 5) % activeInlineAds.length;
        result.push(
          <AdDisplay key={`ad-${index}`} ad={activeInlineAds[adIndex]} />
        );
      }
    });

    return result;
  }, [visiblePrompts, localAds, handleDelete, handleCopy, handleEdit]);

  return (
    <div className="min-h-screen bg-background-base">
      {/* Content */}
      <div className="relative py-8">
        {/* Banner ad for non-pro users */}
        {!user?.isPro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-8 mx-4"
          >
            <AdDisplay ad={localAds.find(ad => ad.type === 'banner') ?? localAds[0]} />
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex items-center justify-between mb-8 px-6 pt-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('prompts')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'prompts'
                  ? 'bg-violet/15 text-violet-400 border border-violet/20'
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              My Prompts
            </button>
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'generator'
                  ? 'bg-violet/15 text-violet-400 border border-violet/20'
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              Generator
            </button>
            <button
              onClick={() => setActiveTab('coach')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'coach'
                  ? 'bg-violet/15 text-violet-400 border border-violet/20'
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              Coach
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'templates'
                  ? 'bg-violet/15 text-violet-400 border border-violet/20'
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setActiveTab('learn')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'learn'
                  ? 'bg-violet/15 text-violet-400 border border-violet/20'
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              Learn
            </button>
            <button
              onClick={() => setActiveTab('interactive')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'interactive'
                  ? 'bg-violet/15 text-violet-400 border border-violet/20'
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              Practice
            </button>
            <button
              onClick={() => setActiveTab('cheatsheets')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'cheatsheets'
                  ? 'bg-violet/15 text-violet-400 border border-violet/20'
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              Cheat Sheets
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'profile'
                  ? 'bg-violet/15 text-violet-400 border border-violet/20'
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              Profile
            </button>
          </div>
        </div>

        {activeTab === 'prompts' && (
          <>
            {/* File Path Bar */}
            <div className="bg-black/40 backdrop-blur-sm border border-white/8 rounded-lg p-4 mx-4 mb-4 flex items-center gap-2 group hover:border-violet/20 transition-all duration-300">
              <div className="flex items-center gap-2 text-sm">
                <button 
                  onClick={() => {
                    setSelectedCategory(null);
                  }}
                  className="text-violet-400 hover:text-violet-400/80 transition-colors duration-200 flex items-center gap-1.5"
                >
                  <HomeIcon className="h-4 w-4" />
                  Home
                </button>
                {selectedCategory && (
                  <>
                    <span className="text-violet-400/40">/</span>
                    <button 
                      onClick={() => {
                        setSelectedCategory(selectedCategory);
                      }}
                      className="text-violet-400 hover:text-violet-400/80 transition-colors duration-200 flex items-center gap-1.5"
                    >
                      <FolderOpenIcon className="h-4 w-4" />
                      {selectedCategory.isPrivate ? 'private' : 'public'}
                    </button>
                    {currentCategory && (
                      <>
                        <span className="text-violet-400/40">/</span>
                        <span className="text-violet-400 flex items-center gap-1.5">
                          <FolderIcon className="h-4 w-4" />
                          {currentCategory.name}
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
              <div className="ml-auto px-3 py-1 rounded-full bg-violet/8 border border-white/8">
                <span className="text-violet-400/60 text-sm">
                  {prompts.length} {prompts.length === 1 ? 'prompt' : 'prompts'}
                </span>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex justify-end mx-4 mb-4">
              <div className="flex gap-1">
                <button
                  onClick={() => setViewMode('card')}
                  className={`flex items-center justify-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    viewMode === 'card'
                      ? 'bg-violet/15 text-violet-400'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Squares2X2Icon className="h-4 w-4" />
                  Card
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center justify-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-violet/15 text-violet-400'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ListBulletIcon className="h-4 w-4" />
                  List
                </button>
              </div>
            </div>

            {/* Prompts Content */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-500"></div>
              </div>
            ) : prompts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/60 mb-4">
                  {selectedCategory 
                    ? `No prompts found in this category.`
                    : "You haven't created any prompts yet."}
                </p>
              </div>
            ) : (
              <>
                <div className="mx-4">
                  <PromptList 
                    prompts={prompts} 
                    visibility={selectedCategory?.id === 'my-prompts' ? 'all' : selectedCategory?.isPrivate ? 'private' : 'public'} 
                    ads={!user?.isPro ? localAds.filter(ad => ad.type === 'inline' && ad.status === 'active') : []}
                    adFrequency={5}
                  />
                </div>
                {visibleCount < prompts.length && (
                  <div className="text-center py-8 mt-8">
                    <p className="text-white/60 mb-4">Scroll down to load more prompts</p>
                    <div className="animate-bounce">
                      <svg className="w-6 h-6 text-violet-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {activeTab === 'generator' && (
          <div className="mx-4">
            <PromptGenerator />
          </div>
        )}

        {activeTab === 'coach' && (
          <div className="mx-4">
            <PromptCoach />
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="mx-4">
            <TemplateGenerator />
          </div>
        )}

        {activeTab === 'learn' && (
          <div className="mx-4">
            <PromptLearning />
          </div>
        )}

        {activeTab === 'interactive' && (
          <div className="mx-4">
            <InteractiveLearning />
          </div>
        )}

        {activeTab === 'cheatsheets' && (
          <div className="mx-4">
            <CheatSheets />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="mx-4">
            <ProfileSettings />
          </div>
        )}

        {selectedPrompt && selectedPrompt.id && (
          <PromptModal
            prompt={selectedPrompt}
            onCloseAction={handleCloseModal}
            onEditAction={handleEditInModal}
            onDeleteAction={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
