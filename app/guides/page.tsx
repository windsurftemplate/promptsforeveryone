'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export default function GuidesPage() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = {
    'getting-started': {
      title: 'Getting Started',
      content: (
        <>
          <h2 className="text-3xl font-bold text-white mb-6">Getting Started with AI Prompts</h2>
          <p className="text-white/80 mb-8">
            Learn the fundamentals of working with AI prompts and how to get the most out of them.
          </p>

          <div className="space-y-8">
            <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Understanding AI Prompts</h3>
              <p className="text-white/80 mb-4">
                AI prompts are instructions or queries that guide AI models to generate specific outputs.
                The quality of your prompt directly affects the quality of the response.
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80">
                <li>Clear and specific instructions yield better results</li>
                <li>Context helps AI understand your requirements</li>
                <li>Examples can guide the AI toward desired outputs</li>
                <li>Iterative refinement improves prompt effectiveness</li>
              </ul>
            </div>

            <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Basic Prompt Structure</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">1. Context Setting</h4>
                  <p className="text-white/80">Provide background information and requirements</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">2. Task Description</h4>
                  <p className="text-white/80">Clearly state what you want to achieve</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">3. Format Specification</h4>
                  <p className="text-white/80">Define how you want the output structured</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">4. Examples (Optional)</h4>
                  <p className="text-white/80">Provide examples of desired inputs and outputs</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    'writing-prompts': {
      title: 'Writing Effective Prompts',
      content: (
        <>
          <h2 className="text-3xl font-bold text-white mb-6">Writing Effective Prompts</h2>
          <p className="text-white/80 mb-8">
            Master the art of crafting prompts that consistently generate high-quality results.
          </p>

          <div className="space-y-8">
            <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Best Practices</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-2">Be Specific</h4>
                  <p className="text-white/80 text-sm">
                    Use clear, precise language and avoid ambiguity in your instructions.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Provide Context</h4>
                  <p className="text-white/80 text-sm">
                    Include relevant background information and requirements.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Set Constraints</h4>
                  <p className="text-white/80 text-sm">
                    Define boundaries and limitations for the expected output.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Use Examples</h4>
                  <p className="text-white/80 text-sm">
                    Demonstrate desired outcomes with concrete examples.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Common Mistakes to Avoid</h3>
              <ul className="list-disc list-inside space-y-4 text-white/80">
                <li>Being too vague or general in instructions</li>
                <li>Omitting important context or requirements</li>
                <li>Using ambiguous or unclear language</li>
                <li>Not specifying the desired format or structure</li>
                <li>Overcomplicating the prompt with unnecessary details</li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
    'advanced-techniques': {
      title: 'Advanced Techniques',
      content: (
        <>
          <h2 className="text-3xl font-bold text-white mb-6">Advanced Prompt Techniques</h2>
          <p className="text-white/80 mb-8">
            Take your prompt engineering skills to the next level with advanced strategies and techniques.
          </p>

          <div className="space-y-8">
            <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Chain of Thought Prompting</h3>
              <p className="text-white/80 mb-4">
                Guide the AI through a step-by-step reasoning process to arrive at better solutions.
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">1. Break Down Complex Tasks</h4>
                  <p className="text-white/80 text-sm">Split complex problems into smaller, manageable steps</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">2. Show Intermediate Steps</h4>
                  <p className="text-white/80 text-sm">Request explanations for each step of the process</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">3. Validate Results</h4>
                  <p className="text-white/80 text-sm">Ask for verification of the reasoning and outcomes</p>
                </div>
              </div>
            </div>

            <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Role-Based Prompting</h3>
              <p className="text-white/80 mb-4">
                Assign specific roles or personas to the AI to obtain specialized responses.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-2">Expert Roles</h4>
                  <p className="text-white/80 text-sm">
                    Frame prompts from the perspective of subject matter experts
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Multiple Perspectives</h4>
                  <p className="text-white/80 text-sm">
                    Get diverse viewpoints by switching between different roles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    'optimization': {
      title: 'Prompt Optimization',
      content: (
        <>
          <h2 className="text-3xl font-bold text-white mb-6">Optimizing Your Prompts</h2>
          <p className="text-white/80 mb-8">
            Learn how to refine and optimize your prompts for better results.
          </p>

          <div className="space-y-8">
            <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Iterative Refinement</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">1. Start Simple</h4>
                  <p className="text-white/80 text-sm">Begin with a basic version of your prompt</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">2. Analyze Results</h4>
                  <p className="text-white/80 text-sm">Evaluate the output quality and identify areas for improvement</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">3. Refine and Test</h4>
                  <p className="text-white/80 text-sm">Make incremental improvements and test the results</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">4. Document Changes</h4>
                  <p className="text-white/80 text-sm">Keep track of what works and what doesn't</p>
                </div>
              </div>
            </div>

            <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Testing Strategies</h3>
              <ul className="list-disc list-inside space-y-4 text-white/80">
                <li>Use different variations of the same prompt</li>
                <li>Test with edge cases and unusual scenarios</li>
                <li>Compare results across different AI models</li>
                <li>Gather feedback from other users</li>
                <li>Measure consistency and reliability</li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <div className="sticky top-24 space-y-2">
              {Object.entries(sections).map(([key, section]) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-between ${
                    activeSection === key
                      ? 'bg-[#00ffff]/10 text-[#00ffff]'
                      : 'text-white/60 hover:bg-[#00ffff]/5 hover:text-[#00ffff]'
                  }`}
                >
                  {section.title}
                  <ChevronRightIcon className={`w-4 h-4 transition-transform duration-200 ${
                    activeSection === key ? 'rotate-90' : ''
                  }`} />
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-black/50 backdrop-blur-xl border border-[#00ffff]/20 rounded-lg p-8">
              {sections[activeSection as keyof typeof sections].content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
