'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import { useAuth } from '@/contexts/AuthContext';
import { Prompt } from '@/types/prompt';
import { useRouter, useParams } from 'next/navigation';

export default function PromptPage() {
  const { id } = useParams(); // Dynamically get the 'id' from the route
  const { user } = useAuth();
  const router = useRouter();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchPrompt = async () => {
      try {
        const snapshot = await get(ref(db, `prompts/${id}`));
        if (snapshot.exists()) {
          setPrompt({ ...snapshot.val(), id });
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
  }, [id, user]);

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
      <h1 className="text-3xl">{prompt?.title}</h1>
      <p>{prompt?.description}</p>
    </div>
  );
}
