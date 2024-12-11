'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface PageProps {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
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

        <div className="flex items-center space-x-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              <Image 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                alt="Creator avatar"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Created by John Doe</p>
              <p className="text-sm text-gray-500">Dec 10, 2024</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              2.5k views
            </span>
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              1.2k uses
            </span>
          </div>
        </div>
      </div>

      {/* Prompt Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="card p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Description</h2>
            <p className="text-gray-600">
              This prompt helps you write professional emails with the perfect tone and structure for any business situation. 
              It considers the context, recipient, and purpose to generate appropriate content that maintains professionalism 
              while effectively communicating your message.
            </p>
          </div>

          {/* Prompt Template */}
          <div className="card p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Prompt Template</h2>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-800">
              <pre className="whitespace-pre-wrap">
                I need to write a professional email with the following details:
                - Purpose: {"{purpose}"}
                - Recipient: {"{recipient}"}
                - Key points: {"{key_points}"}
                - Tone: {"{tone}"}

                Please help me write a well-structured email that effectively communicates my message while maintaining professionalism and clarity.
              </pre>
            </div>
          </div>

          {/* Example Usage */}
          <div className="card p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Example Usage</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Input:</h3>
                <pre className="whitespace-pre-wrap text-sm text-gray-800">
                  Purpose: Request for meeting
                  Recipient: Project stakeholders
                  Key points: Project update, timeline discussion, resource allocation
                  Tone: Professional but friendly
                </pre>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Output:</h3>
                <pre className="whitespace-pre-wrap text-sm text-gray-800">
                  Subject: Project Update Meeting Request

                  Dear Project Stakeholders,

                  I hope this email finds you well. I am writing to request a meeting to discuss several important aspects of our ongoing project.

                  During the meeting, we will cover:
                  • Current project status and progress updates
                  • Timeline review and adjustments if needed
                  • Resource allocation and requirements

                  Would you be available for a 45-minute meeting next week? Please let me know your preferred time slots, and I&#39;ll coordinate accordingly.

                  Looking forward to our discussion.

                  Best regards,
                  [Your name]
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rating</span>
                <span className="font-medium">4.9/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Uses</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Created</span>
                <span className="font-medium">Dec 10, 2024</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {['email', 'business', 'professional', 'communication'].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Share */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share</h3>
            <div className="flex space-x-4">
              <button className="button-secondary flex-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
                Twitter
              </button>
              <button className="button-secondary flex-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 4h-4V2h-2v2h-4V2h-2v2H6V2H4v2H2v18h20V4zm-2 16H4V8h16v12z" />
                </svg>
                LinkedIn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
