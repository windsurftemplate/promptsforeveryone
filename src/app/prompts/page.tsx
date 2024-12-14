'use client';

import { useEffect, useState } from 'react';
import { Prompt } from '@/types/prompt';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '@/lib/firebase';

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  prompts?: string[];
}

interface PromptsByCategory {
  [categoryId: string]: Prompt[];
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [promptsByCategory, setPromptsByCategory] = useState<PromptsByCategory>({});
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesRef = ref(db, 'categories');
        const categoriesSnapshot = await get(categoriesRef);
        let categoriesData: Category[] = [];
        
        if (categoriesSnapshot.exists()) {
          categoriesData = Object.entries(categoriesSnapshot.val()).map(([id, data]) => ({
            id,
            ...(data as Omit<Category, 'id'>),
          }));
          setCategories(categoriesData);
        }

        // Fetch prompts
        const promptsRef = ref(db, 'prompts');
        const publicPromptsQuery = query(
          promptsRef,
          orderByChild('visibility'),
          equalTo('public')
        );
        
        const promptsSnapshot = await get(publicPromptsQuery);
        let promptsData: Prompt[] = [];
        
        if (promptsSnapshot.exists()) {
          promptsData = Object.entries(promptsSnapshot.val()).map(([id, data]) => ({
            id,
            ...(data as Omit<Prompt, 'id'>),
          }));
          setPrompts(promptsData);
        }

        // Organize prompts by category
        const promptsByCat: PromptsByCategory = {};
        categoriesData.forEach(category => {
          promptsByCat[category.id] = promptsData.filter(prompt => 
            prompt.category === category.id ||
            (category.prompts && prompt.id && category.prompts.includes(prompt.id))
          );
        });
        
        setPromptsByCategory(promptsByCat);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-accent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Prompt Categories</h1>
        <Link href="/submit">
          <Button>Submit Prompt</Button>
        </Link>
      </div>

      <div className="space-y-6">
        {categories.map((category) => {
          const categoryPrompts = promptsByCategory[category.id] || [];
          const isExpanded = expandedCategories.includes(category.id);

          return (
            <div key={category.id} className="bg-surface rounded-xl overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-surface-light/10 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="text-left">
                    <h2 className="text-xl font-semibold flex items-center gap-3">
                      {category.name}
                      <span className="text-sm text-white/50 font-normal">
                        {categoryPrompts.length} prompts
                      </span>
                    </h2>
                    <p className="text-white/70 text-sm mt-1">{category.description}</p>
                  </div>
                </div>
                <svg
                  className={`w-6 h-6 transform transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isExpanded && (
                <div className="p-6 border-t border-surface-light/10">
                  {categoryPrompts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categoryPrompts.map((prompt) => (
                        <Link key={prompt.id} href={`/prompts/${prompt.id}`}>
                          <Card className="h-full group cursor-pointer hover:border-primary-accent/30 transition-all duration-200">
                            <div className="p-4">
                              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-accent transition-colors">
                                {prompt.title}
                              </h3>
                              <p className="text-white/70 text-sm mb-3 line-clamp-2">
                                {prompt.description}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {prompt.tags?.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 bg-surface-light text-white/50 rounded-full text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/50 text-center py-4">
                      No prompts in this category yet. Be the first to submit one!
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
