'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ref, push, get, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
}

export default function SubmitPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    tags: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Fetch categories
    const categoriesRef = ref(db, 'categories');
    get(categoriesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const categoriesArray = Object.entries(data).map(([id, category]: [string, any]) => ({
          id,
          name: category.name,
        }));
        setCategories(categoriesArray);
      }
    });
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!user) throw new Error('You must be logged in to submit a prompt');
      if (!selectedCategory) throw new Error('Please select a category');

      const promptData = {
        ...formData,
        userId: user.uid,
        categoryId: selectedCategory,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        createdAt: new Date().toISOString(),
      };

      // Save to public prompts
      const promptsRef = ref(db, 'prompts');
      const newPromptRef = await push(promptsRef, promptData);

      // Also save reference in user's prompts
      const userPromptRef = ref(db, `users/${user.uid}/prompts/${newPromptRef.key}`);
      await set(userPromptRef, promptData);

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00ffff] to-white bg-clip-text text-transparent mb-8">
            Create New Prompt
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-white mb-2">Category</label>
              <select
                className="w-full bg-black/80 border border-[#00ffff]/20 rounded-lg p-3 text-white focus:border-[#00ffff]/50 focus:ring-1 focus:ring-[#00ffff]/50 transition-all"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-black/80 border border-[#00ffff]/20 rounded-lg p-3 text-white focus:border-[#00ffff]/50 focus:ring-1 focus:ring-[#00ffff]/50 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-black/80 border border-[#00ffff]/20 rounded-lg p-3 text-white focus:border-[#00ffff]/50 focus:ring-1 focus:ring-[#00ffff]/50 transition-all h-32"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Prompt Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full bg-black/80 border border-[#00ffff]/20 rounded-lg p-3 text-white focus:border-[#00ffff]/50 focus:ring-1 focus:ring-[#00ffff]/50 transition-all h-48"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full bg-black/80 border border-[#00ffff]/20 rounded-lg p-3 text-white focus:border-[#00ffff]/50 focus:ring-1 focus:ring-[#00ffff]/50 transition-all"
                placeholder="ai, chatbot, writing, etc."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] px-8 py-3 rounded-lg transition-all duration-300 border border-[#00ffff]/30 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Creating...' : 'Create Prompt'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
} 