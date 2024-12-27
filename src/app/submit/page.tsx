'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ref, get, push, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Category {
  id: string;
  name: string;
  items?: { name: string }[];
}

export default function SubmitPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [promptData, setPromptData] = useState({
    title: '',
    description: '',
    content: '',
    categoryId: '',
    subcategory: '',
    tags: '',
  });

  // Load categories from Firebase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesRef = ref(db, 'categories');
        const snapshot = await get(categoriesRef);
        
        if (snapshot.exists()) {
          const categoriesData = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
            id,
            ...data
          }));
          setCategories(categoriesData);
          if (categoriesData.length > 0) {
            const firstCategory = categoriesData[0];
            setPromptData(prev => ({ 
              ...prev, 
              categoryId: firstCategory.id,
              subcategory: firstCategory.items?.[0]?.name || ''
            }));
          }
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        setError('Failed to load categories');
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to submit a prompt');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const promptsRef = ref(db, 'prompts');
      const newPromptRef = push(promptsRef);

      // Get the selected category
      const category = categories.find(cat => cat.id === promptData.categoryId);
      if (!category) {
        throw new Error('Invalid category selected');
      }

      const tagsArray = promptData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const newPrompt = {
        title: promptData.title,
        description: promptData.description,
        content: promptData.content,
        categoryId: promptData.categoryId,
        category: category.name,
        subcategory: promptData.subcategory,
        tags: tagsArray,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        downloads: 0,
        visibility: 'public',
      };

      await set(newPromptRef, newPrompt);
      setSuccessMessage('Prompt submitted successfully!');
      router.push('/dashboard');
    } catch (err) {
      console.error('Error submitting prompt:', err);
      setError('Failed to submit prompt. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'categoryId') {
      const category = categories.find(cat => cat.id === value);
      setPromptData(prev => ({
        ...prev,
        categoryId: value,
        subcategory: category?.items?.[0]?.name || ''
      }));
    } else {
      setPromptData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Get the current category's subcategories
  const currentCategory = categories.find(cat => cat.id === promptData.categoryId);
  const subcategories = currentCategory?.items || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-white mb-8">Submit a Prompt</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg p-3 text-sm">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1 text-white">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={promptData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Give your prompt a clear, descriptive title"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium mb-1 text-white">
                    Category
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={promptData.categoryId}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id} className="bg-[#1e293b] text-white">
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="subcategory" className="block text-sm font-medium mb-1 text-white">
                    Subcategory
                  </label>
                  <select
                    id="subcategory"
                    name="subcategory"
                    value={promptData.subcategory}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {subcategories.map((item) => (
                      <option key={item.name} value={item.name} className="bg-[#1e293b] text-white">
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1 text-white">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={promptData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Explain what your prompt does and how to use it effectively"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="content" className="block text-sm font-medium text-white">
                    Prompt Content
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-sm"
                  >
                    {showPreview ? 'Edit' : 'Preview'}
                  </Button>
                </div>
                {showPreview ? (
                  <div className="w-full rounded-lg border border-white/10 bg-white/5 p-4">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-white/90">
                      {promptData.content || 'No content yet'}
                    </pre>
                  </div>
                ) : (
                  <textarea
                    id="content"
                    name="content"
                    value={promptData.content}
                    onChange={handleChange}
                    required
                    rows={8}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                    placeholder="Enter your prompt content here"
                  />
                )}
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium mb-1 text-white">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={promptData.tags}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Add tags separated by commas (e.g., coding, python, ai)"
                />
                <p className="mt-1 text-sm text-white/50">
                  Tags help others find your prompt
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
              >
                {isLoading ? 'Saving...' : 'Save Prompt'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
