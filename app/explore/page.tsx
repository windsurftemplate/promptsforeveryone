'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import { Prompt } from '@/types/prompt';
import Link from 'next/link';
import Card from '@/components/ui/Card';

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function ExplorePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch prompts without ordering (temporary solution)
        const promptsRef = ref(db, 'prompts');
        const promptsSnapshot = await get(promptsRef);
        
        // Fetch categories
        const categoriesRef = ref(db, 'categories');
        const categoriesSnapshot = await get(categoriesRef);
        
        if (promptsSnapshot.exists()) {
          const promptsData = Object.entries(promptsSnapshot.val()).map(([id, data]) => ({
            id,
            ...(data as Omit<Prompt, 'id'>)
          }));
          
          // Filter out private prompts
          const publicPrompts = promptsData.filter(prompt => prompt.visibility === 'public');
          
          // Sort by newest first (client-side sorting)
          publicPrompts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          
          setPrompts(publicPrompts);
        }

        if (categoriesSnapshot.exists()) {
          const categoriesData = Object.entries(categoriesSnapshot.val()).map(([id, data]) => ({
            id,
            ...(data as Omit<Category, 'id'>)
          }));
          setCategories(categoriesData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter prompts based on category
  const filteredPrompts = prompts.filter(prompt => 
    !selectedCategory || prompt.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#00ffff] to-[#0099ff] text-transparent bg-clip-text">
            Explore Prompts
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Discover and use prompts created by the community. Find the perfect prompt for your next project.
          </p>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  !selectedCategory
                    ? 'bg-[#00ffff] text-black'
                    : 'bg-[#00ffff]/10 text-[#00ffff] hover:bg-[#00ffff]/20'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-[#00ffff] text-black'
                      : 'bg-[#00ffff]/10 text-[#00ffff] hover:bg-[#00ffff]/20'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

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
              {filteredPrompts.map((prompt) => (
                <Link 
                  key={prompt.id} 
                  href={`/prompt/${prompt.id}`}
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
                                key={index}
                                className="text-xs px-2 py-1 rounded-full bg-[#00ffff]/10 text-[#00ffff]/80"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center text-sm text-white/50">
                          <span>{prompt.userName}</span>
                          <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* No Results */}
            {filteredPrompts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/50">No prompts found in this category.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
