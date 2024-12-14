'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import PromptList from '@/components/PromptList';
import SubmitPrompt from '@/components/SubmitPrompt';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';
import Link from 'next/link';

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
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'likes' | 'downloads' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (!user) return;

    const promptsRef = ref(db, 'prompts');
    const userPromptsQuery = query(promptsRef, orderByChild('userId'), equalTo(user.uid));

    const unsubscribe = onValue(userPromptsQuery, (snapshot) => {
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
    }, (error) => {
      console.error('Error fetching prompts:', error);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/');
    }
    setIsLoading(false);
  }, [user, router, isLoading]);

  if (isLoading || !user) {
    return null; // Return null while loading or redirecting
  }

  if (typeof window !== 'undefined' && !user) {
    window.location.href = '/signin';
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
    savedPrompts: prompts.filter(prompt => prompt.visibility === 'private').length,
  };

  const tabs: { id: TabType; name: string }[] = [
    { id: 'all', name: `All Prompts (${prompts.length})` },
    { id: 'public', name: `Public (${prompts.filter(p => p.visibility === 'public').length})` },
    { id: 'private', name: `Private (${prompts.filter(p => p.visibility === 'private').length})` },
  ];

  const handleCopyPrompt = async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      // You can add a toast notification here if you have one
      alert('Prompt copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy prompt:', err);
      alert('Failed to copy prompt. Please try again.');
    }
  };

  const getSortedPrompts = () => {
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

  const sortedPrompts = getSortedPrompts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-1 text-text-muted">
              Manage your prompts and view your contributions
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="primary"
              onClick={() => router.push('/submit')}
              className="flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create New Prompt</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push('/settings')}
              className="flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </Button>
            <Button
              variant="secondary"
              onClick={async () => {
                try {
                  await signOut();
                  router.push('/');
                } catch (error) {
                  console.error('Error signing out:', error);
                }
              }}
              className="flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { 
              label: 'Total Prompts', 
              value: userStats.totalPrompts,
              icon: (
                <svg className="w-5 h-5 text-primary-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              )
            },
            { 
              label: 'Total Likes', 
              value: userStats.totalLikes,
              icon: (
                <svg className="w-5 h-5 text-primary-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )
            },
            { 
              label: 'Total Downloads', 
              value: userStats.totalDownloads,
              icon: (
                <svg className="w-5 h-5 text-primary-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )
            },
            { 
              label: 'Saved Prompts', 
              value: userStats.savedPrompts,
              icon: (
                <svg className="w-5 h-5 text-primary-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              )
            },
          ].map((stat) => (
            <Card key={stat.label} className="relative overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <dt className="text-text-muted text-sm font-medium truncate">
                    {stat.label}
                  </dt>
                  {stat.icon}
                </div>
                <dd className="mt-2 text-3xl font-semibold">
                  {stat.value}
                </dd>
              </div>
            </Card>
          ))}
        </div>

        {/* My Prompts */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Prompts</h2>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-text">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'likes' | 'downloads' | 'title')}
                  className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text hover:bg-surface-hover focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                >
                  <option value="date">Date</option>
                  <option value="likes">Likes</option>
                  <option value="downloads">Downloads</option>
                  <option value="title">Title</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-text">Order:</label>
                <button
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center space-x-1 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text hover:bg-surface-hover transition-colors"
                >
                  {sortOrder === 'asc' ? (
                    <>
                      <span>Ascending</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Descending</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sortedPrompts.map((prompt) => (
              <div key={prompt.id} className="bg-card rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Link href={`/prompt/${prompt.id}`} className="group">
                      <h3 className="text-lg font-semibold group-hover:text-primary-accent transition-colors">
                        {prompt.title}
                      </h3>
                    </Link>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleCopyPrompt(prompt)}
                      className="rounded-md bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary-accent transition-colors"
                    >
                      Copy Prompt
                    </button>
                    <Link
                      href={`/prompt/${prompt.id}`}
                      className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-surface transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-sm text-text-muted">
                  <span>❤️ {prompt.likes || 0} likes</span>
                  <span>⬇️ {prompt.downloads || 0} downloads</span>
                  <span>🔒 {prompt.visibility}</span>
                  <span>📅 {new Date(prompt.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
