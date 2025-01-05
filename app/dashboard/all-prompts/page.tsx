'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../src/contexts/AuthContext';
import { db } from '../../../src/lib/firebase';
import { ref, onValue } from 'firebase/database';
import { Button } from '../../../src/components/ui/Button';
import Link from 'next/link';

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  subcategory: string;
  createdAt: string;
}

export default function AllPromptsPage() {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const promptsRef = ref(db, `users/${user.uid}/prompts`);
    const unsubscribe = onValue(promptsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const promptsArray = Object.entries(data).map(([id, prompt]: [string, any]) => ({
          id,
          ...prompt,
        }));
        setPrompts(promptsArray);
      } else {
        setPrompts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-[#00ffff]/10 rounded-lg w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-[#00ffff]/5 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">All Your Prompts</h1>
        <Link href="/dashboard/create">
          <Button variant="primary">Create New Prompt</Button>
        </Link>
      </div>

      {prompts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/60 mb-4">You haven't created any prompts yet.</p>
          <Link href="/dashboard/create">
            <Button variant="secondary">Create Your First Prompt</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {prompts.map((prompt) => (
            <Link 
              key={prompt.id} 
              href={`/dashboard/prompts/${prompt.id}`}
              className="block p-6 bg-[#00ffff]/5 hover:bg-[#00ffff]/10 rounded-xl border border-[#00ffff]/20 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold text-white">{prompt.title}</h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-[#00ffff]/10 rounded-full text-[#00ffff] text-sm">
                    {prompt.category}
                  </span>
                  {prompt.subcategory && (
                    <span className="px-3 py-1 bg-[#00ffff]/10 rounded-full text-[#00ffff] text-sm">
                      {prompt.subcategory}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-white/60 line-clamp-2">{prompt.content}</p>
              <div className="mt-4 text-sm text-white/40">
                Created: {new Date(prompt.createdAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 