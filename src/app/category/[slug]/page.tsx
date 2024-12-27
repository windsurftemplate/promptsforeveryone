'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import PromptModal from '@/components/PromptModal';

interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  categoryId: string;
  category: string;
  subcategory?: string;
  tags: string[];
  likes: number;
  downloads: number;
  visibility: 'public' | 'private';
  userId: string;
  userName: string;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  items: {
    name: string;
    description: string;
    icon: string;
  }[];
}

export default function CategoryPage() {
  const params = useParams();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, fetch the category details
        const categoryRef = ref(db, `categories/${params?.slug}`);
        const categorySnapshot = await get(categoryRef);
        
        if (!categorySnapshot.exists()) {
          setError('Category not found');
          return;
        }

        const categoryData = {
          id: params?.slug as string,
          ...categorySnapshot.val()
        } as Category;
        setCategory(categoryData);

        // Then fetch prompts for this category
        const promptsRef = ref(db, 'prompts');
        const promptsQuery = query(
          promptsRef,
          orderByChild('categoryId'),
          equalTo(params?.slug as string)
        );

        const promptsSnapshot = await get(promptsQuery);
        if (promptsSnapshot.exists()) {
          const promptsData = Object.entries(promptsSnapshot.val())
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
        console.error('Error fetching data:', err);
        setError('Failed to load prompts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (params?.slug) {
      fetchData();
    }
  }, [params?.slug]);

  const filteredPrompts = selectedSubcategory
    ? prompts.filter(prompt => prompt.subcategory === selectedSubcategory)
    : prompts;

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
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Card className="mb-8 p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#A78BFA] via-[#818CF8] to-[#60A5FA] bg-clip-text text-transparent mb-4">
              {category?.name} Prompts
            </h1>
            <p className="text-lg text-white/70">
              {category?.description}
            </p>
          </div>
        </Card>

        {/* Subcategories */}
        {category?.items && category.items.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSubcategory(null)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedSubcategory === null
                    ? 'bg-primary text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                All
              </button>
              {category.items.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setSelectedSubcategory(item.name)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedSubcategory === item.name
                      ? 'bg-primary text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Prompts Grid */}
        {filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt) => (
              <div
                key={prompt.id}
                onClick={() => setSelectedPrompt(prompt)}
                className="cursor-pointer"
              >
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
              </div>
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

      {/* Modal */}
      {selectedPrompt && (
        <PromptModal
          prompt={selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
        />
      )}
    </>
  );
}
