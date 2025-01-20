'use client';

import React from 'react';
import { db } from '@/lib/firebase';
import { Prompt } from '@/types/prompt';
import { ref, onValue, query, orderByChild, equalTo, off, remove, get, update } from 'firebase/database';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import DeleteConfirmationDialog from './ui/DeleteConfirmationDialog';
import { useDashboard } from '@/contexts/DashboardContext';
import PromptCard from './PromptCard';
import PromptModal from './PromptModal';
import { motion } from 'framer-motion';
import { Ad } from '@/config/ads';
import AdDisplay from './AdDisplay';

interface PromptListProps {
  visibility?: 'all' | 'public' | 'private';
  prompts?: Prompt[];
  ads?: Ad[];
  adFrequency?: number;
}

export default function PromptList({ visibility = 'all', prompts: propPrompts, ads = [], adFrequency = 5 }: PromptListProps) {
  const [localPrompts, setPrompts] = useState<Prompt[]>([]);
  const [visiblePrompts, setVisiblePrompts] = useState<Prompt[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { viewMode, isSidebarCollapsed } = useDashboard();
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (propPrompts) {
      setPrompts(propPrompts);
      setLoading(false);
      return;
    }

    const promptsRef = ref(db, 'prompts');
    let promptsQuery;

    if (user) {
      // If user is logged in, get their prompts
      promptsQuery = query(promptsRef, orderByChild('userId'), equalTo(user.uid));
    } else {
      // If no user, get all public prompts
      promptsQuery = promptsRef;
    }

    const unsubscribe = onValue(promptsQuery, (snapshot) => {
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
        if (!user) {
          // For unauthenticated users, only show public prompts
          return !prompt.visibility || prompt.visibility === 'public';
        }
        
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
      off(promptsQuery);
    };
  }, [user, visibility, propPrompts]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        setVisibleCount(prev => {
          const increment = viewMode === 'list' ? 5 : 20;
          return Math.min(prev + increment, localPrompts.length);
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [localPrompts.length, viewMode]);

  useEffect(() => {
    setVisiblePrompts(localPrompts.slice(0, visibleCount));
  }, [localPrompts, visibleCount]);

  // Reset visible count when prompts change (e.g., category change)
  useEffect(() => {
    setVisibleCount(20);
  }, [propPrompts]);

  const handleEdit = (prompt: Prompt) => {
    const slug = prompt.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    window.history.pushState({}, '', `/dashboard/${slug}`);
    setSelectedPrompt(prompt);
  };

  const handleCloseModal = () => {
    window.history.pushState({}, '', '/dashboard');
    setSelectedPrompt(null);
  };

  const handleEditInModal = (prompt: Prompt) => {
    router.push(`/submit?edit=${prompt.id}`);
    setSelectedPrompt(null);
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

  const handleCopy = async (content: string, promptId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopyFeedback(promptId);
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async (prompt: Prompt) => {
    const shareUrl = `${window.location.origin}/prompts/${prompt.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: prompt.title,
          text: prompt.description || 'Check out this prompt!',
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopyFeedback(`share-${prompt.id}`);
        setTimeout(() => setCopyFeedback(null), 2000);
      }
    } catch (err) {
      console.error('Failed to share:', err);
    }
  };

  const renderListView = () => (
    <div className="space-y-4">
      {visiblePrompts.map((prompt, index) => (
        <React.Fragment key={prompt.id}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div 
              onClick={() => handleEdit(prompt)}
              className="bg-black/30 border border-[#00ffff]/20 rounded-lg p-6 hover:border-[#00ffff]/50 transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{prompt.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <span>Created {new Date(prompt.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className={`px-2 py-1 rounded ${
                      prompt.visibility === 'private' 
                        ? 'bg-gray-100/10 text-gray-100'
                        : 'bg-green-100/10 text-green-400'
                    }`}>
                      {prompt.visibility}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(prompt.content, prompt.id);
                    }}
                    className="text-sm bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] px-4 py-2 rounded-md"
                  >
                    {copyFeedback === prompt.id ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(prompt);
                    }}
                    className="text-sm bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] px-4 py-2 rounded-md"
                  >
                    {copyFeedback === `share-${prompt.id}` ? 'URL Copied!' : 'Share'}
                  </Button>
                  {user && prompt.userId === user.uid && (
                    <>
                      <Button
                        variant="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(prompt);
                        }}
                        className="text-sm bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] px-4 py-2 rounded-md"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(prompt);
                        }}
                        className="text-sm bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-md"
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <p className="text-white/80 mt-4">{prompt.content}</p>
              <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 bg-[#00ffff]/10 text-[#00ffff] rounded-lg text-sm">
                  {prompt.category}
                </span>
              </div>
              <div className="flex items-center text-sm text-white/60 mt-4">
                <span className="mr-4">
                  <span className="font-medium">{prompt.likes || 0}</span> likes
                </span>
                <span>
                  <span className="font-medium">{prompt.downloads || 0}</span> downloads
                </span>
              </div>
            </div>
          </motion.div>
          {/* Insert inline ad after every nth prompt */}
          {ads.length > 0 && (index + 1) % adFrequency === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="h-[180px] bg-black/30 border border-[#00ffff]/20 rounded-lg p-4"
            >
              <AdDisplay ad={ads[Math.floor(Math.random() * ads.length)]} />
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderPrompts = () => (
    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${
      isSidebarCollapsed 
        ? 'xl:grid-cols-5' 
        : 'xl:grid-cols-4'
    }`}>
      {visiblePrompts.map((prompt, index) => (
        <React.Fragment key={prompt.id}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <PromptCard
              id={prompt.id || ''}
              title={prompt.title || ''}
              description={prompt.description || ''}
              content={prompt.content || ''}
              tags={prompt.tags || []}
              userId={prompt.userId}
              category={prompt.category}
              onDelete={() => handleDeleteClick(prompt)}
              onCopy={(content) => handleCopy(content, prompt.id || '')}
              onClick={() => handleEdit(prompt)}
            />
          </motion.div>
          {/* Insert inline ad after every nth prompt */}
          {ads.length > 0 && (index + 1) % adFrequency === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="h-[180px] bg-black/30 border border-[#00ffff]/20 rounded-lg p-4"
            >
              <AdDisplay ad={ads[Math.floor(Math.random() * ads.length)]} />
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00ffff]"></div>
      </div>
    );
  }

  if (localPrompts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-white">No prompts found</h3>
        <p className="mt-2 text-sm text-white/60">
          Get started by creating your first prompt
        </p>
        <div className="mt-6">
          <Link
            href="/submit"
            className="inline-flex items-center px-4 py-2 border border-[#00ffff]/20 bg-[#00ffff]/10 text-[#00ffff] hover:bg-[#00ffff]/20 transition-colors rounded-md text-sm font-medium"
          >
            Create a Prompt
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#00ffff]">Your Prompts</h2>
          <p className="text-white/60 mt-1">Total prompts: {localPrompts.length}</p>
        </div>

        {viewMode === 'card' ? renderPrompts() : renderListView()}
      </div>

      {selectedPrompt && selectedPrompt.id && (
        <PromptModal
          prompt={selectedPrompt}
          onCloseAction={handleCloseModal}
          onEditAction={handleEditInModal}
          onDeleteAction={(id) => handleDeleteClick({ ...selectedPrompt, id })}
        />
      )}

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
}
