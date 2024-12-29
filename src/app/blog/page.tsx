'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  featured?: boolean;
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const blogRef = ref(db, 'blog');
        const snapshot = await get(blogRef);
        if (snapshot.exists()) {
          const posts = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
            id,
            ...data,
          }));
          setBlogPosts(posts);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const featuredPost = blogPosts.find(post => post.featured);
  const recentPosts = blogPosts.filter(post => !post.featured);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-[#00ffff]/10 rounded w-1/4"></div>
          <div className="h-64 bg-[#00ffff]/10 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-[#00ffff]/10 rounded"></div>
            <div className="h-48 bg-[#00ffff]/10 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">
        Blog
      </h1>

      <div className="space-y-8">
        {/* Featured Post */}
        {featuredPost && (
          <Card className="p-6 border border-[#00ffff]/20 bg-black/80 backdrop-blur-lg transform hover:scale-[1.02] transition-all duration-300 hover:border-[#00ffff]/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-white/60">
                <span className="bg-[#00ffff]/20 text-[#00ffff] px-2 py-1 rounded">Featured</span>
                <span>•</span>
                <span>{featuredPost.category}</span>
                <span>•</span>
                <span>{featuredPost.readTime}</span>
              </div>
              <h2 className="text-2xl font-bold hover:text-[#00ffff] transition-colors">
                <Link href={`/blog/${featuredPost.id}`}>
                  {featuredPost.title}
                </Link>
              </h2>
              <p className="text-white/60">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#00ffff]/20 flex items-center justify-center text-[#00ffff]">
                  {featuredPost.author[0]}
                </div>
                <div>
                  <p className="font-medium text-white">{featuredPost.author}</p>
                  <p className="text-sm text-white/60">{featuredPost.date}</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Recent Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentPosts.map(post => (
            <Card key={post.id} className="p-6 border border-[#00ffff]/20 bg-black/80 backdrop-blur-lg transform hover:scale-[1.02] transition-all duration-300 hover:border-[#00ffff]/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-white/60">
                  <span>{post.category}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-xl font-bold hover:text-[#00ffff] transition-colors">
                  <Link href={`/blog/${post.id}`}>
                    {post.title}
                  </Link>
                </h2>
                <p className="text-white/60">
                  {post.excerpt}
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-[#00ffff]/20 flex items-center justify-center text-[#00ffff]">
                    {post.author[0]}
                  </div>
                  <div>
                    <p className="font-medium text-white">{post.author}</p>
                    <p className="text-sm text-white/60">{post.date}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Categories */}
        <Card className="p-6 border border-[#00ffff]/20 bg-black/80 backdrop-blur-lg">
          <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(blogPosts.map(post => post.category))).map(category => (
              <span 
                key={category}
                className="px-3 py-1 bg-[#00ffff]/10 text-[#00ffff] rounded-full text-sm hover:bg-[#00ffff]/20 cursor-pointer transition-colors"
              >
                {category}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
