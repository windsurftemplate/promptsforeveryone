'use client';

import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { Prompt } from '@/types';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  description?: string;
  subcategories?: {
    [key: string]: {
      name: string;
      description?: string;
    };
  };
}

interface SelectedCategory {
  categoryId: string;
  subcategoryId?: string;
}

export default function ExplorePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Check if current user is admin
    const checkAdmin = async () => {
      const adminRef = ref(db, `users/${user.uid}/role`);
      const snapshot = await get(adminRef);
      if (!snapshot.exists() || snapshot.val() !== 'admin') {
        router.push('/dashboard');
        return;
      }
    };

    checkAdmin();

    const fetchCategories = async () => {
      try {
        const categoriesRef = ref(db, 'categories');
        const snapshot = await get(categoriesRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const categoriesArray = Object.entries(data).map(([id, category]: [string, any]) => ({
            id,
            ...category
          }));
          setCategories(categoriesArray);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      }
    };

    const fetchPrompts = async () => {
      try {
        const promptsRef = ref(db, 'prompts');
        const snapshot = await get(promptsRef);
        
        if (snapshot.exists()) {
          let promptsData = Object.entries(snapshot.val())
            .map(([id, data]: [string, any]) => ({
              id: `public-${id}`,
              ...data,
              isPrivate: false
            }))
            .filter(prompt => prompt.visibility === 'public');

          if (selectedCategory) {
            promptsData = promptsData.filter(prompt => {
              if (selectedCategory.subcategoryId) {
                return prompt.categoryId === selectedCategory.categoryId && 
                       prompt.subcategoryId === selectedCategory.subcategoryId;
              }
              return prompt.categoryId === selectedCategory.categoryId;
            });
          }

          promptsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setPrompts(promptsData);
        }
      } catch (error) {
        console.error('Error fetching prompts:', error);
        setError('Failed to load prompts');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchPrompts();
  }, [selectedCategory]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory?.categoryId === categoryId && !selectedCategory.subcategoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory({ categoryId });
      if (!expandedCategories.includes(categoryId)) {
        setExpandedCategories(prev => [...prev, categoryId]);
      }
    }
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryId: string) => {
    setSelectedCategory({ categoryId, subcategoryId });
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#8B5CF6] to-white bg-clip-text text-transparent mb-8">
          Admin Explore
        </h1>
        <p className="text-white/60 mb-8">Manage and explore all prompts in the system. Only accessible to administrators.</p>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 shrink-0">
            <div className="bg-black/30 border border-[#8B5CF6]/20 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="space-y-1">
                    <div className="flex items-center">
                      {category.subcategories && Object.keys(category.subcategories).length > 0 && (
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="p-1 hover:bg-[#8B5CF6]/10 rounded transition-colors"
                        >
                          <ChevronDownIcon
                            className={`h-4 w-4 text-[#8B5CF6] transition-transform ${
                              expandedCategories.includes(category.id) ? 'transform rotate-180' : ''
                            }`}
                          />
                        </button>
                      )}
                      <button
                        onClick={() => handleCategoryClick(category.id)}
                        className={`flex-1 px-2 py-1 rounded text-left transition-colors ${
                          selectedCategory?.categoryId === category.id && !selectedCategory.subcategoryId
                            ? 'bg-[#8B5CF6] text-black'
                            : 'text-white hover:bg-[#8B5CF6]/10'
                        }`}
                      >
                        {category.name}
                      </button>
                    </div>

                    {/* Subcategories */}
                    {expandedCategories.includes(category.id) && category.subcategories && (
                      <div className="ml-6 space-y-1">
                        {Object.entries(category.subcategories).map(([id, subcategory]) => (
                          <button
                            key={id}
                            onClick={() => handleSubcategoryClick(category.id, id)}
                            className={`w-full px-2 py-1 rounded text-left text-sm transition-colors ${
                              selectedCategory?.subcategoryId === id
                                ? 'bg-[#8B5CF6] text-black'
                                : 'text-white/80 hover:bg-[#8B5CF6]/10'
                            }`}
                          >
                            {subcategory.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#8B5CF6]"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-400">
                {error}
              </div>
            ) : (
              <>
                {/* Selected Category Info */}
                {selectedCategory && (
                  <div className="mb-6 p-4 bg-black/30 border border-[#8B5CF6]/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white/60">
                        <span>Viewing:</span>
                        <span className="text-[#8B5CF6]">
                          {categories.find(c => c.id === selectedCategory.categoryId)?.name}
                        </span>
                        {selectedCategory.subcategoryId && (
                          <>
                            <span>→</span>
                            <span className="text-[#8B5CF6]">
                              {categories
                                .find(c => c.id === selectedCategory.categoryId)
                                ?.subcategories?.[selectedCategory.subcategoryId]?.name}
                            </span>
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="text-white/40 hover:text-white/60 text-sm"
                      >
                        Clear filter
                      </button>
                    </div>
                  </div>
                )}

                {/* Prompts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {prompts.map((prompt) => (
                    <Link 
                      key={prompt.id} 
                      href={`/categories/${prompt.category}/${prompt.subcategory}/prompts/${prompt.id ? prompt.id.replace(/^(private-|public-)/, '') : ''}`}
                    >
                      <Card className="p-6 hover:border-[#8B5CF6]/50 transition-all duration-300 group cursor-pointer h-full">
                        <div className="flex flex-col h-full">
                          <div className="mb-4">
                            <h3 className="text-xl font-semibold text-white group-hover:text-[#8B5CF6] transition-colors mb-2">
                              {prompt.title}
                            </h3>
                            <p className="text-white/70 text-sm">
                              {prompt.description}
                            </p>
                          </div>
                          
                          <div className="mt-auto">
                            {prompt.tags && prompt.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {prompt.tags.map((tag, index) => (
                                  <span 
                                    key={`${prompt.id}-tag-${index}`}
                                    className="text-xs px-2 py-1 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6]/80"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex justify-between items-center text-sm text-white/50">
                              <div className="flex items-center gap-2">
                                <span>{prompt.userName}</span>
                                <span>•</span>
                                <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(prompt.content);
                                  setCopiedPromptId(prompt.id || null);
                                  setTimeout(() => setCopiedPromptId(null), 2000);
                                }}
                                className="text-[#8B5CF6]/60 hover:text-[#8B5CF6] transition-colors relative"
                                title="Copy prompt"
                              >
                                {copiedPromptId === prompt.id ? (
                                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#8B5CF6]/90 text-black text-xs px-2 py-1 rounded">
                                    Copied!
                                  </span>
                                ) : null}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>

                {prompts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-white/60">
                      {selectedCategory 
                        ? 'No prompts found in this category.'
                        : 'No prompts available.'
                      }
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
