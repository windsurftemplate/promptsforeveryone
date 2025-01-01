'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { defaultContent } from '@/content/howToStart';

const MonacoEditorWrapper = dynamic(
  () => import('@/components/editor/MonacoEditorWrapper'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[70vh] bg-gray-100 animate-pulse rounded-md flex items-center justify-center">
        Loading Editor...
      </div>
    ),
  }
);

const MarkdownPreview = dynamic(() => import('@/components/MarkdownPreview'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[70vh] bg-gray-100 animate-pulse rounded-md flex items-center justify-center">
      Loading Preview...
    </div>
  ),
});

export default function EditHowToStartPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    // Load content from localStorage or use default
    const savedContent = localStorage.getItem('howToStartContent');
    setContent(savedContent || defaultContent);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('howToStartContent', content);
      router.push('/how-to-start');
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Edit How to Start Page</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-4 py-2 bg-surface hover:bg-surface-hover rounded-md"
            >
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={() => router.push('/how-to-start')}
              className="px-4 py-2 bg-surface hover:bg-surface-hover rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-accent disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {previewMode ? (
          <MarkdownPreview
            content={content}
            className="bg-surface p-6 rounded-lg"
          />
        ) : (
          <MonacoEditorWrapper
            content={content}
            onChange={setContent}
            theme="vs-dark"
            fontSize={14}
          />
        )}
      </div>
    </div>
  );
}
