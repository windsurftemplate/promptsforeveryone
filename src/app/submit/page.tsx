'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ref, push, get, update, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import Button from '@/components/ui/Button';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const PRIVATE_CATEGORIES = [
  "Personal Projects",
  "Work",
  "Study",
  "Research",
  "Ideas",
  "Experiments",
  "Templates",
  "Drafts",
  "Favorites",
  "Archive"
];

export default function SubmitPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get('edit');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRef = ref(db, 'categories');
        const snapshot = await get(categoriesRef);
        if (snapshot.exists()) {
          const categoriesData = snapshot.val();
          const categoriesArray = Object.entries(categoriesData)
            .map(([id, data]: [string, any]) => ({
              id,
              name: data.name,
              description: data.description || '',
              icon: data.icon || '📝'
            }))
            .filter(category => category.name);
          setCategories(categoriesArray);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Load prompt data if editing
  useEffect(() => {
    if (editId) {
      const promptRef = ref(db, `prompts/${editId}`);
      get(promptRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setTitle(data.title || '');
          setDescription(data.description || '');
          setContent(data.content || '');
          setCategory(data.category || '');
        }
      });
    }
  }, [editId]);

  useEffect(() => {
    // Check for draft prompt data when component mounts
    const draftPrompt = localStorage.getItem('draftPrompt');
    if (draftPrompt) {
      const promptData = JSON.parse(draftPrompt);
      setTitle(promptData.title || '');
      setDescription(promptData.description || '');
      setContent(promptData.content || '');
      if (promptData.categories) {
        setSelectedCategories(promptData.categories);
      }
      // Clear the draft data after loading
      localStorage.removeItem('draftPrompt');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (!user) {
        throw new Error('You must be logged in to submit a prompt');
      }

      const promptRef = push(ref(db, 'prompts'));
      await set(promptRef, {
        title,
        content,
        description,
        category,
        categories: selectedCategories,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        visibility: 'public'
      });

      // After successful submission, redirect back to chat if we came from there
      const draftPrompt = localStorage.getItem('draftPrompt');
      if (draftPrompt) {
        window.location.href = '/chat';
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Error submitting prompt:', error);
      setError(error.message || 'Failed to submit prompt');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00ffff]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-8">
          {editId ? 'Edit Prompt' : 'Submit New Prompt'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
          <div>
            <label htmlFor="title" className="block text-[#00ffff] font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black/50 text-white/80 border border-[#00ffff]/20 rounded px-3 py-2 focus:border-[#00ffff]/40 transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-[#00ffff] font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-32 bg-black/50 text-white/80 border border-[#00ffff]/20 rounded px-3 py-2 focus:border-[#00ffff]/40 transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-[#00ffff] font-medium mb-2">
              Prompt Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 bg-black/50 text-white/80 border border-[#00ffff]/20 rounded px-3 py-2 focus:border-[#00ffff]/40 transition-colors font-mono"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-[#00ffff] font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-black/50 text-[#00ffff] border border-[#00ffff]/20 rounded px-3 py-2 hover:border-[#00ffff]/40 transition-colors"
              style={{
                background: '#000',
                outline: 'none'
              }}
              required
            >
              <option value="" disabled className="bg-black text-[#00ffff]">Select a category</option>
              <optgroup label="Public Categories" className="bg-black text-[#00ffff]">
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name} className="bg-black text-[#00ffff]">
                    {cat.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Private Categories" className="bg-black text-[#00ffff]">
                {PRIVATE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-black text-[#00ffff]">
                    {cat}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={() => router.back()}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#00ffff] hover:bg-[#00ffff]/80 text-black font-bold px-6 py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : editId ? 'Save Changes' : 'Submit Prompt'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
