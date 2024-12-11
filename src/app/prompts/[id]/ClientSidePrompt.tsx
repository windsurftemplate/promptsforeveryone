'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ClientSidePrompt({ id }: { id: string }) {
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

    fetchPromptData();
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
          <button
            onClick={handleCopy}
            className={`button-secondary ${copied ? 'text-green-600' : ''}`}
          >
            {copied ? 'Copied!' : 'Copy Prompt'}
          </button>
        </div>
      </div>
    </div>
  );
}
