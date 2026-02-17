'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { Prompt } from '@/types/prompt';
import { ChartBarIcon, FireIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PromptModal from '@/components/PromptModal';
import AdDisplay from '@/components/AdDisplay';
import { ads as defaultAds } from '@/config/ads';
import type { Ad } from '@/config/ads';

export default function PopularPromptsPage() {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month'>('all');
  const [visibleCount, setVisibleCount] = useState(20);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const router = useRouter();
  const [ads] = useState<Ad[]>(defaultAds);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/prompts');
        if (!response.ok) {
          throw new Error('Failed to fetch prompts');
        }
        
        const data = await response.json();
        let promptsData = Object.entries(data)
          .filter(([_, data]: [string, any]) => data.visibility === 'public')
          .map(([id, data]: [string, any]) => ({
            id,
            ...data,
            likes: data.likes || 0
          } as Prompt & { likes: number }));

        // Filter by time if needed
        if (timeFilter !== 'all') {
          const now = new Date();
          const timeLimit = new Date();
          if (timeFilter === 'week') {
            timeLimit.setDate(now.getDate() - 7);
          } else if (timeFilter === 'month') {
            timeLimit.setMonth(now.getMonth() - 1);
          }

          promptsData = promptsData.filter(prompt => 
            new Date(prompt.createdAt) >= timeLimit
          );
        }

        // Sort by likes (descending)
        promptsData.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
        // Limit to top 100 prompts
        setPrompts(promptsData.slice(0, 100));
      } catch (error) {
        console.error('Error fetching prompts:', error);
        setError('Failed to load prompts');
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, [timeFilter]);

  // Filter visible prompts
  const visiblePrompts = useMemo(() => {
    return prompts.slice(0, Math.min(visibleCount, 100));
  }, [prompts, visibleCount]);

  // Update scroll handler to respect 100 limit
  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      if (scrolledToBottom && visibleCount < Math.min(prompts.length, 100)) {
        setVisibleCount(prevCount => Math.min(prevCount + 20, 100));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCount, prompts.length]);

  const handleVote = async (promptId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`/api/prompts/${promptId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to update like');
      }

      const updatedPrompt = await response.json();
      
      // Update the prompts state with the new like count
      setPrompts(currentPrompts => 
        currentPrompts.map(prompt => 
          prompt.id === `public-${promptId}` 
            ? { ...prompt, likes: updatedPrompt.likes || 0 }
            : prompt
        )
      );
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleCloseModal = () => {
    setSelectedPrompt(null);
  };

  const handleEditInModal = (prompt: Prompt) => {
    // Update the prompt in the list
    setPrompts(currentPrompts =>
      currentPrompts.map(p => p.id === prompt.id ? prompt : p)
    );
  };

  const handleDeletePrompt = async (id: string) => {
    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the prompt from the list
        setPrompts(currentPrompts => 
          currentPrompts.filter(p => p.id !== id)
        );
        setSelectedPrompt(null);
      }
    } catch (error) {
      console.error('Error deleting prompt:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-black via-gray-900 to-black">
      {/* Fixed background gradient */}
      <div className="fixed inset-0 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-[#8B5CF6]/5 pointer-events-none" />

      <div className="relative container mx-auto px-4 pt-32 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#8B5CF6] to-white bg-clip-text text-transparent">
            Trending top 100 Prompts
          </h1>

          {/* Time Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeFilter === 'all'
                  ? 'bg-[#8B5CF6] text-black'
                  : 'bg-black/30 text-white/60 hover:text-white border border-[#8B5CF6]/20'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setTimeFilter('week')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeFilter === 'week'
                  ? 'bg-[#8B5CF6] text-black'
                  : 'bg-black/30 text-white/60 hover:text-white border border-[#8B5CF6]/20'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeFilter('month')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeFilter === 'month'
                  ? 'bg-[#8B5CF6] text-black'
                  : 'bg-black/30 text-white/60 hover:text-white border border-[#8B5CF6]/20'
              }`}
            >
              This Month
            </button>
          </div>
        </div>

        {/* Banner Ad */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <AdDisplay ad={ads.find(ad => ad.type === 'banner') ?? ads[0]} />
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-black/80 backdrop-blur-lg border border-[#8B5CF6]/20 rounded-lg p-6 flex items-center"
          >
            <div className="rounded-full bg-[#8B5CF6]/10 p-3 mr-4">
              <FireIcon className="h-6 w-6 text-[#8B5CF6]" />
            </div>
            <div>
              <p className="text-white/60">Most Voted</p>
              <p className="text-2xl font-bold text-white">
                {(prompts[0]?.likes ?? 0).toString()} likes
              </p>
              <p className="text-sm text-white/60">
                {prompts[0]?.title || 'No prompts yet'}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-black/80 backdrop-blur-lg border border-[#8B5CF6]/20 rounded-lg p-6 flex items-center"
          >
            <div className="rounded-full bg-[#8B5CF6]/10 p-3 mr-4">
              <ChartBarIcon className="h-6 w-6 text-[#8B5CF6]" />
            </div>
            <div>
              <p className="text-white/60">Total Prompts</p>
              <p className="text-2xl font-bold text-white">{prompts.length}</p>
              <p className="text-sm text-white/60">
                {timeFilter === 'all' ? 'All time' : timeFilter === 'week' ? 'This week' : 'This month'}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-black/80 backdrop-blur-lg border border-[#8B5CF6]/20 rounded-lg p-6 flex items-center"
          >
            <div className="rounded-full bg-[#8B5CF6]/10 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-white/60">Average Likes</p>
              <p className="text-2xl font-bold text-white">
                {prompts.length > 0 
                  ? (prompts.reduce((acc, p) => acc + (p.likes || 0), 0) / prompts.length).toFixed(1)
                  : '0'}
              </p>
              <p className="text-sm text-white/60">Per prompt</p>
            </div>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#8B5CF6]"></div>
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60">No prompts found for the selected time period.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visiblePrompts.map((prompt, index) => (
                <React.Fragment key={prompt.id}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: prompts.indexOf(prompt) * 0.1 }}
                  >
                    <div 
                      onClick={() => setSelectedPrompt(prompt)}
                      className="cursor-pointer"
                    >
                      <Card className="p-6 hover:border-[#8B5CF6]/50 transition-all duration-300 group cursor-pointer h-[180px] bg-black/30">
                        <div className="flex flex-col justify-between h-full">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-semibold text-white group-hover:text-[#8B5CF6] transition-colors truncate pr-4">
                                {prompt.title}
                              </h3>
                              <div className="flex items-center text-[#8B5CF6] shrink-0">
                                <span>{prompt.likes ?? 0}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-white/50">
                              <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-white/50">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="truncate max-w-[120px]">{prompt.userName}</span>
                            </div>
                            <span className="text-[#8B5CF6]/60 shrink-0">
                              Rank #{prompts.indexOf(prompt) + 1}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </motion.div>
                  {/* Insert inline ad after every 5th prompt */}
                  {(index + 1) % 5 === 0 && ads.find(ad => ad.type === 'inline') && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="h-[180px]">
                        <AdDisplay ad={ads.find(ad => ad.type === 'inline')!} />
                      </div>
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {visibleCount < prompts.length && (
              <div className="text-center py-8">
                <button
                  onClick={() => setVisibleCount(prev => prev + 20)}
                  className="px-6 py-2 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-lg hover:bg-[#8B5CF6]/20 transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}

        {selectedPrompt && (
          <PromptModal
            prompt={selectedPrompt}
            onCloseAction={handleCloseModal}
            onEditAction={handleEditInModal}
            onDeleteAction={handleDeletePrompt}
            isReadOnly={true}
          />
        )}
      </div>
    </div>
  );
} 