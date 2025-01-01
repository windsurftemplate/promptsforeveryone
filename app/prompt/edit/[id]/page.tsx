'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { ref, get, update } from 'firebase/database';
import { Prompt, PromptCategory } from '@/types/prompt';
import { Button } from '@/components/ui/Button';

interface EditPromptPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


export default function EditPromptPage({ params }: EditPromptPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Project Initialization & Setup' as PromptCategory,
    visibility: 'private' as 'public' | 'private',
  });

  // Destructure the id directly from params
  const { id } = params;

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchPrompt = async () => {
      try {
        const promptRef = ref(db, `prompts/${id}`);
        const snapshot = await get(promptRef);
        
        if (!snapshot.exists()) {
          setError('Prompt not found');
          return;
        }

        const promptData = snapshot.val();
        if (promptData.userId !== user.uid) {
          setError('You do not have permission to edit this prompt');
          return;
        }

        setPrompt(promptData);
        setFormData({
          title: promptData.title,
          description: promptData.description,
          content: promptData.content,
          category: promptData.category,
          visibility: promptData.visibility,
        });
      } catch (err) {
        setError('Failed to load prompt');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, [id, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !prompt) return;

    try {
      setSaving(true);
      const promptRef = ref(db, `prompts/${id}`);
      
      await update(promptRef, {
        ...formData,
        updatedAt: new Date().toISOString(),
      });

      router.push('/dashboard');
    } catch (err) {
      console.error('Error updating prompt:', err);
      setError('Failed to update prompt');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Prompt</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
