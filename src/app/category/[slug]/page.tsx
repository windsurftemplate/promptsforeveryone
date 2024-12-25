'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import Card from '@/components/ui/Card';
import Link from 'next/link';

interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  likes: number;
  downloads: number;
  visibility: 'public' | 'private';
  userId: string;
  userName: string;
  createdAt: string;
}

export default function CategoryPage() {
  const params = useParams();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryName = params?.slug 
    ? (params.slug as string).split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    : '';

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setLoading(true);
        setError(null);

        const promptsRef = ref(db, 'prompts');
        const promptsQuery = query(
          promptsRef,
          orderByChild('category'),
          equalTo(categoryName)
        );

        const snapshot = await get(promptsQuery);
        if (snapshot.exists()) {
          const promptsData = Object.entries(snapshot.val())
            .map(([id, data]: [string, any]) => ({
              id,
              ...data,
            }))
            .filter(prompt => prompt.visibility === 'public')
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          setPrompts(promptsData);
        } else {
          setPrompts([]);
        }
      } catch (err) {
        console.error('Error fetching prompts:', err);
        setError('Failed to load prompts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchPrompts();
    }
  }, [categoryName]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <p className="text-red-500">{error}</p>
          <Link 
            href="/explore"
            className="mt-4 inline-block text-primary hover:text-primary-accent transition-colors"
          >
            Return to Explore
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <Card className="mb-8 p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#A78BFA] via-[#818CF8] to-[#60A5FA] bg-clip-text text-transparent mb-4">
            {categoryName} Prompts
          </h1>
          <p className="text-lg text-white/70">
            Browse our collection of prompts for {categoryName.toLowerCase()}.
          </p>
        </div>
      </Card>

      {/* Prompts Grid */}
      {prompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <Link key={prompt.id} href={`/prompts/${prompt.id}`}>
              <Card className="h-full group hover:bg-white/[0.03] hover:border-white/20 transition-all duration-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors mb-2">
                    {prompt.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-4 line-clamp-2">
                    {prompt.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {prompt.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-white/5 text-white/60 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-sm text-white/50">
                    <span>{prompt.userName}</span>
                    <div className="flex items-center gap-4">
                      <span>❤️ {prompt.likes || 0}</span>
                      <span>⬇️ {prompt.downloads || 0}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-white/70 mb-4">No prompts found in this category yet.</p>
          <Link
            href="/submit"
            className="inline-flex items-center px-6 py-3 text-base font-medium bg-primary hover:bg-primary-accent text-white rounded-lg transition-colors"
          >
            Submit the First Prompt
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </Link>
        </Card>
      )}
    </div>
  );
}
