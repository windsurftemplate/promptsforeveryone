'use client';

import React, { useState } from 'react';
import { TrashIcon, ClipboardDocumentIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Button } from './ui/Button';
import { ref, update } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Prompt } from '@/types';

interface PromptModalProps {
  prompt: Prompt;
  onClose: () => void;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
}

const PUBLIC_CATEGORIES = [
  "Code Generation",
  "Debugging",
  "API Development",
  "Testing",
  "Documentation",
  "Database",
  "Security",
  "Performance",
  "UI/UX",
  "DevOps",
  "Mobile Development",
  "Web Development",
  "Machine Learning",
  "Data Analysis",
  "Cloud Computing"
];

const PRIVATE_CATEGORIES = [
  "Personal Projects",
  "Work",
  "Study",
  "Research",
  "Ideas",
  "Experiments",
  "Templates",
  "Drafts",
  "Favorites",
  "Archive"
];

export default function PromptModal({ prompt, onClose, onEdit, onDelete }: PromptModalProps) {
  const [editedPrompt, setEditedPrompt] = useState(prompt);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const promptRef = ref(db, `prompts/${prompt.id}`);
      const updatedPrompt = {
        title: editedPrompt.title || '',
        description: editedPrompt.description || '',
        content: editedPrompt.content || '',
        category: editedPrompt.category || '',
        userId: prompt.userId,
        visibility: 'public',
        createdAt: prompt.createdAt,
        updatedAt: new Date().toISOString()
      };
      await update(promptRef, updatedPrompt);
      setIsSaving(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating prompt:', error);
      setIsSaving(false);
    }
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // Optional: Add toast notification
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
      <div 
        className="bg-black/90 border border-[#00ffff]/20 rounded-lg p-8 max-w-4xl w-full mx-4 shadow-[0_0_50px_rgba(0,255,255,0.1)] max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <input
            type="text"
            value={editedPrompt.title}
            onChange={(e) => setEditedPrompt({ ...editedPrompt, title: e.target.value })}
            className="text-2xl font-bold bg-black/50 text-[#00ffff] border border-[#00ffff]/20 rounded px-2 py-1 w-full mr-4"
            placeholder="Prompt Title"
          />
          <div className="flex gap-3">
            <button
              onClick={() => handleCopy(prompt.content || '')}
              className="text-white/60 hover:text-[#00ffff] transition-colors"
              title="Copy prompt"
            >
              <ClipboardDocumentIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => onDelete(prompt.id || '')}
              className="text-white/60 hover:text-[#00ffff] transition-colors"
              title="Delete prompt"
            >
              <TrashIcon className="w-6 h-6" />
            </button>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-[#00ffff] transition-colors"
              title="Close"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-[#00ffff] font-medium mb-2">Description</h3>
            <textarea
              value={editedPrompt.description}
              onChange={(e) => setEditedPrompt({ ...editedPrompt, description: e.target.value })}
              className="w-full h-32 bg-black/50 text-white/80 border border-[#00ffff]/20 rounded p-2"
              placeholder="Brief description of what this prompt does"
            />
          </div>

          <div>
            <h3 className="text-[#00ffff] font-medium mb-2">Prompt Content</h3>
            <textarea
              value={editedPrompt.content}
              onChange={(e) => setEditedPrompt({ ...editedPrompt, content: e.target.value })}
              className="w-full h-64 bg-black/50 text-white/80 border border-[#00ffff]/20 rounded p-2 font-mono"
              placeholder="Enter your prompt content here"
            />
          </div>

          <div className="flex justify-between items-center text-white/60">
            <div className="flex items-center gap-2">
              <span className="text-[#00ffff]">Category:</span>
              {isEditingCategory ? (
                <div className="flex flex-col gap-2">
                  <select
                    value={editedPrompt.category}
                    onChange={(e) => setEditedPrompt({ ...editedPrompt, category: e.target.value })}
                    className="bg-black/50 text-[#00ffff] border border-[#00ffff]/20 rounded px-2 py-1 hover:border-[#00ffff]/40 transition-colors"
                    style={{
                      background: '#000',
                      outline: 'none'
                    }}
                  >
                    <optgroup label="Public Categories" className="bg-black text-[#00ffff]">
                      {PUBLIC_CATEGORIES.map((category) => (
                        <option key={category} value={category} className="bg-black text-[#00ffff]">
                          {category}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Private Categories" className="bg-black text-[#00ffff]">
                      {PRIVATE_CATEGORIES.map((category) => (
                        <option key={category} value={category} className="bg-black text-[#00ffff]">
                          {category}
                        </option>
                      ))}
                    </optgroup>
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
                  <button
                    onClick={() => setIsEditingCategory(true)}
                    className="text-white/60 hover:text-[#00ffff] transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <div>
              <span className="text-[#00ffff]">Created:</span> 
              {new Date(editedPrompt.createdAt || Date.now()).toLocaleDateString()}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#00ffff] hover:bg-[#00ffff]/80 text-black font-bold px-4 py-2 rounded"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 