'use client';

import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Ad placeholder component
const AdSpace = ({ position }: { position: 'top' | 'sidebar' | 'bottom' }) => {
  const adStyles = {
    top: 'w-full h-[100px] mb-8',
    sidebar: 'w-full h-[600px]',
    bottom: 'w-full h-[100px] mt-8'
  };

  return (
    <div className={`bg-black/30 border border-[#00ffff]/10 rounded-lg flex items-center justify-center ${adStyles[position]}`}>
      <span className="text-[#00ffff]/40">Ad Space - {position}</span>
    </div>
  );
};

// Category icons mapping
const CATEGORY_ICONS: { [key: string]: string } = {
  'code-generation': '💻',
  'debugging': '🐛',
  'api-development': '🔌',
  'testing': '🧪',
  'documentation': '📝',
  'database': '🗄️',
  'security': '🔒',
  'performance': '⚡'
};

// Category descriptions mapping
const CATEGORY_DESCRIPTIONS: { [key: string]: string } = {
  'code-generation': 'AI-powered code generation prompts for various programming languages and frameworks',
  'debugging': 'Prompts to help identify and fix bugs in your code',
  'api-development': 'Create and document APIs with helpful prompts',
  'testing': 'Generate test cases and improve code coverage',
  'documentation': 'Create clear and comprehensive documentation',
  'database': 'Database design, queries, and optimization prompts',
  'security': 'Security best practices and vulnerability detection',
  'performance': 'Optimize code and improve application performance'
};

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Convert slug back to proper category name
  const categoryName = params.slug.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const promptsRef = ref(db, 'prompts');
        const snapshot = await get(promptsRef);
        if (snapshot.exists()) {
          console.log('Raw data:', snapshot.val());
          const promptsData = Object.entries(snapshot.val())
            .map(([id, data]: [string, any]) => {
              console.log('Processing prompt:', id, data);
              return {
                id,
                ...data,
                category: data.category || '',
                categories: data.categories || []
              };
            })
            .filter(prompt => {
              console.log('Filtering prompt:', prompt.id, {
                category: prompt.category,
                categories: prompt.categories,
                categoryName,
                visibility: prompt.visibility
              });
              return (
                prompt.visibility !== 'private' &&
                (prompt.category === categoryName ||
                 prompt.categories?.includes(categoryName))
              );
            });
          console.log('Filtered prompts:', promptsData);
          setPrompts(promptsData);
        }
      } catch (error) {
        console.error('Error fetching prompts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, [params.slug, categoryName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00ffff]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        {/* Top Ad Space */}
        <AdSpace position="top" />

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Content */}
          <div className="flex-1">
            {/* Category Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{CATEGORY_ICONS[params.slug] || '🔍'}</span>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">
                  {categoryName} Prompts
                </h1>
              </div>
              <p className="text-white/60">
                {CATEGORY_DESCRIPTIONS[params.slug] || 'Explore our collection of prompts in this category'}
              </p>
            </div>

            {/* Prompts Grid */}
            <div className="grid gap-6">
              {prompts.length > 0 ? (
                prompts.map((prompt) => (
                  <div
                    key={prompt.id}
                    className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6 hover:border-[#00ffff]/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all duration-300"
                  >
                    <h2 className="text-xl font-semibold text-white mb-2">{prompt.title}</h2>
                    <p className="text-white/60 mb-4">{prompt.description}</p>
                    <Link
                      href={`/prompt/${prompt.id}`}
                      className="text-[#00ffff] hover:text-[#00ffff]/80 transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-white/60 mb-4">No prompts found in this category yet.</p>
                  <Link
                    href="/submit"
                    className="inline-block bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] px-6 py-2 rounded-lg transition-all duration-300 border border-[#00ffff]/30"
                  >
                    Submit the First Prompt
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-[300px] space-y-6">
            {/* Sidebar Ad Space */}
            <AdSpace position="sidebar" />

            {/* Related Categories */}
            <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#00ffff] mb-4">Related Categories</h2>
              <div className="space-y-2">
                {Object.entries(CATEGORY_ICONS)
                  .filter(([slug]) => slug !== params.slug)
                  .slice(0, 5)
                  .map(([slug, icon]) => (
                    <Link
                      key={slug}
                      href={`/category/${slug}`}
                      className="flex items-center gap-2 text-white/60 hover:text-[#00ffff] transition-colors"
                    >
                      <span>{icon}</span>
                      <span>{slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Ad Space */}
        <AdSpace position="bottom" />
      </div>
    </div>
  );
}
