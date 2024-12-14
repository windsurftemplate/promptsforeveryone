'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { marked } from 'marked';

const defaultContent = `# How to Start

## Create Your Account
Sign in using your Google account to get started. This will allow you to:
- Create and manage your prompts
- Like and download other users' prompts
- Track your prompt statistics

## Create Your First Prompt
Click the "Create New Prompt" button in your dashboard to create your first prompt:
1. Give your prompt a descriptive title
2. Write your prompt using markdown formatting
3. Add relevant tags to help others find your prompt
4. Click "Save" to publish your prompt

## Browse and Use Prompts
Explore the prompt library to find prompts that suit your needs:
- Use the search bar to find specific prompts
- Filter by tags or categories
- Sort by popularity or recent updates
- Click on a prompt to view its details and usage instructions

## Engage with the Community
- Like prompts that you find helpful
- Leave constructive feedback for prompt creators
- Follow creators whose prompts you enjoy
- Share your own experiences and tips

## Need Help?
- Check our FAQ section for common questions
- Join our Discord community for real-time help
- Contact support for technical issues
`;

export default function HowToStartPage() {
  const router = useRouter();
  const [content, setContent] = useState('');

  useEffect(() => {
    // Load content from localStorage or use default
    const savedContent = localStorage.getItem('howToStartContent');
    setContent(savedContent || defaultContent);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center relative">
          <h1 className="text-4xl font-bold mb-4">How to Start</h1>
          <p className="text-text-muted text-lg">A guide to help you get started with our prompt repository</p>
        </div>

        <div 
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: marked(content) }}
        />
      </div>
    </div>
  );
}
