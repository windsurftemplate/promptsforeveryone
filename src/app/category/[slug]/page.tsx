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
  content?: string;
  category?: string;
  createdAt?: string;
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

        const categoryRef = ref(db, `categories/${params?.slug}`);
        const categorySnapshot = await get(categoryRef);

        if (!categorySnapshot.exists()) {
          setError('Category not found');
          return;
        }

        const categoryData = {
          id: params?.slug as string,
          ...categorySnapshot.val(),
        } as Category;
        setCategory(categoryData);

        const promptsRef = ref(db, 'prompts');
        const promptsQuery = query(
          promptsRef,
          orderByChild('categoryId'),
          equalTo(params?.slug as string)
        );

        const promptsSnapshot = await get(promptsQuery);
        if (promptsSnapshot.exists()) {
          const promptsData = Object.entries(promptsSnapshot.val()).map(
            ([id, data]: [string, any]) => ({
              id,
              title: data.title,
              description: data.description,
              content: data.content || 'No content available',
              category: data.category || 'Uncategorized',
              createdAt: data.createdAt || new Date().toISOString(),
            })
          );

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
    ? prompts.filter(prompt => prompt.category === selectedSubcategory)
    : prompts;

  const handleEdit = (updatedPrompt: Prompt) => {
    setPrompts(prompts.map(p => p.id === updatedPrompt.id ? updatedPrompt : p));
  };

  const handleDelete = (id: string) => {
    setPrompts(prompts.filter((prompt) => prompt.id !== id));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

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
          <Link href="/explore" className="mt-4 inline-block text-primary hover:text-primary-accent">
            Return to Explore
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
          <h1 className="text-3xl font-bold">{category?.name} Prompts</h1>
          <p>{category?.description}</p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <div key={prompt.id} onClick={() => setSelectedPrompt(prompt)}>
              <Card>
                <h3>{prompt.title}</h3>
                <p>{prompt.description}</p>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {selectedPrompt && (
        <PromptModal
          prompt={{
            ...selectedPrompt,
            content: selectedPrompt.content || '',
            category: selectedPrompt.category || '',
            createdAt: selectedPrompt.createdAt || ''
          }}
          onClose={() => setSelectedPrompt(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCopy={handleCopy}
        />
      )}
    </>
  );
}
