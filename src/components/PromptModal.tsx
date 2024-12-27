'use client';

import React from 'react';
import Card from '@/components/ui/Card';

interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  categoryId: string;
  category: string;
  subcategory?: string;
  tags: string[];
  likes: number;
  downloads: number;
  visibility: 'public' | 'private';
  userId: string;
  userName: string;
  createdAt: string;
}

interface PromptModalProps {
  prompt: Prompt;
  onClose: () => void;
}

export default function PromptModal({ prompt, onClose }: PromptModalProps) {
  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">{prompt.title}</h2>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-white/70">{prompt.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Content</h3>
              <pre className="whitespace-pre-wrap font-mono text-sm bg-white/5 p-4 rounded-lg">
                {prompt.content}
              </pre>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium mb-2">Category</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-white/70">{prompt.category}</span>
                  {prompt.subcategory && (
                    <>
                      <span className="text-white/30">•</span>
                      <span className="text-white/70">{prompt.subcategory}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span>❤️</span>
                  <span className="text-white/70">{prompt.likes || 0}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span>⬇️</span>
                  <span className="text-white/70">{prompt.downloads || 0}</span>
                </span>
              </div>
            </div>

            {prompt.tags && prompt.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-white/5 text-white/60 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-sm text-white/50">
                <span>By {prompt.userName}</span>
                <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 