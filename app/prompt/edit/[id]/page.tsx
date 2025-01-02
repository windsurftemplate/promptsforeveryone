'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import { useAuth } from '@/lib/auth';
import { Prompt } from '@/types/prompt';
import { useRouter, useParams } from 'next/navigation';
import { PromptCategory } from '@/types/prompt';

export default function EditPromptPage() {
  const { id } = useParams() as { id: string };  // Get route param directly in Client Component
  const { user } = useAuth();
  const router = useRouter();
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

  // Fetch prompt data dynamically
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchPrompt = async () => {
      try {
        const snapshot = await get(ref(db, `prompts/${id}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          setPrompt({ ...data, id });
          setFormData({
            title: data.title,
            description: data.description,
            content: data.content,
            category: data.category,
            visibility: data.visibility,
          });
        } else {
          setError('Prompt not found');
        }
      } catch (err) {
        setError('Failed to load prompt');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPrompt();
    }
  }, [id, user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => router.push('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl">Edit Prompt</h1>
      <form>
        <label>Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="border p-2 w-full"
        />

        <label>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="border p-2 w-full"
        />

        <label>Content</label>
        <textarea
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          className="border p-2 w-full"
        />

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-500 text-white p-2 rounded mt-4"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}