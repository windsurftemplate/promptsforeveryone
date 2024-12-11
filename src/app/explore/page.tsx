'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import { PromptCategory, Prompt } from '@/types/prompt';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '@/lib/firebase';
import Link from 'next/link';

const categories: PromptCategory[] = [
  'ChatGPT',
  'Code Assistant',
  'Writing',
  'Translation',
  'Data Analysis',
  'Image Generation',
  'Research',
  'Education',
  'Business',
  'Creative',
  'Other'
];

export default function ExplorePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | 'all'>('all');

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const promptsRef = ref(db, 'prompts');
        const publicPromptsQuery = query(
          promptsRef,
          orderByChild('visibility'),
          equalTo('public')
        );
        
        const snapshot = await get(publicPromptsQuery);
        if (snapshot.exists()) {
          const promptsData = Object.entries(snapshot.val()).map(([id, data]) => ({
            id,
            ...(data as Omit<Prompt, 'id'>),
          }));
          setPrompts(promptsData);
        }
      } catch (error) {
        console.error('Error fetching prompts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  const filteredPrompts = selectedCategory === 'all'
    ? prompts
    : prompts.filter(prompt => prompt.category === selectedCategory);

  const promptsByCategory = categories.reduce((acc, category) => {
    acc[category] = prompts.filter(prompt => prompt.category === category);
    return acc;
  }, {} as Record<PromptCategory, Prompt[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-accent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Explore Prompts</h1>
      
      {/* Category Filter */}
      <div className="mb-8 overflow-hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-none ${
              selectedCategory === 'all'
                ? 'bg-primary-accent text-white'
                : 'bg-surface-light hover:bg-surface-light/80 text-text'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-none ${
                selectedCategory === category
                  ? 'bg-primary-accent text-white'
                  : 'bg-surface-light hover:bg-surface-light/80 text-text'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {selectedCategory === 'all' ? (
        // Show all categories with their prompts
        <div className="space-y-12">
          {categories.map((category) => {
            const categoryPrompts = promptsByCategory[category];
            if (categoryPrompts.length === 0) return null;

            return (
              <section key={category}>
                <h2 className="text-2xl font-bold mb-6">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryPrompts.map((prompt) => (
                    <Link key={prompt.id} href={`/prompts/${prompt.id}`}>
                      <Card className="h-full group cursor-pointer hover:border-primary-accent/30 transition-all duration-200">
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-accent transition-colors">
                            {prompt.title}
                          </h3>
                          <p className="text-text-muted mb-4 line-clamp-2">
                            {prompt.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {prompt.tags?.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-surface-light text-text-muted rounded-full text-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex justify-between items-center text-sm text-text-muted">
                            <span>{prompt.userName}</span>
                            <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        // Show filtered prompts for selected category
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <Link key={prompt.id} href={`/prompts/${prompt.id}`}>
              <Card className="h-full group cursor-pointer hover:border-primary-accent/30 transition-all duration-200">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-accent transition-colors">
                    {prompt.title}
                  </h3>
                  <p className="text-text-muted mb-4 line-clamp-2">
                    {prompt.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {prompt.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-surface-light text-text-muted rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-sm text-text-muted">
                    <span>{prompt.userName}</span>
                    <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {prompts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-muted">No prompts found. Be the first to submit one!</p>
        </div>
      )}
    </div>
  );
}
