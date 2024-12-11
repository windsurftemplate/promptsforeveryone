'use client';

import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { Prompt, PromptCategory, PromptVisibility } from '@/types/prompt';
import { ref, push, set, Database } from 'firebase/database';
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
  const [showPreview, setShowPreview] = useState(false);

  const [promptData, setPromptData] = useState<Partial<Prompt>>({
    title: '',
    description: '',
    content: '',
    category: 'general' as PromptCategory,
    visibility: 'public' as PromptVisibility,
  });

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const tagsArray = promptData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const promptDataToSave: Omit<Prompt, 'id'> = {
        title: promptData.title,
        description: promptData.description,
        content: promptData.content,
        category: promptData.category,
        tags: tagsArray,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        visibility: promptData.visibility,
        isPublished: true,
      };

      const promptsRef = ref(db, 'prompts');
      const newPromptRef = push(promptsRef);
      
      await set(newPromptRef, promptDataToSave);
      console.log('Prompt saved with ID:', newPromptRef.key);
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
    setPromptData(prev => ({
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
            <p className="mt-2 text-text-muted">
              Share your prompt with the community
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
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
                    className="w-full px-3 py-2 bg-white text-black rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary-accent"
                  >
                    <option value="public">Public - Share with everyone</option>
                    <option value="private">Private - Only visible to you</option>
                  </select>
                  <p className="mt-1 text-sm text-text-muted">
                    {promptData.visibility === 'private' 
                      ? 'Only you can see this prompt'
                      : 'Everyone can see and use this prompt'}
                  </p>
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
                  className="w-full px-3 py-2 bg-white text-black rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary-accent"
                  placeholder="Explain what your prompt does and how to use it effectively"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="content" className="block text-sm font-medium">
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
                  <div className="mt-1 block w-full rounded-md border border-border bg-background-light p-4">
                    <pre className="whitespace-pre-wrap font-mono text-sm">
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
                    className="w-full px-3 py-2 bg-white text-black rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary-accent font-mono"
                    placeholder="Enter your prompt here..."
                  />
                )}
                <p className="mt-2 text-sm text-text-muted">
                  Pro tip: Use clear, specific instructions and include examples if helpful
                </p>
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
                  className="w-full px-3 py-2 bg-white text-black rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary-accent"
                  placeholder="Add tags separated by commas (e.g., coding, python, ai)"
                />
                <p className="mt-1 text-sm text-text-muted">
                  Tags help others find your prompt
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
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
