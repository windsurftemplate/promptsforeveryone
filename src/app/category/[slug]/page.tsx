'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getDatabase, ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import { PromptVisibility, PromptCategory } from '@/types/prompt';

interface FirebasePrompt {
  content: string;
  title: string;
  visibility: PromptVisibility;
  category: PromptCategory;
  userId: string;
  userName: string;
  createdAt: number;
  updatedAt: number;
  isPublished: boolean;
  description: string;
  tags: string[];
}

interface Prompt extends Omit<FirebasePrompt, 'createdAt' | 'updatedAt'> {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export default function CategoryPage() {
  const { slug } = useParams();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const categoryName = decodeURIComponent(slug as string) as PromptCategory;

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const promptsQuery = query(
          ref(db, 'prompts'),
          orderByChild('category'),
          equalTo(categoryName)
        );
        
        const snapshot = await get(promptsQuery);
        if (snapshot.exists()) {
          const promptsData = Object.entries(snapshot.val() || {})
            .map(([id, data]) => {
              const prompt = data as FirebasePrompt;
              return {
                ...prompt,
                id,
                createdAt: new Date(prompt.createdAt).toISOString(),
                updatedAt: new Date(prompt.updatedAt).toISOString()
              };
            })
            .filter(prompt => prompt.visibility === 'public' && prompt.isPublished);

          setPrompts(promptsData);
        }
      } catch (error) {
        console.error('Error fetching prompts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPrompts();
    }
  }, [slug, categoryName]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!prompts.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-text-muted">No prompts found</h3>
        <p className="mt-2 text-text-muted">
          Be the first to submit a prompt in this category!
        </p>
        <Link href="/submit" className="mt-4 inline-block text-primary-accent hover:underline">
          Submit a Prompt
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-surface-light pb-4">
        <h1 className="text-3xl font-bold">{categoryName} Prompts</h1>
        <p className="text-text-muted mt-2">
          Browse all public prompts in the {categoryName} category
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map((prompt) => (
          <Link key={prompt.id} href={`/prompt/${prompt.id}`}>
            <Card className="h-full hover:bg-surface-light transition-colors">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-accent transition-colors">
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
                <div className="flex items-center text-sm text-text-muted">
                  <span>{prompt.userName}</span>
                  <span className="mx-2">•</span>
                  <span>{prompt.createdAt}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
