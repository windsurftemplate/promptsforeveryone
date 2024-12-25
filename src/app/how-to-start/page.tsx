'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';

const steps = [
  {
    title: '1. Find the Right Prompt',
    description: 'Browse our collection of prompts organized by categories like Frontend, Backend, or Full-Stack development. Each prompt is designed to help you build specific features or entire applications.',
    icon: '🔍',
    tips: [
      'Use the search bar to find prompts for specific features',
      'Filter by categories to narrow down your search',
      'Check prompt ratings and reviews from other developers',
      'Preview the prompt output before using it'
    ]
  },
  {
    title: '2. Customize Your Prompt',
    description: 'Modify the prompt to match your specific requirements. Our prompts are designed to be flexible and can be adapted to different tech stacks and use cases.',
    icon: '✏️',
    tips: [
      'Replace placeholder values with your project details',
      'Specify your preferred technologies and frameworks',
      'Add any special requirements or constraints',
      'Include design preferences if applicable'
    ]
  },
  {
    title: '3. Generate and Review',
    description: 'Use the prompt in your IDE to generate code. Review the output and make any necessary adjustments to ensure it meets your needs.',
    icon: '⚡',
    tips: [
      'Generate code in smaller, manageable chunks',
      'Review the code for best practices and patterns',
      'Test the generated code thoroughly',
      'Make incremental improvements as needed'
    ]
  },
  {
    title: '4. Build and Iterate',
    description: 'Use multiple prompts to build different parts of your application. Combine and refine the generated code to create a complete solution.',
    icon: '🏗️',
    tips: [
      'Start with core features and expand gradually',
      'Combine prompts for complex functionality',
      'Maintain consistent coding style across generations',
      'Document any modifications for future reference'
    ]
  }
];

export default function HowToStartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <Card className="mb-8 p-12 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#A78BFA] via-[#818CF8] to-[#60A5FA] bg-clip-text text-transparent mb-4">
            How to Build Apps with Prompts
          </h1>
          <p className="text-lg text-white/70">
            Learn how to leverage our prompt repository to accelerate your development process and build better applications faster.
          </p>
        </div>
      </Card>

      {/* Steps */}
      <div className="space-y-6">
        {steps.map((step) => (
          <Card key={step.title} className="p-6 bg-white/[0.03] border border-white/10">
            <div className="flex items-start gap-6">
              <div className="text-4xl">{step.icon}</div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-3">{step.title}</h2>
                <p className="text-white/70 mb-4">{step.description}</p>
                <div className="bg-white/[0.03] rounded-lg p-4 border border-white/10">
                  <h3 className="text-sm font-medium text-white/90 mb-3">Pro Tips:</h3>
                  <ul className="space-y-2">
                    {step.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-white/70">
                        <span className="text-primary">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Getting Started */}
      <Card className="mt-8 p-6 bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-white/10">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/70 mb-6">
            Browse our collection of prompts and start building your next application faster.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/explore"
              className="inline-flex items-center px-6 py-3 text-base font-medium bg-primary hover:bg-primary-accent text-white rounded-lg transition-colors"
            >
              Browse Prompts
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
            <Link
              href="/submit"
              className="inline-flex items-center px-6 py-3 text-base font-medium bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10"
            >
              Submit a Prompt
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
