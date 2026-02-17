'use client';

import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import { BlogPost } from '@/lib/blog';
import matter from 'gray-matter';
import BlogPostContent from './BlogPostContent';
import { motion } from 'framer-motion';

interface Props {
  slug: string;
}

export default function BlogPostClient({ slug }: Props) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      console.error('No slug provided:', slug);
      setError('Invalid blog post URL');
      setLoading(false);
      return;
    }

    async function fetchPosts() {
      try {
        console.log('Fetching posts...');
        
        const blogRef = ref(db, 'blog');
        const snapshot = await get(blogRef);
        
        if (snapshot.exists()) {
          const blogData = snapshot.val();
          console.log('Found blog posts:', Object.keys(blogData).length);
          
          // Transform all posts
          const allPosts = Object.entries(blogData).map(([id, data]: [string, any]) => {
            const typedData = data as Partial<BlogPost>;
            return {
              id,
              title: typedData.title || '',
              content: typedData.content || '',
              date: typedData.date || new Date().toISOString(),
              readTime: typedData.readTime || '5 min read',
              summary: typedData.summary || '',
              slug: typedData.slug || '',
              author: typedData.author || 'Anonymous',
              tags: typedData.tags || []
            };
          });

          // Find current post
          const currentPost = allPosts.find(post => post.slug === slug);
          
          if (currentPost) {
            setPost(currentPost);
            
            // Get popular posts (excluding current post)
            const otherPosts = allPosts.filter(post => post.slug !== slug);
            // Sort by date for now (you could add a view count field later)
            const sortedPosts = otherPosts.sort((a, b) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            setPopularPosts(sortedPosts.slice(0, 5));
          } else {
            console.log('No post found with slug:', slug);
            setError('Blog post not found');
          }
        } else {
          console.log('No blog posts exist in database');
          setError('Blog post not found');
        }
      } catch (err: any) {
        console.error('Error fetching blog post:', err);
        console.error('Error details:', {
          message: err?.message,
          code: err?.code,
          stack: err?.stack
        });
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto px-4 pt-32 pb-16"
        >
          <div className="space-y-12">
            {/* Hero section loading state */}
            <div className="space-y-8">
              <div className="h-2 w-24 bg-[#8B5CF6]/20 rounded-full animate-pulse" />
              <div className="h-16 w-3/4 bg-[#8B5CF6]/10 rounded-lg animate-pulse" />
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-[#8B5CF6]/10 animate-pulse" />
                <div className="h-4 w-32 bg-[#8B5CF6]/10 rounded-full animate-pulse" />
              </div>
            </div>
            
            {/* Content loading state */}
            <div className="space-y-6 pt-12">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="h-4 bg-[#8B5CF6]/10 rounded-full w-full animate-pulse" />
                  <div className="h-4 bg-[#8B5CF6]/10 rounded-full w-5/6 animate-pulse" />
                  <div className="h-4 bg-[#8B5CF6]/10 rounded-full w-4/6 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-black">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 pt-32 pb-16 text-center"
        >
          <h1 className="text-3xl font-bold text-white/80 mb-4">
            {error || 'Blog post not found'}
          </h1>
          <p className="text-white/60">
            The blog post you're looking for might have been moved or deleted.
          </p>
        </motion.div>
      </div>
    );
  }

  return <BlogPostContent post={post} popularPosts={popularPosts} />;
} 