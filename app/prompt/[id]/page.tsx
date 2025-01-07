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
        // Try to fetch from public prompts first
        const publicSnapshot = await get(ref(db, `prompts/${id}`));
        if (publicSnapshot.exists()) {
          setPrompt({ ...publicSnapshot.val(), id });
          setLoading(false);
          return;
        }

        // If not found in public prompts, try private prompts
        const privateSnapshot = await get(ref(db, `users/${user.uid}/prompts/${id}`));
        if (privateSnapshot.exists()) {
          setPrompt({ ...privateSnapshot.val(), id });
          setLoading(false);
          return;
        }

        // If not found in either location
        setError('Prompt not found');
      } catch (err) {
        console.error('Error fetching prompt:', err);
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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00ffff]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-[#00ffff]/10 text-[#00ffff] rounded-lg hover:bg-[#00ffff]/20 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-white mb-4">{prompt?.title}</h1>
        <p className="text-white/80 mb-6">{prompt?.description}</p>
        <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-4">
          <pre className="text-white/90 whitespace-pre-wrap font-mono">{prompt?.content}</pre>
        </div>
        <div className="mt-6 flex justify-between items-center text-white/60">
          <span>Created by {prompt?.userName}</span>
          <span>{prompt?.createdAt && new Date(prompt.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
