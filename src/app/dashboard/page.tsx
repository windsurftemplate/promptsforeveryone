'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { db } from '../../lib/firebase';
import Link from 'next/link';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  likes: number;
  downloads: number;
  createdAt: string;
  visibility: string;
  userId: string;
  content: string;
}

type TabType = 'all' | 'public' | 'private';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'likes' | 'downloads' | 'title'>('date');
  const [categories, setCategories] = useState<string[]>([
    'Code Generation',
    'Debugging',
    'API Development',
    'Automation',
    'Frontend',
    'Backend',
  ]);
  const [newCategory, setNewCategory] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterTag, setFilterTag] = useState<string>('');

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
    return <div>Loading...</div>; // Render a loading state
  }

  if (!user) {
    return null; // Redirecting
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

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (category: string) => {
    setCategories(categories.filter((cat) => cat !== category));
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
    <div className="container mx-auto px-4 py-8">
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

      {/* Category Management */}
      <Card className="mb-8 p-6">
        <h2 className="text-xl font-bold mb-4">Manage Categories</h2>
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Add new category"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button 
            onClick={handleAddCategory}
            className="bg-primary hover:bg-primary-accent text-white px-6 py-2 rounded-lg transition-colors"
          >
            Add Category
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div 
            className="cursor-pointer p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-center"
            onClick={() => setFilterTag('')}
          >
            All Prompts
          </div>
          {categories.map((category) => (
            <div key={category} className="relative group">
              <div 
                className="cursor-pointer p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-center"
                onClick={() => setFilterTag(category)}
              >
                {category}
              </div>
              <button
                onClick={() => handleDeleteCategory(category)}
                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Sorting and Filtering */}
      <Card className="mb-8 p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="date">Sort by Date</option>
              <option value="likes">Sort by Likes</option>
              <option value="downloads">Sort by Downloads</option>
              <option value="title">Sort by Title</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 hover:bg-white/10 transition-colors"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
          <div className="flex gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-white/5 hover:bg-white/10 text-white/70'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {sortedAndFilteredPrompts.map((prompt) => (
          <Card 
            key={prompt.id}
            className="group relative hover:transform hover:scale-[1.02] transition-all duration-200 h-full"
          >
            <div className="p-4 space-y-2 flex flex-col h-full">
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-semibold text-white truncate flex-1 pr-2">{prompt.title}</h3>
                <button
                  onClick={() => handleCopyPrompt(prompt)}
                  className="text-white/60 hover:text-white transition-colors ml-2 flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-white/70 line-clamp-4 flex-1">{prompt.content}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
