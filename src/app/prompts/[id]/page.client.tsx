'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PromptPageClient({ id }: { id: string }) {
  const [promptData, setPromptData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPromptData = async () => {
      try {
        const response = await fetch(`/api/prompts/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch prompt ${id}`);
        }
        const data = await response.json();
        setPromptData(data);
      } catch (error) {
        console.error(`Error fetching prompt ${id}:`, error);
      }
    };

    if (id) {
      fetchPromptData();
    }
  }, [id]);


  const handleCopy = () => {
    navigator.clipboard.writeText(`I need to write a professional email with the following details:
- Purpose: {purpose}
- Recipient: {recipient}
- Key points: {key_points}
- Tone: {tone}

Please help me write a well-structured email that effectively communicates my message while maintaining professionalism and clarity.`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Prompt Header */}
      <div className="card p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-sm font-medium text-indigo-800">
                ChatGPT
              </span>
              <span className="inline-flex items-center text-sm text-gray-500">
                <Image 
                  src="/path-to-your-image.png"
                  alt="Rating"
                  width={16}
                  height={16}
                  className="w-4 h-4 text-yellow-400 mr-1"
                />
                4.9 (128 ratings)
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Professional Email Writer</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopy}
              className={`button-secondary ${copied ? 'text-green-600' : ''}`}
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy Prompt
                </>
              )}
            </button>
            <button className="button-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
