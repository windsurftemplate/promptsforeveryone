'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';

interface BlogPost {
  title: string;
  content: string;
  date: string;
  readTime: string;
  summary: string;
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postRef = ref(db, `blog/${slug}`);
        const snapshot = await get(postRef);
        
        if (snapshot.exists()) {
          setPost(snapshot.val());
        } else {
          setError('Blog post not found');
        }
      } catch (err) {
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-[#00ffff]/10 rounded-lg w-3/4"></div>
            <div className="h-4 bg-[#00ffff]/10 rounded-lg w-1/4"></div>
            <div className="space-y-2 pt-8">
              <div className="h-4 bg-[#00ffff]/10 rounded-lg"></div>
              <div className="h-4 bg-[#00ffff]/10 rounded-lg"></div>
              <div className="h-4 bg-[#00ffff]/10 rounded-lg w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-black pt-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl text-white/80">{error || 'Blog post not found'}</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24">
      <article className="max-w-4xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">
            {post.title}
          </h1>
          <div className="flex items-center text-white/60 text-sm">
            <time dateTime={post.date}>
              {format(new Date(post.date), 'MMMM d, yyyy')}
            </time>
            <span className="mx-2">•</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        <div className="prose prose-invert prose-cyan max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
    </div>
  );
} 