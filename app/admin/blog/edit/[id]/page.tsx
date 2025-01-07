'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ref, get, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import dynamic from 'next/dynamic';

interface MonacoEditorProps {
  content: string;
  onChange: (value: string) => void;
  theme?: string;
  fontSize?: number;
}

const MonacoEditorWrapper = dynamic<MonacoEditorProps>(
  () => import('@/components/editor/MonacoEditorWrapper'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[70vh] bg-black/50 animate-pulse rounded-md flex items-center justify-center">
        Loading Editor...
      </div>
    ),
  }
);

interface BlogPost {
  title: string;
  content: string;
  date: string;
  readTime: string;
  summary: string;
}

export default function EditBlogPost() {
  const { id } = useParams();
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
        return;
      }

      // Fetch the post data
      try {
        const postRef = ref(db, `blog/${id}`);
        const postSnapshot = await get(postRef);
        
        if (postSnapshot.exists()) {
          setPost(postSnapshot.val());
        } else {
          setError('Blog post not found');
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [user, router, id]);

  const handleSave = async () => {
    if (!post.title || !post.content) {
      setError('Title and content are required');
      return;
    }

    setSaving(true);
    try {
      const postRef = ref(db, `blog/${id}`);
      await set(postRef, {
        ...post,
        updatedAt: new Date().toISOString()
      });
      router.push('/admin');
    } catch (err) {
      console.error('Error updating blog post:', err);
      setError('Failed to update blog post');
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
            Edit Blog Post
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
              <MonacoEditorWrapper
                content={post.content}
                onChange={(value) => setPost({ ...post, content: value })}
                theme="vs-dark"
                fontSize={14}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 