'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import dynamic from 'next/dynamic';
import EditorToolbar from '@/components/editor/EditorToolbar';
import { Prompt } from '@/types/prompt';

const MonacoEditorWrapper = dynamic(
  () => import('@/components/editor/MonacoEditorWrapper'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-md flex items-center justify-center">
        Loading Editor...
      </div>
    ),
  }
);

interface Props {
  id: string;
}

export default function PromptClient({ id }: Props) {
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const response = await fetch(`/api/prompts/${id}`);
        if (response.ok) {
          const promptData = await response.json();
          setPrompt({ ...promptData, id });
          setEditorContent(promptData.content);
        } else {
          setError('Prompt not found');
        }
      } catch (err) {
        console.error('Error fetching prompt:', err);
        setError('Failed to fetch prompt');
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, [id]);

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(editorContent);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to copy content:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">{error || 'An error occurred'}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{prompt.title}</h1>
            <p className="text-gray-600">{prompt.description}</p>
          </div>

          <div className="space-y-4">
            <EditorToolbar
              theme={editorTheme}
              onThemeChange={setEditorTheme}
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
            />

            <MonacoEditorWrapper
              content={editorContent}
              onChange={setEditorContent}
              theme={editorTheme}
              fontSize={fontSize}
            />
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Created by {prompt.userName} on{' '}
              {new Date(prompt.createdAt).toLocaleDateString()}
            </div>
            <button
              onClick={handleCopyContent}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              {copyStatus === 'copied' ? 'Copied!' : 'Copy Content'}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
} 