'use client';

import React, { useState, useEffect } from 'react';
import { ref, get, query, orderByChild } from 'firebase/database';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { Prompt } from '@/types';
import { ChartBarIcon, FireIcon } from '@heroicons/react/24/outline';

export default function PopularPromptsPage() {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<(Prompt & { votes: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month'>('all');
  const [trendingCategories, setTrendingCategories] = useState<{name: string, count: number}[]>([]);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setLoading(true);
        const promptsRef = ref(db, 'prompts');
        const snapshot = await get(promptsRef);
        
        if (snapshot.exists()) {
          let promptsData = Object.entries(snapshot.val())
            .map(([id, data]: [string, any]) => ({
              id: `public-${id}`,
              ...data,
              isPrivate: false,
              votes: data.votes ? Object.keys(data.votes).length : 0
            } as Prompt & { votes: number }))
            .filter(prompt => prompt.visibility === 'public');

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

          // Sort by votes (descending)
          promptsData.sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));
          setPrompts(promptsData);
        }
      } catch (error) {
        console.error('Error fetching prompts:', error);
        setError('Failed to load prompts');
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, [timeFilter]);

  useEffect(() => {
    // Calculate trending categories whenever prompts change
    const categories = prompts.reduce((acc, prompt) => {
      if (prompt.category) {
        acc[prompt.category] = (acc[prompt.category] || 0) + 1;
      }
      return acc;
    }, {} as {[key: string]: number});

    const sortedCategories = Object.entries(categories)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setTrendingCategories(sortedCategories);
  }, [prompts]);

  return (
    <div className="min-h-screen bg-black pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00ffff] to-white bg-clip-text text-transparent">
            Popular Prompts
          </h1>

          {/* Time Filter */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeFilter === 'all'
                  ? 'bg-[#00ffff] text-black'
                  : 'bg-black/30 text-white/60 hover:text-white border border-[#00ffff]/20'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setTimeFilter('week')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeFilter === 'week'
                  ? 'bg-[#00ffff] text-black'
                  : 'bg-black/30 text-white/60 hover:text-white border border-[#00ffff]/20'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeFilter('month')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeFilter === 'month'
                  ? 'bg-[#00ffff] text-black'
                  : 'bg-black/30 text-white/60 hover:text-white border border-[#00ffff]/20'
              }`}
            >
              This Month
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6 flex items-center">
            <div className="rounded-full bg-[#00ffff]/10 p-3 mr-4">
              <FireIcon className="h-6 w-6 text-[#00ffff]" />
            </div>
            <div>
              <p className="text-white/60">Most Voted</p>
              <p className="text-2xl font-bold text-white">
                {(prompts[0]?.votes ?? 0).toString()} votes
              </p>
              <p className="text-sm text-white/60">
                {prompts[0]?.title || 'No prompts yet'}
              </p>
            </div>
          </div>

          <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6 flex items-center">
            <div className="rounded-full bg-[#00ffff]/10 p-3 mr-4">
              <ChartBarIcon className="h-6 w-6 text-[#00ffff]" />
            </div>
            <div>
              <p className="text-white/60">Total Prompts</p>
              <p className="text-2xl font-bold text-white">{prompts.length}</p>
              <p className="text-sm text-white/60">
                {timeFilter === 'all' ? 'All time' : timeFilter === 'week' ? 'This week' : 'This month'}
              </p>
            </div>
          </div>

          <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6 flex items-center">
            <div className="rounded-full bg-[#00ffff]/10 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00ffff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-white/60">Average Votes</p>
              <p className="text-2xl font-bold text-white">
                {prompts.length > 0 
                  ? (prompts.reduce((acc, p) => acc + (p.votes ?? 0), 0) / prompts.length).toFixed(1)
                  : '0'}
              </p>
              <p className="text-sm text-white/60">Per prompt</p>
            </div>
          </div>
        </div>

        {/* Trending Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Trending Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {trendingCategories.map((category, index) => (
              <div 
                key={category.name}
                className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-4 flex flex-col items-center justify-center text-center"
              >
                <span className="text-2xl font-bold text-[#00ffff] mb-1">{category.count}</span>
                <span className="text-sm text-white/60">{category.name}</span>
                <span className="text-xs text-[#00ffff]/40 mt-1">#{index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00ffff]"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-400">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <Link 
                key={prompt.id} 
                href={`/categories/${prompt.category}/${prompt.subcategory}/prompts/${prompt.id ? prompt.id.replace(/^(private-|public-)/, '') : ''}`}
              >
                <Card className="p-6 hover:border-[#00ffff]/50 transition-all duration-300 group cursor-pointer h-full">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-white group-hover:text-[#00ffff] transition-colors">
                          {prompt.title}
                        </h3>
                        <span className="flex items-center text-[#00ffff] bg-[#00ffff]/10 px-2 py-1 rounded">
                          <FireIcon className="h-4 w-4 mr-1" />
                          {(prompt.votes ?? 0).toString()}
                        </span>
                      </div>
                      <p className="text-white/70 text-sm line-clamp-2 mb-2">
                        {prompt.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <span className="bg-[#00ffff]/5 px-2 py-1 rounded">
                          {new Date(prompt.createdAt).toLocaleDateString()}
                        </span>
                        {prompt.category && (
                          <>
                            <span>•</span>
                            <span className="bg-[#00ffff]/5 px-2 py-1 rounded">
                              {prompt.category}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      {prompt.tags && prompt.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {prompt.tags.map((tag, index) => (
                            <span 
                              key={`${prompt.id}-tag-${index}`}
                              className="text-xs px-2 py-1 rounded-full bg-[#00ffff]/10 text-[#00ffff]/80"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 text-white/50">
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {prompt.userName}
                          </span>
                        </div>
                        <span className="text-[#00ffff]/60 text-xs">
                          {timeFilter === 'all' ? 'Rank #' + (prompts.indexOf(prompt) + 1) : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {prompts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-white/60">No prompts found for the selected time period.</p>
          </div>
        )}
      </div>
    </div>
  );
} 