'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { BlogPost, generateSlug } from '@/lib/blog';
import { TwitterIcon, GithubIcon } from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const gradientAnimation = {
  initial: { backgroundPosition: '0% 50%' },
  animate: { 
    backgroundPosition: '100% 50%',
    transition: {
      duration: 15,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "linear"
    }
  }
};

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('Starting to fetch blog posts...');
        console.log('Firebase db instance:', !!db);
        
        const blogRef = ref(db, 'blog');
        console.log('Blog reference created:', blogRef.toString());
        
        console.log('Fetching snapshot...');
        const snapshot = await get(blogRef);
        console.log('Snapshot received, exists:', snapshot.exists());
        
        if (snapshot.exists()) {
          const blogData = snapshot.val();
          console.log('Raw blog data:', blogData);
          
          const blogArray = Object.entries(blogData)
            .map(([id, data]: [string, any]) => {
              try {
                const post: BlogPost = {
                  id,
                  title: data.title || '',
                  content: data.content || '',
                  date: data.date || new Date().toISOString(),
                  readTime: data.readTime || '5 min read',
                  summary: data.summary || '',
                  slug: data.slug || generateSlug(data.title || ''),
                  author: data.author || 'Anonymous',
                  tags: data.tags || []
                };
                console.log('Processed post:', {
                  id,
                  title: post.title,
                  slug: post.slug
                });
                return post;
              } catch (err) {
                console.error('Error processing post:', { id, data, error: err });
                return null;
              }
            })
            .filter((post): post is BlogPost => post !== null)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          console.log('Final blog array:', blogArray.map(post => ({
            id: post.id,
            title: post.title,
            slug: post.slug
          })));
          setBlogPosts(blogArray);
        } else {
          console.log('No blog posts found in database');
          setBlogPosts([]);
        }
      } catch (err: any) {
        console.error('Error details:', {
          message: err?.message,
          code: err?.code,
          stack: err?.stack
        });
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags || [])));
  const filteredPosts = selectedTag
    ? blogPosts.filter(post => post.tags?.includes(selectedTag))
    : blogPosts;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
          <div className="animate-pulse space-y-16">
            {/* Featured post skeleton */}
            <div className="relative h-[60vh] rounded-2xl overflow-hidden bg-gray-800/50">
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="h-4 w-32 bg-gray-700 rounded-full mb-4" />
                <div className="h-8 w-2/3 bg-gray-700 rounded-full mb-4" />
                <div className="h-4 w-1/2 bg-gray-700 rounded-full" />
              </div>
            </div>
            
            {/* Grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800/50 rounded-xl p-6 space-y-4">
                  <div className="h-4 w-24 bg-gray-700 rounded-full" />
                  <div className="h-6 w-3/4 bg-gray-700 rounded-full" />
                  <div className="h-20 w-full bg-gray-700 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-16 text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#8B5CF6] via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Insights & Stories
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Exploring the intersection of technology, creativity, and innovation
          </p>
        </motion.div>

        {/* Tags */}
        {allTags.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mb-16 justify-center"
          >
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                !selectedTag 
                  ? 'bg-[#8B5CF6] text-black font-medium' 
                  : 'bg-[#8B5CF6]/10 text-[#8B5CF6] hover:bg-[#8B5CF6]/20'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedTag === tag 
                    ? 'bg-[#8B5CF6] text-black font-medium' 
                    : 'bg-[#8B5CF6]/10 text-[#8B5CF6] hover:bg-[#8B5CF6]/20'
                }`}
              >
                {tag}
              </button>
            ))}
          </motion.div>
        )}

        {featuredPost && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <Link href={`/blog/${featuredPost.slug}`}>
              <div className="group relative h-[60vh] rounded-2xl overflow-hidden">
                <motion.div 
                  variants={gradientAnimation}
                  initial="initial"
                  animate="animate"
                  className="absolute inset-0 bg-[length:400%_400%]"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at top left, rgba(0, 255, 255, 0.2), transparent 40%),
                      radial-gradient(circle at bottom right, rgba(236, 72, 153, 0.2), transparent 40%),
                      radial-gradient(circle at center, rgba(168, 85, 247, 0.15), transparent 50%)
                    `
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:opacity-0" />
                <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform group-hover:translate-y-2">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-300">
                      <time dateTime={featuredPost.date}>
                        {format(new Date(featuredPost.date), 'MMMM d, yyyy')}
                      </time>
                      <span className="w-1 h-1 rounded-full bg-[#8B5CF6]" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white group-hover:text-[#8B5CF6] transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-lg text-gray-300 max-w-3xl">
                      {featuredPost.summary}
                    </p>
                    {featuredPost.tags && featuredPost.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {featuredPost.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-sm text-[#8B5CF6] bg-[#8B5CF6]/10 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Blog Posts Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {remainingPosts.map((post, index) => (
            <Link 
              key={post.id} 
              href={`/blog/${post.slug}`}
              className="group"
            >
              <motion.article
                whileHover={{ y: -5 }}
                className="h-full backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-[#8B5CF6]/50 transition-all relative"
              >
                <motion.div 
                  variants={gradientAnimation}
                  initial="initial"
                  animate="animate"
                  className="absolute inset-0 bg-[length:400%_400%] opacity-30"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at ${index % 2 ? 'top right' : 'bottom left'}, 
                        rgba(0, 255, 255, 0.15), transparent 40%),
                      radial-gradient(circle at center, 
                        rgba(168, 85, 247, 0.1), transparent 50%)
                    `
                  }}
                />
                <div className="relative z-10 p-6 space-y-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <time dateTime={post.date}>
                      {format(new Date(post.date), 'MMMM d, yyyy')}
                    </time>
                    <span className="w-1 h-1 rounded-full bg-[#8B5CF6]" />
                    <span>{post.readTime}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-white group-hover:text-[#8B5CF6] transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-gray-400">
                    {post.summary}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs text-[#8B5CF6] bg-[#8B5CF6]/10 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            </Link>
          ))}
        </motion.div>
      </div>
      
      {/* Footer */}
      <footer className="relative z-20 py-12 bg-black border-t border-[#8B5CF6]/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
              <div className="text-center">
                <h3 className="text-[#8B5CF6] font-semibold mb-4">Product</h3>
                <ul className="space-y-3">
                  <li><Link href="/explore" className="text-white/60 hover:text-[#8B5CF6] transition-colors">Explore</Link></li>
                  <li><Link href="/submit" className="text-white/60 hover:text-[#8B5CF6] transition-colors">Submit Prompt</Link></li>
                  <li><Link href="/price" className="text-white/60 hover:text-[#8B5CF6] transition-colors">Pricing</Link></li>
                </ul>
              </div>
              <div className="text-center">
                <h3 className="text-[#8B5CF6] font-semibold mb-4">Resources</h3>
                <ul className="space-y-3">
                  <li><Link href="/guides" className="text-white/60 hover:text-[#8B5CF6] transition-colors">Guides</Link></li>
                  <li><Link href="/blog" className="text-white/60 hover:text-[#8B5CF6] transition-colors">Blog</Link></li>
                  <li><Link href="/about" className="text-white/60 hover:text-[#8B5CF6] transition-colors">About</Link></li>
                  <li><Link href="/careers" className="text-white/60 hover:text-[#8B5CF6] transition-colors">Careers</Link></li>
                </ul>
              </div>
              <div className="text-center">
                <h3 className="text-[#8B5CF6] font-semibold mb-4">Legal</h3>
                <ul className="space-y-3">
                  <li><Link href="/terms" className="text-white/60 hover:text-[#8B5CF6] transition-colors">Terms</Link></li>
                  <li><Link href="/privacy" className="text-white/60 hover:text-[#8B5CF6] transition-colors">Privacy</Link></li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#8B5CF6]/10">
              <div className="text-white/60 text-sm mb-4 md:mb-0">
                © 2025 Prompts For Everyone. All rights reserved.
              </div>
              <div className="flex gap-6">
                <Link href="https://twitter.com" className="text-white/60 hover:text-[#8B5CF6] transition-colors">
                  <TwitterIcon className="w-5 h-5" />
                </Link>
                <Link href="https://github.com" className="text-white/60 hover:text-[#8B5CF6] transition-colors">
                  <GithubIcon className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
