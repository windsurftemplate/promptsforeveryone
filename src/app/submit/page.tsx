'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ref, push, get, update } from 'firebase/database';
import { db } from '@/lib/firebase';
import Button from '@/components/ui/Button';

const PUBLIC_CATEGORIES = [
  "Code Generation",
  "Debugging",
  "API Development",
  "Testing",
  "Documentation",
  "Database",
  "Security",
  "Performance",
  "UI/UX",
  "DevOps",
  "Mobile Development",
  "Web Development",
  "Machine Learning",
  "Data Analysis",
  "Cloud Computing"
];

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

  React.useEffect(() => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const promptData = {
        title,
        description,
        content,
        category,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      };

      if (editId) {
        const promptRef = ref(db, `prompts/${editId}`);
        await update(promptRef, {
          ...promptData,
          updatedAt: new Date().toISOString(),
        });
      } else {
        const promptsRef = ref(db, 'prompts');
        await push(promptsRef, promptData);
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting prompt:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    router.push('/login');
    return null;
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
                {PUBLIC_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-black text-[#00ffff]">
                    {cat}
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
