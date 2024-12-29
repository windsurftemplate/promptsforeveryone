'use client';

import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export default function ExplorePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch public categories and prompts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesRef = ref(db, 'categories');
        const categoriesSnapshot = await get(categoriesRef);
        if (categoriesSnapshot.exists()) {
          const categoriesData = categoriesSnapshot.val();
          console.log('Raw categories data:', categoriesData);
          
          const categoriesArray = Object.entries(categoriesData)
            .map(([id, data]: [string, any]) => {
              console.log('Processing category:', id, data);
              if (!data || !data.name) {
                console.warn('Category missing required data:', id, data);
                return null;
              }
              return {
                id,
                name: data.name,
                description: data.description || '',
                icon: data.icon || '📝'
              };
            })
            .filter((category): category is Category => category !== null);
          
          console.log('Processed categories:', categoriesArray);
          setCategories(categoriesArray);
        }

        // Fetch prompts
        const promptsRef = ref(db, 'prompts');
        const promptsSnapshot = await get(promptsRef);
        if (promptsSnapshot.exists()) {
          const promptsData = Object.entries(promptsSnapshot.val())
            .map(([id, data]: [string, any]) => ({
              id,
              ...data,
              categories: data.categories || [],
            }))
            .filter(prompt => prompt.visibility !== 'private');
          setPrompts(promptsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPrompts = selectedCategory
    ? prompts.filter(prompt => 
        prompt.categories?.some((category: string) => 
          category.toLowerCase() === selectedCategory.toLowerCase()
        )
      )
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00ffff]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-8">
          Explore Prompts
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.name?.toLowerCase().replace(/\s+/g, '-') || category.id}`}
              className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6 hover:border-[#00ffff]/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{category.icon || '📝'}</span>
                <h2 className="text-xl font-semibold text-white">{category.name || 'Unnamed Category'}</h2>
              </div>
              <p className="text-white/60">{category.description || 'No description available'}</p>
            </Link>
          ))}
        </div>

        {selectedCategory && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#00ffff] mb-6">
              {selectedCategory} Prompts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6 hover:border-[#00ffff]/40 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">{prompt.title}</h3>
                  <p className="text-white/60 mb-4">{prompt.description}</p>
                  <Link
                    href={`/prompt/${prompt.id}`}
                    className="text-[#00ffff] hover:text-[#00ffff]/80 transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
