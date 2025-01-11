'use client';

import React, { useState, useEffect } from 'react';
import { TrashIcon, ClipboardDocumentIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Button } from './ui/Button';
import { ref, update, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Prompt } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface PromptModalProps {
  prompt: Prompt;
  onClose: () => void;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
}

interface Category {
  id: string;
  name: string;
}

export default function PromptModal({ prompt, onClose, onEdit, onDelete }: PromptModalProps) {
  const { user } = useAuth();
  const [editedPrompt, setEditedPrompt] = useState(prompt);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Check if current user is the creator
  const isCreator = user && user.uid === prompt.userId;

  useEffect(() => {
    // Fetch categories from Firebase
    const categoriesRef = ref(db, 'categories');
    const unsubscribe = onValue(categoriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const categoriesArray = Object.entries(data).map(([id, category]: [string, any]) => ({
          id,
          name: category.name,
        }));
        setCategories(categoriesArray);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!prompt.userId) {
      console.error('No user ID found for prompt');
      return;
    }

    try {
      setIsSaving(true);
      
      // Remove the prefix to get the original ID
      const originalId = editedPrompt.id?.replace(/^(private-|public-)/, '');
      if (!originalId) {
        console.error('No prompt ID found');
        return;
      }

      // Check user authorization
      if (!user || user.uid !== prompt.userId) {
        console.error('User not authorized to edit this prompt');
        return;
      }
      
      // Determine the correct path based on visibility
      const promptPath = editedPrompt.visibility === 'private'
        ? `users/${user.uid}/prompts/${originalId}`
        : `prompts/${originalId}`;
      
      const promptRef = ref(db, promptPath);

      // Only include fields that have values
      const updatedPrompt: Record<string, any> = {
        title: editedPrompt.title || prompt.title || '',
        description: editedPrompt.description || prompt.description || '',
        content: editedPrompt.content || prompt.content || '',
        categoryId: editedPrompt.categoryId || prompt.categoryId || '',
        visibility: editedPrompt.visibility || prompt.visibility || 'public',
        userId: user.uid,
        createdAt: prompt.createdAt,
        updatedAt: new Date().toISOString()
      };

      // Only add userName if it exists
      if (user.displayName || user.email) {
        updatedPrompt.userName = user.displayName || user.email;
      }
      
      await update(promptRef, updatedPrompt);
      onClose();
    } catch (error) {
      console.error('Error updating prompt:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setEditedPrompt(prev => ({
      ...prev,
      categoryId
    }));
    setIsEditingCategory(false);
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
            onChange={(e) => isCreator && setEditedPrompt({ ...editedPrompt, title: e.target.value })}
            className="text-2xl font-bold bg-black/50 text-[#00ffff] border border-[#00ffff]/20 rounded px-2 py-1 w-full mr-4"
            placeholder="Prompt Title"
            readOnly={!isCreator}
          />
          <div className="flex gap-3">
            <button
              onClick={() => handleCopy(prompt.content || '')}
              className="text-white/60 hover:text-[#00ffff] transition-colors"
              title="Copy prompt"
            >
              <ClipboardDocumentIcon className="w-6 h-6" />
            </button>
            {isCreator && (
              <button
                onClick={() => onDelete(prompt.id || '')}
                className="text-white/60 hover:text-[#00ffff] transition-colors"
                title="Delete prompt"
              >
                <TrashIcon className="w-6 h-6" />
              </button>
            )}
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
              onChange={(e) => isCreator && setEditedPrompt({ ...editedPrompt, description: e.target.value })}
              className="w-full h-32 bg-black/50 text-white/80 border border-[#00ffff]/20 rounded p-2"
              placeholder="Brief description of what this prompt does"
              readOnly={!isCreator}
            />
          </div>

          <div>
            <h3 className="text-[#00ffff] font-medium mb-2">Prompt Content</h3>
            <textarea
              value={editedPrompt.content}
              onChange={(e) => isCreator && setEditedPrompt({ ...editedPrompt, content: e.target.value })}
              className="w-full h-64 bg-black/50 text-white/80 border border-[#00ffff]/20 rounded p-2 font-mono"
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
                    value={editedPrompt.categoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="bg-black/50 text-[#00ffff] border border-[#00ffff]/20 rounded px-2 py-1 hover:border-[#00ffff]/40 transition-colors"
                    style={{
                      background: '#000',
                      outline: 'none'
                    }}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
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
                    {categories.find(c => c.id === editedPrompt.categoryId)?.name || 'No category'}
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
            <div>
              <span className="text-[#00ffff]">Created:</span> 
              {new Date(editedPrompt.createdAt || Date.now()).toLocaleDateString()}
            </div>
          </div>

          {isCreator && (
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
          )}
        </div>
      </div>
    </div>
  );
} 