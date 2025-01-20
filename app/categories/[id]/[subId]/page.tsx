'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';
import Script from 'next/script';
import VoteButton from '@/components/ui/VoteButton';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import AdDisplay from '@/components/AdDisplay';
import { ads } from '@/config/ads';

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

interface Subcategory {
  name: string;
  description?: string;
}

export default function SubcategoryPage({ params }: Props) {
  const { user } = useAuth();
  const { id: categoryId, subId: subcategoryId } = React.use(params);
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [localAds] = useState(ads);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch category and subcategory data using the raw categoryId
        const categoryResponse = await fetch(`/api/categories?id=${categoryId}`);
        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json();
          setCategoryName(categoryData.name);

          // Find subcategory by name
          if (categoryData.subcategories) {
            const decodedSubcategoryName = decodeURIComponent(subcategoryId).toLowerCase();
            setCategoryName(categoryData.name);

            console.log('Category data:', {
              categoryId,
              name: categoryData.name,
              subcategories: categoryData.subcategories
            });

            console.log('Looking for subcategory:', {
              decodedSubcategoryName,
              categoryId,
              availableSubcategories: Object.entries(categoryData.subcategories).map(([id, sub]: [string, any]) => ({
                id,
                name: sub.name,
                normalized: sub.name.toLowerCase().replace(/\s+/g, '-')
              }))
            });

            // Find subcategory by normalized name
            const subcategoryEntries = Object.entries(categoryData.subcategories) as [string, Subcategory][];
            const subcategoryEntry = subcategoryEntries.find(([id, sub]) => {
              const normalizedName = sub.name.toLowerCase().replace(/\s+/g, '-');
              console.log('Comparing:', {
                urlName: decodedSubcategoryName,
                subName: sub.name,
                normalizedName: normalizedName,
                matches: normalizedName === decodedSubcategoryName
              });
              return normalizedName === decodedSubcategoryName;
            });

            if (subcategoryEntry) {
              const [actualSubcategoryId, subcategory] = subcategoryEntry;
              setSubcategoryName(subcategory.name);
              console.log('Found subcategory:', { 
                id: actualSubcategoryId, 
                name: subcategory.name,
                urlName: decodedSubcategoryName
              });

              // Use the raw category ID for the API call
              const promptsUrl = `/api/prompts?categoryId=${encodeURIComponent(categoryId)}&subcategoryId=${encodeURIComponent(actualSubcategoryId)}`;
              console.log('Fetching prompts from:', promptsUrl);
              const promptsResponse = await fetch(promptsUrl, {
                headers: {
                  'Cache-Control': 'no-cache'
                }
              });

              const responseText = await promptsResponse.text();
              console.log('Raw API response:', responseText);

              if (promptsResponse.ok) {
                const promptsData = JSON.parse(responseText);
                console.log('Prompts data:', {
                  total: Object.keys(promptsData).length,
                  prompts: Object.entries(promptsData).map(([id, data]: [string, any]) => ({
                    id,
                    title: data.title,
                    categoryId: data.categoryId,
                    subcategoryId: data.subcategoryId,
                    visibility: data.visibility
                  }))
                });
                
                if (Object.keys(promptsData).length === 0) {
                  console.log('No prompts found for this subcategory');
                }

                const filteredPrompts = Object.entries(promptsData)
                  .map(([id, prompt]: [string, any]) => ({
                    id,
                    ...prompt
                  }));

                console.log('Filtered prompts:', {
                  total: filteredPrompts.length,
                  prompts: filteredPrompts.map(prompt => ({
                    id: prompt.id,
                    title: prompt.title,
                    categoryId: prompt.categoryId,
                    subcategoryId: prompt.subcategoryId,
                    visibility: prompt.visibility
                  }))
                });
                // Sort by creation date
                filteredPrompts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setPrompts(filteredPrompts);
              } else {
                console.error('Failed to fetch prompts:', {
                  status: promptsResponse.status,
                  statusText: promptsResponse.statusText,
                  response: responseText
                });
              }
            } else {
              console.error('Subcategory not found:', {
                looking_for: decodedSubcategoryName,
                available: Object.entries(categoryData.subcategories).map(([id, sub]: [string, any]) => ({
                  id,
                  name: sub.name,
                  normalized: sub.name.toLowerCase().replace(/\s+/g, '-')
                }))
              });
            }
          } else {
            console.error('No subcategories found in category data');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId, subcategoryId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00ffff]"></div>
      </div>
    );
  }

  if (!subcategoryName) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Subcategory not found</div>
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
        {/* Banner ad for non-pro users */}
        {!user?.isPro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="container mx-auto px-4 pt-8"
          >
            <AdDisplay ad={localAds.find(ad => ad.type === 'banner') ?? localAds[0]} />
          </motion.div>
        )}

        {/* Breadcrumb Navigation */}
        <div className="container mx-auto px-4 pt-8">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Link 
              href="/categories"
              className="hover:text-[#00ffff] transition-colors"
            >
              Categories
            </Link>
            <span>/</span>
            <Link 
              href={`/categories/${encodeURIComponent(categoryId)}`}
              className="hover:text-[#00ffff] transition-colors"
            >
              {categoryName}
            </Link>
            <span>/</span>
            <span className="text-[#00ffff]">
              {subcategoryName}
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Animated background grid */}
          <div className="absolute inset-0 grid grid-cols-8 gap-1 opacity-20">
            {Array.from({ length: 64 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear"
                }}
                className="aspect-square bg-[#00ffff]"
              />
            ))}
          </div>

          {/* Hero content */}
          <div className="relative container mx-auto px-4 pt-32 pb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#00ffff] via-white to-[#00ffff] bg-clip-text text-transparent mb-6">
                {subcategoryName}
              </h1>
              <p className="text-xl text-white/70 mb-12">
                Explore our collection of {subcategoryName.toLowerCase()} prompts in the {categoryName.toLowerCase()} category
              </p>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent" />
          <div className="absolute top-0 left-0 w-1/3 h-full bg-[#00ffff] opacity-[0.02] blur-3xl" />
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#00ffff] opacity-[0.02] blur-3xl" />
        </div>

        {/* Prompts Grid */}
        <div className="container mx-auto px-4 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt, index) => (
              <motion.div
                key={prompt.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <Link 
                  href={`/categories/${categoryId}/${subcategoryId}/prompts/${prompt.id.replace('public-', '')}`}
                  className="block h-full"
                >
                  <Card className="relative p-6 hover:border-[#00ffff]/50 hover:bg-black/60 transition-all duration-300 group cursor-pointer h-full backdrop-blur-lg overflow-hidden">
                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[#00ffff]/10 transform rotate-45 translate-x-8 -translate-y-8 group-hover:bg-[#00ffff]/20 transition-all duration-300" />
                    </div>

                  <div className="flex flex-col h-full">
                      <motion.div 
                        className="mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                      >
                        <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-[#00ffff] group-hover:text-[#00ffff] transition-colors duration-300">
                          {prompt.title}
                        </h3>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                        <VoteButton 
                          promptId={prompt.id} 
                          initialVotes={prompt.likes || 0}
                        />
                          </motion.div>
                      </div>
                        <p className="text-white/70 text-sm group-hover:text-white/90 transition-colors duration-300 line-clamp-2">
                        {prompt.description}
                      </p>
                      </motion.div>
                    
                      <div className="mt-auto space-y-4">
                      {prompt.tags && prompt.tags.length > 0 && (
                          <motion.div 
                            className="flex flex-wrap gap-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                          >
                          {prompt.tags.map((tag, index) => (
                            <span 
                              key={`${prompt.id}-tag-${index}`}
                                className="text-xs px-2 py-1 rounded-full bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/20 group-hover:border-[#00ffff]/40 transition-all duration-300"
                            >
                              {tag}
                            </span>
                          ))}
                          </motion.div>
                        )}

                        <motion.div 
                          className="flex justify-between items-center text-sm text-white/60"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
                        >
                        <div className="flex items-center gap-2">
                            <span className="group-hover:text-white/90 transition-colors duration-300">{prompt.userName}</span>
                          <span>•</span>
                            <span className="group-hover:text-white/90 transition-colors duration-300">
                            {new Date(prompt.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                          <motion.button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigator.clipboard.writeText(prompt.content);
                            setCopiedPromptId(prompt.id);
                            setTimeout(() => setCopiedPromptId(null), 2000);
                          }}
                          className="text-[#00ffff]/60 hover:text-[#00ffff] transition-colors duration-300 relative"
                          title="Copy prompt"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                          {copiedPromptId === prompt.id ? (
                              <motion.span 
                                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#00ffff] text-black text-xs px-2 py-1 rounded shadow-lg"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                              >
                              Copied!
                              </motion.span>
                          ) : null}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                          </motion.button>
                        </motion.div>
                    </div>
                  </div>
                </Card>
              </Link>
              </motion.div>
            ))}
            {prompts.length === 0 && (
              <motion.div 
                className="col-span-full text-center text-white/70 py-12 bg-black/60 backdrop-blur-lg rounded-lg border border-[#00ffff]/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                No prompts found in this subcategory yet.
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 