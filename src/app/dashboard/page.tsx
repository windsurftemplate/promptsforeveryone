'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import PromptList from '@/components/PromptList';
import SubmitPrompt from '@/components/SubmitPrompt';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  likes: number;
  downloads: number;
  createdAt: string;
}

type TabType = 'all' | 'public' | 'private' | 'submit';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

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

  // Mock data for demonstration
  const userStats = {
    totalPrompts: 12,
    totalLikes: 156,
    totalDownloads: 892,
    savedPrompts: 24,
  };

  const userPrompts: Prompt[] = [
    {
      id: '1',
      title: 'Code Review Expert',
      description: 'A comprehensive code review prompt for any programming language',
      category: 'Code Review',
      likes: 45,
      downloads: 128,
      createdAt: '2024-01-15',
    },
    // Add more mock prompts as needed
  ];

  const tabs: { id: TabType; name: string }[] = [
    { id: 'all', name: 'All Prompts' },
    { id: 'public', name: 'Public' },
    { id: 'private', name: 'Private' },
    { id: 'submit', name: 'Submit New' },
  ];

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
            <Button
              variant="secondary"
              onClick={() => setActiveTab('submit')}
            >
              Create New Prompt
            </Button>
          </div>

          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${
                      activeTab === tab.id
                        ? 'border-primary-accent text-primary-accent'
                        : 'border-transparent text-text-muted hover:text-text hover:border-border'
                    }
                  `}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {activeTab === 'submit' ? (
            <SubmitPrompt />
          ) : (
            <PromptList visibility={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
}
