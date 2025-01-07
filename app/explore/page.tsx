'use client';

import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { Prompt } from '@/types';

interface Category {
  id: string;
  name: string;
  items?: { id: string; name: string }[];
  isPrivate: boolean;
}

interface SelectedCategory {
  id: string;
  isPrivate: boolean;
}

export default function ExplorePage() {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const categoriesRef = ref(db, 'categories');
        const snapshot = await get(categoriesRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const categoriesArray = Object.entries(data).map(([id, category]: [string, any]) => ({
            id,
            name: category.name,
            items: category.items ? Object.entries(category.items).map(([itemId, item]: [string, any]) => ({
              id: itemId,
              name: item.name,
            })) : [],
            isPrivate: false
          }));
          setCategories(categoriesArray);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      }
    };

    // Fetch prompts
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
            .filter(prompt => prompt.visibility === 'public'); // Only show public prompts

          // Filter by category if one is selected
          if (selectedCategory) {
            promptsData = promptsData.filter(prompt => {
              // Match the exact logic from the sidebar
              return prompt.categoryId === selectedCategory.id;
            });
          }

          // Sort by creation date
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
  }, [selectedCategory]); // Re-fetch when selected category changes

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory?.id ? null : { id: categoryId, isPrivate: false });
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Categories Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory?.id === category.id
                    ? 'bg-[#00ffff] text-black'
                    : 'bg-[#00ffff]/10 text-[#00ffff] hover:bg-[#00ffff]/20'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00ffff]"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-400">
            {error}
          </div>
        ) : (
          <>
            {/* Prompts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prompts.map((prompt) => (
                <Link 
                  key={prompt.id} 
                  href={`/prompt/${prompt.id ? prompt.id.replace(/^(private-|public-)/, '') : ''}`}
                >
                  <Card className="p-6 hover:border-[#00ffff]/50 transition-all duration-300 group cursor-pointer h-full">
                    <div className="flex flex-col h-full">
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold text-white group-hover:text-[#00ffff] transition-colors mb-2">
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
                                className="text-xs px-2 py-1 rounded-full bg-[#00ffff]/10 text-[#00ffff]/80"
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
                            className="text-[#00ffff]/60 hover:text-[#00ffff] transition-colors relative"
                            title="Copy prompt"
                          >
                            {copiedPromptId === prompt.id ? (
                              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#00ffff]/90 text-black text-xs px-2 py-1 rounded">
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
  );
}
