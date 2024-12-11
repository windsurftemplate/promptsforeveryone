'use client';

import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { Prompt, PromptCategory, PromptVisibility } from '@/types/prompt';
import { ref, push, set } from 'firebase/database';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const categories: PromptCategory[] = [
  'general',
  'creative-writing',
  'academic',
  'business',
  'programming',
  'data-analysis',
  'marketing',
  'social-media',
  'email',
  'other',
];

export default function SubmitPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [promptData, setPromptData] = useState<Partial<Prompt>>({
    title: '',
    description: '',
    content: '',
    category: 'general' as PromptCategory,
    visibility: 'public' as PromptVisibility,
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-red-500">
          You must be logged in to submit a prompt.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!promptData.title || !promptData.description || !promptData.content) {
      setError('All fields are required. Please complete the form.');
      setIsLoading(false);
      return;
    }

    try {
      const tagsArray = promptData.tags
        ?.split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0) || [];

      const promptDataToSave: Omit<Prompt, 'id'> = {
        title: promptData.title!,
        description: promptData.description!,
        content: promptData.content!,
        category: promptData.category!,
        tags: tagsArray,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        visibility: promptData.visibility!,
        isPublished: true,
      };

      const promptsRef = ref(db, 'prompts');
      const newPromptRef = push(promptsRef);

      await set(newPromptRef, promptDataToSave);
      setSuccessMessage('Prompt submitted successfully!');
      setPromptData({
        title: '',
        description: '',
        content: '',
        category: 'general' as PromptCategory,
        visibility: 'public' as PromptVisibility,
      });
    } catch (err) {
      console.error('Error saving prompt:', err);
      setError('Failed to save prompt. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPromptData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <div className="p-6 space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Create a New Prompt</h1>
            <p className="mt-2 text-text-muted">Share your prompt with the community.</p>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="text-green-500 text-sm bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={promptData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-surface rounded-md border border-surface-light focus:outline-none focus:ring-2 focus:ring-primary-accent"
                placeholder="Give your prompt a clear, descriptive title"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={promptData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-surface rounded-md border border-surface-light focus:outline-none focus:ring-2 focus:ring-primary-accent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="visibility" className="block text-sm font-medium mb-1">
                  Visibility
                </label>
                <select
                  id="visibility"
                  name="visibility"
                  value={promptData.visibility}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-surface rounded-md border border-surface-light focus:outline-none focus:ring-2 focus:ring-primary-accent"
                >
                  <option value="public">Public - Share with everyone</option>
                  <option value="private">Private - Only visible to you</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={promptData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 bg-surface rounded-md border border-surface-light focus:outline-none focus:ring-2 focus:ring-primary-accent"
                placeholder="Explain what your prompt does and how to use it effectively"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                Prompt Content
              </label>
              <textarea
                id="content"
                name="content"
                value={promptData.content}
                onChange={handleChange}
                required
                rows={8}
                className="w-full px-3 py-2 bg-surface rounded-md border border-surface-light focus:outline-none focus:ring-2 focus:ring-primary-accent font-mono"
                placeholder="Enter your prompt content here"
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium mb-1">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={promptData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-surface rounded-md border border-surface-light focus:outline-none focus:ring-2 focus:ring-primary-accent"
                placeholder="Enter tags separated by commas (e.g., coding, python, ai)"
              />
              <p className="mt-1 text-sm text-text-muted">
                Add relevant tags to help others find your prompt
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? 'Submitting...' : 'Submit Prompt'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
