'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ref, query, orderByChild, equalTo, onValue, remove } from 'firebase/database';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { PencilIcon, TrashIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { useDashboard } from '@/contexts/DashboardContext';
import PromptModal from '@/components/PromptModal';

import { Prompt } from '../../types/prompt';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { filterTag } = useDashboard();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const promptsRef = ref(db, 'prompts');
    const userPromptsQuery = query(promptsRef, orderByChild('userId'), equalTo(user.uid));

    const unsubscribe = onValue(
      userPromptsQuery,
      (snapshot) => {
        if (!snapshot.exists()) {
          setPrompts([]);
          setIsLoading(false);
          return;
        }

        const promptsData = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
          id,
          ...data,
        }));

        setPrompts(promptsData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching prompts:', error);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  const handleEdit = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
  };

  const handleCloseModal = () => {
    setSelectedPrompt(null);
  };

  const handleEditInModal = (prompt: Prompt) => {
    router.push(`/submit?edit=${prompt.id}`);
    setSelectedPrompt(null);
  };

  const handleDelete = async (promptId: string | undefined) => {
    if (!promptId) return;
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      try {
        const promptRef = ref(db, `prompts/${promptId}`);
        await remove(promptRef);
      } catch (error) {
        console.error('Error deleting prompt:', error);
      }
    }
  };

  const handleCopy = async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.content || '');
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const filteredPrompts = filterTag
    ? prompts.filter(prompt => 
        prompt.category.toLowerCase() === filterTag.toLowerCase()
      )
    : prompts;

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">
            {filterTag ? `${filterTag} Prompts` : 'Your Prompts'}
          </h1>
          <Link href="/submit">
            <Button className="bg-[#00ffff] hover:bg-[#00ffff]/80 text-black font-bold px-6 py-2 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.5)]">
              Create New Prompt
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00ffff]"></div>
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60 mb-4">
              {filterTag 
                ? `No prompts found in the "${filterTag}" category.`
                : "You haven't created any prompts yet."}
            </p>
            <Link href="/submit">
              <Button className="bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] px-6 py-2 rounded-lg transition-all duration-300 border border-[#00ffff]/30">
                Create Your First Prompt
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 m-[15px]">
            {filteredPrompts.map((prompt) => (
              <div
                key={prompt.id}
                onClick={() => handleEdit(prompt)}
                className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6 hover:border-[#00ffff]/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all duration-300 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-white hover:text-[#00ffff] transition-colors">
                    {prompt.title}
                  </h2>
                  <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(prompt);
                      }}
                      className="text-white/60 hover:text-[#00ffff] transition-colors"
                      title="Copy prompt"
                    >
                      <ClipboardDocumentIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(prompt.id);
                      }}
                      className="text-white/60 hover:text-[#00ffff] transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-white/60 mb-4 line-clamp-3">{prompt.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span
                    key={prompt.category}
                    className="text-sm px-3 py-1 rounded-full bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/30"
                  >
                    {prompt.category}
                  </span>
                  {prompt.tags?.map((tag: string, index: number) => (
                    <span
                      key={`${tag}-${index}`}
                      className="text-sm px-3 py-1 rounded-full bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedPrompt && selectedPrompt.id && (
          <PromptModal
            prompt={selectedPrompt as Required<Pick<Prompt, 'id' | 'title' | 'description' | 'content' | 'category' | 'createdAt'>>}
            onClose={handleCloseModal}
            onEdit={handleEditInModal}
            onDelete={handleDelete}
            onCopy={handleCopy}
          />
        )}
      </div>
    </div>
  );
}
