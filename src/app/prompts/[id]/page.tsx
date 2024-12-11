'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface PageProps {
  params: { id: string };
}

export default function PromptPage({ params }: PageProps) {
  const [promptData, setPromptData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPromptData = async () => {
      try {
        const response = await fetch(`/api/prompts/${params.id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch prompt ${params.id}`);
        }
        const data = await response.json();
        setPromptData(data);
      } catch (error) {
        console.error(`Error fetching prompt ${params.id}:`, error);
      }
    };

    if (params.id) {
      fetchPromptData();
    }
  }, [params.id]);

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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Professional Email Writer</h1>
            <div className="flex items-center space-x-2 mt-2">
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
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopy}
              className={`button-secondary ${copied ? 'text-green-600' : ''}`}
            >
              {copied ? 'Copied!' : 'Copy Prompt'}
            </button>
          </div>
        </div>
      </div>

      {/* Prompt Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Prompt Template</h2>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-800">
              <pre className="whitespace-pre-wrap">
{`I need to write a professional email with the following details:
- Purpose: {purpose}
- Recipient: {recipient}
- Key points: {key_points}
- Tone: {tone}

Please help me write a well-structured email that effectively communicates my message while maintaining professionalism and clarity.`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
