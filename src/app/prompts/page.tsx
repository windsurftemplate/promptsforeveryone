'use client';

import { useEffect, useState } from 'react';
import { Prompt } from '@/types/prompt';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '@/lib/firebase';

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const filteredPrompts = selectedCategory
    ? prompts.filter(prompt => prompt.category === selectedCategory)
    : prompts;

  const categories = Array.from(new Set(prompts.map(prompt => prompt.category)));

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
        <h1 className="text-3xl font-bold">Public Prompts</h1>
        <Link href="/submit">
          <Button>Submit Prompt</Button>
        </Link>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.map((prompt) => (
          <Link key={prompt.id} href={`/prompts/${prompt.id}`}>
            <Card className="h-full group cursor-pointer hover:border-primary-accent/30 transition-all duration-200">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 group-hover:text-primary-accent transition-colors">
                  {prompt.title}
                </h2>
                <p className="text-text-muted mb-4 line-clamp-2">
                  {prompt.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-primary-accent/10 text-primary-accent rounded-full text-sm">
                    {prompt.category}
                  </span>
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

      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-muted">No prompts found. Be the first to submit one!</p>
        </div>
      )}
    </div>
  );
}
