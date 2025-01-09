'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';
import Script from 'next/script';

interface Prompt {
  id: string;
  title: string;
  content: string;
  description: string;
  categoryId: string;
  subcategoryId: string;
  userName: string;
  tags?: string[];
  likes?: number;
  createdAt: string;
  visibility: string;
}

interface Props {
  params: Promise<{
    id: string;
    subId: string;
  }>;
}

export default function SubcategoryPage({ params }: Props) {
  const { id: categoryId, subId: subcategoryId } = React.use(params);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  useEffect(() => {
    console.log('Fetching data for:', { categoryId, subcategoryId });

    // Fetch category and subcategory names
    const categoryRef = ref(db, `categories/${categoryId}`);
    onValue(categoryRef, (snapshot) => {
      console.log('Category data:', snapshot.val());
      if (snapshot.exists()) {
        const data = snapshot.val();
        setCategoryName(data.name);
        if (data.subcategories && data.subcategories[subcategoryId]) {
          setSubcategoryName(data.subcategories[subcategoryId].name);
        }
      }
    });

    // Fetch prompts for this subcategory
    const promptsRef = ref(db, 'prompts');
    onValue(promptsRef, (snapshot) => {
      console.log('All prompts:', snapshot.val());
      if (snapshot.exists()) {
        const data = snapshot.val();
        const filteredPrompts = Object.entries(data)
          .filter(([_, prompt]: [string, any]) => {
            console.log('Checking prompt:', prompt);
            console.log('Matching against:', {
              categoryId,
              subcategoryId,
              visibility: prompt.visibility
            });
            return prompt.categoryId === categoryId && 
                   prompt.subcategoryId === subcategoryId &&
                   prompt.visibility === 'public';
          })
          .map(([id, prompt]: [string, any]) => ({
            id: `public-${id}`,
            ...prompt
          }));
        
        console.log('Filtered prompts:', filteredPrompts);
        
        // Sort by creation date
        filteredPrompts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setPrompts(filteredPrompts);
      }
      setLoading(false);
    });
  }, [categoryId, subcategoryId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00ffff]"></div>
      </div>
    );
  }

  // Add structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: subcategoryName,
    description: `Collection of ${subcategoryName.toLowerCase()} prompts in ${categoryName}`,
    url: `https://promptsforeveryone.com/categories/${categoryId}/${subcategoryId}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: prompts.map((prompt, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: prompt.title,
          description: prompt.description,
          author: {
            '@type': 'Person',
            name: prompt.userName
          },
          dateCreated: prompt.createdAt,
          url: `https://promptsforeveryone.com/prompt/${prompt.id.replace('public-', '')}`
        }
      }))
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Categories',
          item: 'https://promptsforeveryone.com/categories'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: categoryName,
          item: `https://promptsforeveryone.com/categories/${categoryId}`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: subcategoryName,
          item: `https://promptsforeveryone.com/categories/${categoryId}/${subcategoryId}`
        }
      ]
    }
  };

  return (
    <>
      <Script id="subcategory-structured-data" type="application/ld+json">
        {JSON.stringify(structuredData)}
      </Script>
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-12">
          <Link 
            href={`/categories/${categoryId}`}
            className="inline-flex items-center text-[#00ffff] hover:text-[#00ffff]/80 mb-8 group"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to {categoryName}
          </Link>

          <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-8 mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">{subcategoryName}</h1>
            <p className="text-white/60 text-lg">
              Explore our collection of {subcategoryName.toLowerCase()} prompts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prompts.map((prompt) => (
              <Link 
                key={prompt.id} 
                href={`/prompt/${prompt.id.replace('public-', '')}`}
              >
                <Card className="p-6 hover:border-[#00ffff]/50 transition-all duration-300 group cursor-pointer h-full">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-white group-hover:text-[#00ffff] transition-colors mb-2">
                        {prompt.title}
                      </h3>
                      <p className="text-white/70 text-sm">
                        {prompt.description}
                      </p>
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
                      
                      <div className="flex justify-between items-center text-sm text-white/50">
                        <div className="flex items-center gap-2">
                          <span>{prompt.userName}</span>
                          <span>•</span>
                          <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigator.clipboard.writeText(prompt.content);
                            setCopiedPromptId(prompt.id);
                            setTimeout(() => setCopiedPromptId(null), 2000);
                          }}
                          className="text-[#00ffff]/60 hover:text-[#00ffff] transition-colors relative"
                          title="Copy prompt"
                        >
                          {copiedPromptId === prompt.id ? (
                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#00ffff]/90 text-black text-xs px-2 py-1 rounded">
                              Copied!
                            </span>
                          ) : null}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
            {prompts.length === 0 && (
              <div className="col-span-full text-center text-white/60 py-12">
                No prompts found in this subcategory yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 