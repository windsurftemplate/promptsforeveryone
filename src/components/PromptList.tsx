'use client';

import { db } from '@/lib/firebase';
import { Prompt } from '@/types/prompt';
import { ref, onValue, query, orderByChild, equalTo, off, remove, get, update } from 'firebase/database';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import DeleteConfirmationDialog from './ui/DeleteConfirmationDialog';

interface PromptListProps {
  visibility?: 'all' | 'public' | 'private';
}

export default function PromptList({ visibility = 'all' }: PromptListProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const [deletePromptId, setDeletePromptId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;

    const promptsRef = ref(db, 'prompts');
    const userPromptsQuery = query(promptsRef, orderByChild('userId'), equalTo(user.uid));

    const unsubscribe = onValue(userPromptsQuery, (snapshot) => {
      if (!snapshot.val()) {
        setPrompts([]);
        setLoading(false);
        return;
      }
      
      const promptsData = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
        id,
        ...data,
      }));

      // Filter prompts based on visibility
      const filteredPrompts = promptsData.filter(prompt => {
        if (visibility === 'public') {
          return !prompt.visibility || prompt.visibility === 'public';
        } else if (visibility === 'private') {
          return prompt.visibility === 'private';
        }
        return true;
      });

      setPrompts(filteredPrompts);
      setLoading(false);
    });

    return () => {
      off(userPromptsQuery);
    };
  }, [user, visibility]);

  const handleEdit = (promptId: string) => {
    router.push(`/prompt/edit/${promptId}`);
  };

  const handleDeleteClick = (prompt: Prompt) => {
    setPromptToDelete(prompt);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!user || !promptToDelete) return;

    try {
      setIsDeleting(true);
      // First check if the prompt still exists and belongs to the user
      const promptRef = ref(db, `prompts/${promptToDelete.id}`);
      const snapshot = await get(promptRef);
      
      if (!snapshot.exists()) {
        throw new Error('Prompt not found');
      }
      
      const promptData = snapshot.val();
      if (promptData.userId !== user.uid) {
        throw new Error('You do not have permission to delete this prompt');
      }

      // Delete the prompt
      await remove(promptRef);
      
      // Also update the category count in the categories table
      if (promptToDelete.category) {
        const categoryRef = ref(db, `categories/${promptToDelete.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
        const categorySnapshot = await get(categoryRef);
        if (categorySnapshot.exists()) {
          const categoryData = categorySnapshot.val();
          const currentCount = categoryData.count || 0;
          if (currentCount > 0) {
            await update(categoryRef, { count: currentCount - 1 });
          }
        }
      }
    } catch (error) {
      console.error('Error deleting prompt:', error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setPromptToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setPromptToDelete(null);
  };

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

  const filteredPrompts = prompts.filter((prompt) => {
    if (visibility === 'public') {
      return !prompt.visibility || prompt.visibility === 'public';
    } else if (visibility === 'private') {
      return prompt.visibility === 'private';
    }
    return true;
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Prompts</h2>
        <p className="text-gray-600 mt-1">Total prompts: {prompts.length}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPrompts.map((prompt) => (
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
              <h3 className="text-lg font-medium text-gray-900 truncate mb-2">
                {prompt.title}
              </h3>
              <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                {prompt.description}
              </p>
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  <Button
                    variant="primary"
                    onClick={() => handleEdit(prompt.id!)}
                    className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleDeleteClick(prompt)}
                    className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                  >
                    Delete
                  </Button>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-4">
                    <span className="font-medium">{prompt.likes || 0}</span> likes
                  </span>
                  <span>
                    <span className="font-medium">{prompt.downloads || 0}</span> downloads
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={promptToDelete?.title || ''}
        loading={isDeleting}
      />
    </div>
  );
}
