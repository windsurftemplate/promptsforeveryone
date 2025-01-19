'use client';

import React, { useState, useEffect } from 'react';
import { TrashIcon, ClipboardDocumentIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Button } from './ui/Button';
import { ref, update, onValue, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Prompt, PromptCategory } from '@/types/prompt';
import { useAuth } from '@/contexts/AuthContext';

interface PromptModalProps {
  prompt: Prompt;
  onCloseAction: () => void;
  onEditAction: (prompt: Prompt) => void;
  onDeleteAction: (id: string) => void;
}

interface Category {
  id: string;
  name: string;
}

export default function PromptModal({ prompt, onCloseAction, onEditAction, onDeleteAction }: PromptModalProps) {
  const { user } = useAuth();
  const [editedPrompt, setEditedPrompt] = useState<Prompt>(prompt);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [copied, setCopied] = useState(false);
  const isCreator = user?.uid === prompt.userId;

  useEffect(() => {
    setEditedPrompt(prompt);
  }, [prompt]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!isCreator) return;
    onEditAction(editedPrompt);
  };

  const handleCategoryChange = (category: PromptCategory) => {
    setEditedPrompt(prev => ({ ...prev, category }));
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCloseAction}
    >
      <div 
        className="bg-black/90 border border-[#00ffff]/20 rounded-lg p-8 max-w-4xl w-full mx-4 shadow-[0_0_50px_rgba(0,255,255,0.1)] max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <input
            type="text"
            value={editedPrompt.title}
            onChange={(e) => isCreator && setEditedPrompt({ ...editedPrompt, title: e.target.value })}
            className="text-2xl font-bold bg-black/50 text-[#00ffff] border border-[#00ffff]/20 rounded px-2 py-1 w-full mr-4"
            placeholder="Prompt Title"
            readOnly={!isCreator}
          />
          <div className="flex gap-3">
            <button
              onClick={() => handleCopy(prompt.content)}
              className="text-white/60 hover:text-[#00ffff] transition-colors"
              title="Copy prompt"
            >
              <ClipboardDocumentIcon className="w-6 h-6" />
            </button>
            {isCreator && (
              <button
                onClick={() => onDeleteAction(prompt.id || '')}
                className="text-white/60 hover:text-[#00ffff] transition-colors"
                title="Delete prompt"
              >
                <TrashIcon className="w-6 h-6" />
              </button>
            )}
            <button
              onClick={onCloseAction}
              className="text-white/60 hover:text-[#00ffff] transition-colors"
              title="Close"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-[#00ffff] font-medium mb-2">Prompt Content</h3>
            <textarea
              value={editedPrompt.content}
              onChange={(e) => isCreator && setEditedPrompt({ ...editedPrompt, content: e.target.value })}
              className="w-full h-[500px] bg-black/50 text-white/80 border border-[#00ffff]/20 rounded p-2 font-mono"
              placeholder="Enter your prompt content here"
              readOnly={!isCreator}
            />
          </div>

          <div className="flex justify-between items-center text-white/60">
            <div className="flex items-center gap-2">
              <span className="text-[#00ffff]">Category:</span>
              {isCreator && isEditingCategory ? (
                <div className="flex flex-col gap-2">
                  <select
                    value={editedPrompt.category}
                    onChange={(e) => handleCategoryChange(e.target.value as PromptCategory)}
                    className="w-full p-2 rounded bg-black/50 border border-[#00ffff]/20"
                  >
                    <option value="">Select a category</option>
                    {['General', 'Development', 'Design', 'Writing', 'Business', 'Education', 'Other'].map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={() => setIsEditingCategory(false)}
                    className="bg-[#00ffff]/20 hover:bg-[#00ffff]/30 text-[#00ffff] px-3 py-1 rounded text-sm"
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-white/80 px-2 py-1 rounded bg-[#00ffff]/10 border border-[#00ffff]/20">
                    {editedPrompt.category}
                  </span>
                  {isCreator && (
                    <button
                      onClick={() => setIsEditingCategory(true)}
                      className="text-white/60 hover:text-[#00ffff] transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {isCreator && (
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                className="bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] px-4 py-2 rounded-md"
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 