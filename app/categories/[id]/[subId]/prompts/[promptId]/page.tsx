'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Prompt } from '@/types/prompt';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, ClipboardIcon, ShareIcon, HeartIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function PromptPage() {
  const params = useParams();
  const categoryId = params.id as string;
  const subcategoryId = params.subId as string;
  const promptId = params.promptId as string;
  const { user } = useAuth();
  const router = useRouter();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contentCopied, setContentCopied] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [subcategoryName, setSubcategoryName] = useState<string>('');
  const [categoryName, setCategoryName] = useState<string>('');

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        // Fetch prompt data
        const promptResponse = await fetch(`/api/prompts/${promptId}`);
        if (!promptResponse.ok) {
          if (promptResponse.status === 404) {
            setError('Prompt not found');
          } else if (promptResponse.status === 403) {
            setError('This prompt is private');
          } else {
            setError('Failed to load prompt');
          }
          setLoading(false);
          return;
        }

        const promptData = await promptResponse.json();
        setPrompt({ ...promptData, id: promptId });
        setLikeCount(promptData.likes || 0);
        
        // Fetch category and subcategory names
        if (categoryId && subcategoryId) {
          const categoryResponse = await fetch(`/api/categories?id=${categoryId}`);
          if (!categoryResponse.ok) {
            console.error('Failed to fetch category:', categoryResponse.statusText);
            setError('Failed to load category information');
            setLoading(false);
            return;
          }

          const categoryData = await categoryResponse.json();
          if (categoryData.error) {
            console.error('Category error:', categoryData.error);
            setError('Category not found');
            setLoading(false);
            return;
          }

          setCategoryName(categoryData.name || '');
          
          if (categoryData.subcategories?.[subcategoryId]) {
            setSubcategoryName(categoryData.subcategories[subcategoryId].name || '');
          } else {
            console.error('Subcategory not found');
            setError('Subcategory not found');
            setLoading(false);
            return;
          }
        }
        
        // Check if user has liked this prompt
        if (user) {
          const likeResponse = await fetch(`/api/prompts/${promptId}/like`);
          if (likeResponse.ok) {
            const { isLiked: userLiked } = await likeResponse.json();
            setIsLiked(userLiked);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching prompt:', err);
        setError('Failed to load prompt');
        setLoading(false);
      }
    };

    if (promptId) {
      fetchPrompt();
    }
  }, [promptId, user, categoryId, subcategoryId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt?.content || '');
    setContentCopied(true);
    setTimeout(() => setContentCopied(false), 2000);
  };

  const handleLike = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!prompt) return;

    try {
      const response = await fetch(`/api/prompts/${promptId}/like`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to update like');
      }

      const { likes, isLiked: newIsLiked } = await response.json();
      setLikeCount(likes);
      setIsLiked(newIsLiked);
    } catch (err) {
      console.error('Error updating like:', err);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: prompt?.title,
      text: prompt?.description,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        // Use native sharing on mobile devices
        await navigator.share(shareData);
      } else {
        // Fallback to copying the URL on desktop
        await navigator.clipboard.writeText(window.location.href);
        setUrlCopied(true);
        setTimeout(() => setUrlCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div 
          className="relative w-16 h-16"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full border-t-2 border-[#00ffff] opacity-20"></div>
          <div className="absolute inset-0 rounded-full border-l-2 border-[#00ffff]"></div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="container mx-auto p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block p-6 bg-black/80 backdrop-blur-lg border border-red-500/20 rounded-lg"
        >
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-[#00ffff]/10 text-[#00ffff] rounded-lg hover:bg-[#00ffff]/20 transition-colors"
        >
          Back to Home
        </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background with enhanced fade effect */}
      <div className="fixed inset-0 bg-gradient-to-t from-black via-black to-transparent" />
      <div className="fixed inset-0 bg-[#00ffff]/5" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 space-y-4"
          >
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Link 
                href="/categories"
                className="hover:text-[#00ffff] transition-colors"
              >
                Categories
              </Link>
              <span>/</span>
              <Link 
                href={`/categories/${categoryId}`}
                className="hover:text-[#00ffff] transition-colors"
              >
                {categoryName || 'Category'}
              </Link>
              <span>/</span>
              <Link 
                href={`/categories/${categoryId}/${subcategoryId}`}
                className="text-[#00ffff]"
              >
                {subcategoryName || 'Subcategory'}
              </Link>
            </div>

            {/* Back Button */}
            <Link 
              href={`/categories/${categoryId}/${subcategoryId}`}
              className="inline-flex items-center text-[#00ffff] hover:text-[#00ffff]/80 group"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              {subcategoryName ? `Back to ${subcategoryName}` : 'Back to Subcategory'}
            </Link>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg overflow-hidden"
          >
            {/* Header Section */}
            <div className="relative p-8 border-b border-[#00ffff]/10">
              <motion.div 
                className="absolute top-0 right-0 w-64 h-64 bg-[#00ffff]/5 rounded-full blur-3xl -z-10"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <motion.h1 
                className="text-4xl font-bold bg-gradient-to-r from-[#00ffff] via-white to-[#00ffff] bg-clip-text text-transparent mb-4"
                layout
              >
                {prompt?.title}
              </motion.h1>
              
              <motion.p 
                className="text-lg text-white/80 mb-6"
                layout
              >
                {prompt?.description}
              </motion.p>

              <div className="flex flex-wrap gap-4">
                {prompt?.tags?.map((tag, index) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-3 py-1 rounded-full bg-[#00ffff]/10 text-[#00ffff] text-sm border border-[#00ffff]/20"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 space-y-6">
              {/* Action Buttons */}
              <motion.div 
                className="flex items-center justify-end gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 text-[#00ffff]/60 hover:text-[#00ffff] hover:bg-black/60 backdrop-blur-lg transition-colors relative"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ClipboardIcon className="h-5 w-5" />
                  <span>Copy</span>
                  <AnimatePresence>
                    {contentCopied && (
                      <motion.span 
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#00ffff] text-black text-xs px-2 py-1 rounded shadow-lg"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                      >
                        Content Copied!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <motion.button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 text-[#00ffff]/60 hover:text-[#00ffff] hover:bg-black/60 backdrop-blur-lg transition-colors relative"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShareIcon className="h-5 w-5" />
                  <span>Share</span>
                  <AnimatePresence>
                    {urlCopied && (
                      <motion.span 
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#00ffff] text-black text-xs px-2 py-1 rounded shadow-lg"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                      >
                        URL Copied!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <motion.button
                  onClick={handleLike}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 backdrop-blur-lg transition-colors ${
                    isLiked ? 'text-[#00ffff]' : 'text-[#00ffff]/60 hover:text-[#00ffff]'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <HeartIcon className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>Like</span>
                  {likeCount > 0 && (
                    <span className="ml-1 text-sm">
                      ({likeCount})
                    </span>
                  )}
                </motion.button>
              </motion.div>

              {/* Prompt Content */}
              <motion.div 
                className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6 group relative overflow-hidden"
                whileHover={{ scale: 1.005 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#00ffff]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <pre className="text-white/90 whitespace-pre-wrap font-mono relative z-10">
                  {prompt?.content}
                </pre>
              </motion.div>

              {/* Footer Section */}
              <motion.div 
                className="flex justify-between items-center text-white/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center gap-2">
                  <SparklesIcon className="h-5 w-5 text-[#00ffff]" />
                  <span>Created by {prompt?.userName}</span>
                  <span>•</span>
                  <span>{prompt?.createdAt && new Date(prompt.createdAt).toLocaleDateString()}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 