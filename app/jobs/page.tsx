'use client';

import { useState } from 'react';

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-8">
          Prompt Engineering Jobs
        </h1>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Featured Job Card */}
          <div className="bg-black border border-[#00ffff]/20 rounded-lg p-6 hover:border-[#00ffff]/50 transition-colors">
            <h3 className="text-[#00ffff] text-xl font-semibold mb-2">Prompt Engineer</h3>
            <p className="text-gray-400 mb-4">
              Join our team as a Prompt Engineer and help shape the future of AI interactions.
            </p>
            <div className="space-y-2 mb-4">
              <p className="text-gray-300"><span className="text-[#00ffff]">Skills:</span> AI/ML, Natural Language Processing, Creative Writing</p>
              <p className="text-gray-300"><span className="text-[#00ffff]">Location:</span> Remote</p>
              <p className="text-gray-300"><span className="text-[#00ffff]">Type:</span> Full-time</p>
            </div>
            <a 
              href="https://www.linkedin.com/jobs/prompt-engineer-jobs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-black text-[#00ffff] border border-[#00ffff] rounded hover:bg-[#00ffff]/10 transition-colors"
            >
              Apply Now
            </a>
          </div>

          {/* Resources Card */}
          <div className="bg-black border border-[#00ffff]/20 rounded-lg p-6">
            <h3 className="text-[#00ffff] text-xl font-semibold mb-4">Resources for Prompt Engineers</h3>
            <ul className="space-y-3 text-gray-300">
              <li>• Create a strong portfolio of prompts</li>
              <li>• Learn about different AI models</li>
              <li>• Practice writing effective prompts</li>
              <li>• Join our community of prompt engineers</li>
            </ul>
          </div>

          {/* Getting Started Card */}
          <div className="bg-black border border-[#00ffff]/20 rounded-lg p-6">
            <h3 className="text-[#00ffff] text-xl font-semibold mb-4">Getting Started</h3>
            <p className="text-gray-300 mb-4">
              New to prompt engineering? Here's how to begin your journey:
            </p>
            <ul className="space-y-3 text-gray-300">
              <li>1. Read our comprehensive tutorial</li>
              <li>2. Practice with our AI chat feature</li>
              <li>3. Submit your own prompts</li>
              <li>4. Join discussions and get feedback</li>
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-6">
            Why Become a Prompt Engineer?
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-black border border-[#00ffff]/20 rounded-lg p-6">
              <h3 className="text-[#00ffff] text-lg font-semibold mb-3">Growing Field</h3>
              <p className="text-gray-300">
                The demand for skilled prompt engineers is rapidly increasing as AI becomes more prevalent in various industries.
              </p>
            </div>
            <div className="bg-black border border-[#00ffff]/20 rounded-lg p-6">
              <h3 className="text-[#00ffff] text-lg font-semibold mb-3">Remote Work</h3>
              <p className="text-gray-300">
                Most prompt engineering positions offer flexible remote work opportunities.
              </p>
            </div>
            <div className="bg-black border border-[#00ffff]/20 rounded-lg p-6">
              <h3 className="text-[#00ffff] text-lg font-semibold mb-3">Competitive Pay</h3>
              <p className="text-gray-300">
                As a specialized skill, prompt engineering commands competitive compensation packages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 