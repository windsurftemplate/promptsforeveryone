'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ref, get, push } from 'firebase/database';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { generateSlug } from '@/lib/blog';

interface BlogPost {
  title: string;
  content: string;
  date: string;
  readTime: string;
  summary: string;
  slug?: string;
}

export default function NewBlogPost() {
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<BlogPost>({
    title: '',
    content: '',
    date: new Date().toISOString(),
    readTime: '5 min read',
    summary: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Check if current user is admin
    const checkAdmin = async () => {
      const adminRef = ref(db, `users/${user.uid}/role`);
      const snapshot = await get(adminRef);
      if (!snapshot.exists() || snapshot.val() !== 'admin') {
        router.push('/dashboard');
      }
      setLoading(false);
    };

    checkAdmin();
  }, [user, router]);

  const handleSave = async () => {
    if (!post.title || !post.content) {
      setError('Title and content are required');
      return;
    }

    setSaving(true);
    try {
      const blogRef = ref(db, 'blog');
      await push(blogRef, {
        ...post,
        author: user?.displayName || user?.email || 'Anonymous',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        slug: generateSlug(post.title)
      });
      router.push('/admin');
    } catch (err) {
      console.error('Error saving blog post:', err);
      setError('Failed to save blog post');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-[#00ffff]/10 rounded-lg w-3/4"></div>
            <div className="h-4 bg-[#00ffff]/10 rounded-lg w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00ffff] to-white bg-clip-text text-transparent">
            Create New Blog Post
          </h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              onClick={() => router.push('/admin')}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#00ffff] mb-2">
              Title
            </label>
            <input
              type="text"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="w-full bg-black/50 border border-[#00ffff]/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ffff]/40"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#00ffff] mb-2">
              Summary
            </label>
            <textarea
              value={post.summary}
              onChange={(e) => setPost({ ...post, summary: e.target.value })}
              className="w-full bg-black/50 border border-[#00ffff]/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ffff]/40 h-24"
              placeholder="Enter post summary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#00ffff] mb-2">
              Read Time
            </label>
            <input
              type="text"
              value={post.readTime}
              onChange={(e) => setPost({ ...post, readTime: e.target.value })}
              className="w-full bg-black/50 border border-[#00ffff]/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ffff]/40"
              placeholder="e.g., 5 min read"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#00ffff] mb-2">
              Content (HTML)
            </label>
            <div className="border border-[#00ffff]/20 rounded-lg overflow-hidden">
              <textarea
                value={post.content}
                onChange={(e) => setPost({ ...post, content: e.target.value })}
                className="w-full h-[70vh] bg-black/50 border-none px-4 py-2 text-white font-mono resize-none focus:outline-none focus:ring-1 focus:ring-[#00ffff]/40"
                placeholder="Enter blog content in HTML format"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 