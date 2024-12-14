'use client';

import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { Prompt, PromptCategory, PromptVisibility } from '@/types/prompt';
import { ref, push, set } from 'firebase/database';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const categories: PromptCategory[] = [
  'General Prompts',
  'Project Initialization & Setup',
  'Frontend Design & Development',
  'Backend Development',
  'Database Design & Integration',
  'Full-Stack Features',
  'Styling & Theming',
  'Responsive Design',
  'Forms & User Input Handling',
  'API Integration & Development',
  'Animations & Interactivity',
  'E-Commerce Features',
  'Authentication & Security',
  'Testing & Debugging',
  'Performance Optimization',
  'DevOps & Deployment',
  'Internationalization & Localization',
  'Real-Time Features',
  'Documentation & Knowledge Sharing',
  'Accessibility & Compliance',
  'Workflow Automation',
  'Third-Party Integration',
  'Algorithm & Data Structures',
  'Custom Components & Utilities'
];

export default function SubmitPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [promptData, setPromptData] = useState<Partial<Prompt>>({
    title: '',
    content: '',
    description: '',
    category: 'General Prompts' as PromptCategory,
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

    if (!user) {
      setError('You must be logged in to submit a prompt');
      setIsLoading(false);
      return;
    }

    if (!promptData.title || !promptData.content || !promptData.description) {
      setError('All fields are required. Please complete the form.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Starting prompt submission...');
      const promptDataToSave: Omit<Prompt, 'id'> = {
        title: promptData.title!,
        content: promptData.content!,
        description: promptData.description!,
        category: promptData.category!,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        downloads: 0,
        visibility: promptData.visibility!,
        isPublished: true,
      };

      console.log('Creating database reference...');
      const promptsRef = ref(db, 'prompts');
      const newPromptRef = push(promptsRef);

      console.log('Saving prompt data...');
      await set(newPromptRef, promptDataToSave);
      console.log('Prompt saved successfully!');

      setSuccessMessage('Prompt submitted successfully!');
      setPromptData({
        title: '',
        content: '',
        description: '',
        category: 'General Prompts' as PromptCategory,
        visibility: 'public' as PromptVisibility,
      });

      console.log('Redirecting to dashboard...');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error saving prompt:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      
      if (err.code === 'PERMISSION_DENIED') {
        setError('Permission denied. Please make sure you are logged in and have the necessary permissions.');
      } else if (err.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(err.message || 'Failed to save prompt. Please try again.');
      }
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
                rows={4}
                className="w-full px-3 py-2 bg-surface rounded-md border border-surface-light focus:outline-none focus:ring-2 focus:ring-primary-accent font-mono"
                placeholder="Enter a brief description of your prompt"
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
