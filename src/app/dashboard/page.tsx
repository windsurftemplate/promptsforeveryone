'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { db } from '../../lib/firebase';
import Link from 'next/link';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useDashboard } from '@/contexts/DashboardContext';
import PromptModal from '@/components/PromptModal';

interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryId: string;
  subcategory?: string;
  likes: number;
  downloads: number;
  createdAt: string;
  visibility: 'public' | 'private';
  userId: string;
  content: string;
  userName: string;
  tags: string[];
}

type TabType = 'all' | 'public' | 'private';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { filterTag } = useDashboard();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'likes' | 'downloads' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
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

        // Sort prompts by creation date (newest first)
        promptsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/signin');
    }
  }, [user, router, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  // Update stats based on actual prompts data
  const userStats = {
    totalPrompts: prompts.length,
    totalLikes: prompts.reduce((acc, prompt) => {
      const likes = typeof prompt.likes === 'number' ? prompt.likes : 0;
      return acc + likes;
    }, 0),
    totalDownloads: prompts.reduce((acc, prompt) => {
      const downloads = typeof prompt.downloads === 'number' ? prompt.downloads : 0;
      return acc + downloads;
    }, 0),
    savedPrompts: prompts.filter((prompt) => prompt.visibility === 'private').length,
  };

  const tabs: { id: TabType; name: string }[] = [
    { id: 'all', name: `All Prompts (${prompts.length})` },
    { id: 'public', name: `Public (${prompts.filter((p) => p.visibility === 'public').length})` },
    { id: 'private', name: `Private (${prompts.filter((p) => p.visibility === 'private').length})` },
  ];

  const handleCopyPrompt = async (prompt: Prompt): Promise<void> => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      alert('Prompt copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy prompt:', err);
      alert('Failed to copy prompt. Please try again.');
    }
  };

  const getSortedPrompts = (): Prompt[] => {
    return [...prompts].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return sortOrder === 'desc'
            ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'likes':
          return sortOrder === 'desc'
            ? (b.likes || 0) - (a.likes || 0)
            : (a.likes || 0) - (b.likes || 0);
        case 'downloads':
          return sortOrder === 'desc'
            ? (b.downloads || 0) - (a.downloads || 0)
            : (a.downloads || 0) - (b.downloads || 0);
        case 'title':
          return sortOrder === 'desc'
            ? b.title.localeCompare(a.title)
            : a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const filteredPrompts = filterTag
    ? prompts.filter((prompt) => prompt.category === filterTag)
    : activeTab === 'public'
    ? prompts.filter((prompt) => prompt.visibility === 'public')
    : activeTab === 'private'
    ? prompts.filter((prompt) => prompt.visibility === 'private')
    : prompts;

  const sortedAndFilteredPrompts = getSortedPrompts().filter(prompt => 
    filteredPrompts.some(fp => fp.id === prompt.id)
  );

  return (
    <>
      <div className="p-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
            <h3 className="text-sm font-medium text-white/70">Total Prompts</h3>
            <p className="text-2xl font-bold mt-2">{userStats.totalPrompts}</p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-white/10">
            <h3 className="text-sm font-medium text-white/70">Total Likes</h3>
            <p className="text-2xl font-bold mt-2">{userStats.totalLikes}</p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-white/10">
            <h3 className="text-sm font-medium text-white/70">Total Downloads</h3>
            <p className="text-2xl font-bold mt-2">{userStats.totalDownloads}</p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-pink-500/10 to-red-500/10 border border-white/10">
            <h3 className="text-sm font-medium text-white/70">Saved Prompts</h3>
            <p className="text-2xl font-bold mt-2">{userStats.savedPrompts}</p>
          </Card>
        </div>

        {/* Tabs and Sorting */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="date">Date</option>
              <option value="likes">Likes</option>
              <option value="downloads">Downloads</option>
              <option value="title">Title</option>
            </select>
            <button
              onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
              className="p-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedAndFilteredPrompts.map((prompt) => (
            <div
              key={prompt.id}
              onClick={() => setSelectedPrompt(prompt)}
              className="cursor-pointer"
            >
              <Card 
                className="group relative hover:transform hover:scale-[1.02] transition-all duration-200"
              >
                <div className="p-4 flex flex-col h-[200px]">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white truncate flex-1 pr-2">{prompt.title}</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyPrompt(prompt);
                        }}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-hidden mb-3">
                    <p className="text-sm text-white/70 line-clamp-2 mb-2">{prompt.description}</p>
                    <pre className="text-xs text-white/50 font-mono line-clamp-3 bg-white/5 p-2 rounded">
                      {prompt.content}
                    </pre>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-white/50 pt-2 border-t border-white/10 mt-auto">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {prompt.likes || 0}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {prompt.downloads || 0}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-white/5 rounded text-xs">
                        {prompt.category}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        prompt.visibility === 'private' 
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : 'bg-green-500/10 text-green-500'
                      }`}>
                        {prompt.visibility}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedPrompt && (
        <PromptModal
          prompt={selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
        />
      )}
    </>
  );
}
