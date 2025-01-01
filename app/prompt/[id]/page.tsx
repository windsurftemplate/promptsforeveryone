'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import { useAuth } from '@/contexts/AuthContext';
import { Prompt } from '@/types/prompt';
import { useRouter } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default function PromptPage({ params: { id } }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchPrompt();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl">{prompt?.title}</h1>
      <p>{prompt?.description}</p>
    </div>
  );
}

