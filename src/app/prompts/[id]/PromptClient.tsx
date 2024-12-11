'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface PromptClientProps {
  id: string;
}

export default function PromptClient({ id }: PromptClientProps) {
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Professional Email Writer</h1>
            <p className="text-gray-500">Create professional emails with ease</p>
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {copied ? 'Copied!' : 'Copy Prompt'}
          </button>
        </div>
      </div>

      {/* Prompt Content */}
      <div className="card p-8 space-y-6">
        <div className="prose max-w-none">
          <h2>Instructions</h2>
          <p>Use this prompt to generate professional emails by providing the following details:</p>
          <ul>
            <li>Purpose of the email</li>
            <li>Recipient information</li>
            <li>Key points to cover</li>
            <li>Desired tone</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
