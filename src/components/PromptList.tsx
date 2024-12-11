'use client';

import { db } from '@/lib/firebase';
import { Prompt } from '@/types/prompt';
import { ref, onValue, query, orderByChild, equalTo, off } from 'firebase/database';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface PromptListProps {
  visibility?: 'all' | 'public' | 'private';
}

export default function PromptList({ visibility = 'all' }: PromptListProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const promptsRef = ref(db, 'prompts');

    // Function to filter prompts based on visibility
    const filterPrompts = (snapshot: any) => {
      if (!snapshot.val()) return [];
      
      const promptsData = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
        id,
        ...data,
      }));

      return promptsData.filter((prompt: Prompt) => {
        if (visibility === 'public') {
          return prompt.userId === user.uid && prompt.visibility === 'public';
        } else if (visibility === 'private') {
          return prompt.userId === user.uid && prompt.visibility === 'private';
        } else {
          return prompt.userId === user.uid;
        }
      });
    };

    const unsubscribe = onValue(promptsRef, (snapshot) => {
      const promptList = filterPrompts(snapshot);
      setPrompts(promptList);
      setLoading(false);
    });

    return () => {
      // Clean up subscription
      off(promptsRef);
    };
  }, [user, visibility]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No prompts found</h3>
        <p className="mt-2 text-sm text-gray-500">
          Get started by creating your first prompt
        </p>
        <div className="mt-6">
          <Link
            href="/submit"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create a Prompt
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {prompts.map((prompt) => (
        <div
          key={prompt.id}
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {prompt.category}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                prompt.visibility === 'private' 
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {prompt.visibility}
              </span>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {prompt.title}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {prompt.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {prompt.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{prompt.userName}</span>
              <span>{prompt.likes} likes</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
