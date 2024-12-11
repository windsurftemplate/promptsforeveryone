'use client';

import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { Prompt, PromptCategory, PromptVisibility } from '@/types/prompt';
import { ref, push, set } from 'firebase/database';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const categories: PromptCategory[] = [
  'ChatGPT',
  'Code Assistant',
  'Writing',
  'Translation',
  'Data Analysis',
  'Image Generation',
  'Research',
  'Education',
  'Business',
  'Creative',
  'Other',
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
                className="w-full px-3 py-2 bg-white text-black rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary-accent"
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
                  className="w-full px-3 py-2 bg-white text-black rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary-accent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
             
