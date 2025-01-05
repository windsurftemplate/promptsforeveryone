'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = {
    'getting-started': {
      title: 'Getting Started',
      content: (
        <>
          <h2 className="text-3xl font-bold text-white mb-6">Getting Started with PromptsForEveryone</h2>
          <p className="text-white/80 mb-6">
            Welcome to PromptsForEveryone! This guide will help you get started with our platform
            and make the most of our features.
          </p>
          
          <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Quick Start Guide</h3>
          <ol className="list-decimal list-inside space-y-4 text-white/80 mb-8">
            <li>Create an account or sign in with your existing credentials</li>
            <li>Explore our categories to find prompts that match your needs</li>
            <li>Save your favorite prompts for quick access</li>
            <li>Create and share your own prompts with the community</li>
          </ol>

          <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Key Features</h3>
          <ul className="list-disc list-inside space-y-4 text-white/80">
            <li>Extensive prompt library across various categories</li>
            <li>Personal dashboard to manage your prompts</li>
            <li>Community voting and rating system</li>
            <li>Advanced search and filtering options</li>
          </ul>
        </>
      ),
    },
    'using-prompts': {
      title: 'Using Prompts',
      content: (
        <>
          <h2 className="text-3xl font-bold text-white mb-6">Using Prompts Effectively</h2>
          <p className="text-white/80 mb-6">
            Learn how to make the most of our prompt library and create effective prompts
            that generate the best results.
          </p>

          <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Best Practices</h3>
          <ul className="list-disc list-inside space-y-4 text-white/80 mb-8">
            <li>Be specific and clear in your prompt descriptions</li>
            <li>Use appropriate tags for better discoverability</li>
            <li>Include examples when possible</li>
            <li>Test your prompts before sharing</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Advanced Techniques</h3>
          <ul className="list-disc list-inside space-y-4 text-white/80">
            <li>Chain prompts for complex tasks</li>
            <li>Use variables for dynamic content</li>
            <li>Implement conditional logic</li>
            <li>Optimize prompts for different AI models</li>
          </ul>
        </>
      ),
    },
    'categories': {
      title: 'Categories',
      content: (
        <>
          <h2 className="text-3xl font-bold text-white mb-6">Prompt Categories</h2>
          <p className="text-white/80 mb-6">
            Explore our diverse range of prompt categories designed to help you find
            exactly what you need.
          </p>

          <div className="space-y-8">
            {/* Development & Programming */}
            <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Development & Programming</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Code Generation</h4>
                  <p className="text-white/80 text-sm">Generate code snippets and boilerplate code</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Debugging</h4>
                  <p className="text-white/80 text-sm">Debug code and find solutions to common errors</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Testing</h4>
                  <p className="text-white/80 text-sm">Generate test cases and testing scenarios</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Code Refactoring</h4>
                  <p className="text-white/80 text-sm">Improve and optimize existing code</p>
                </div>
              </div>
            </div>

            {/* Data & Analytics */}
            <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Data & Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Data Analysis</h4>
                  <p className="text-white/80 text-sm">Analyze and interpret data sets</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Data Visualization</h4>
                  <p className="text-white/80 text-sm">Create visual representations of data</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">SQL Queries</h4>
                  <p className="text-white/80 text-sm">Generate and optimize SQL queries</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Data Cleaning</h4>
                  <p className="text-white/80 text-sm">Clean and preprocess data</p>
                </div>
              </div>
            </div>

            {/* AI & Machine Learning */}
            <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-4">AI & Machine Learning</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">ML Models</h4>
                  <p className="text-white/80 text-sm">Design and train machine learning models</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Natural Language Processing</h4>
                  <p className="text-white/80 text-sm">Process and analyze text data</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Computer Vision</h4>
                  <p className="text-white/80 text-sm">Image and video processing tasks</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Reinforcement Learning</h4>
                  <p className="text-white/80 text-sm">Design RL agents and environments</p>
                </div>
              </div>
            </div>

            {/* Web Development */}
            <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Web Development</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Frontend Development</h4>
                  <p className="text-white/80 text-sm">Create user interfaces and web components</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Backend Development</h4>
                  <p className="text-white/80 text-sm">Build server-side applications</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Web Security</h4>
                  <p className="text-white/80 text-sm">Implement security best practices</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Web Performance</h4>
                  <p className="text-white/80 text-sm">Optimize web application performance</p>
                </div>
              </div>
            </div>

            {/* DevOps & Infrastructure */}
            <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-4">DevOps & Infrastructure</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">DevOps</h4>
                  <p className="text-white/80 text-sm">Automate development operations</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Cloud Computing</h4>
                  <p className="text-white/80 text-sm">Deploy and manage cloud services</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Containerization</h4>
                  <p className="text-white/80 text-sm">Work with Docker and containers</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">CI/CD</h4>
                  <p className="text-white/80 text-sm">Set up continuous integration/deployment</p>
                </div>
              </div>
            </div>

            {/* Mobile Development */}
            <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Mobile Development</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">iOS Development</h4>
                  <p className="text-white/80 text-sm">Build iOS applications</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Android Development</h4>
                  <p className="text-white/80 text-sm">Create Android applications</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Cross-Platform</h4>
                  <p className="text-white/80 text-sm">Develop cross-platform mobile apps</p>
                </div>
              </div>
            </div>

            {/* Design & UX */}
            <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Design & UX</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">UI Design</h4>
                  <p className="text-white/80 text-sm">Design user interfaces</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">UX Research</h4>
                  <p className="text-white/80 text-sm">Conduct user experience research</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Accessibility</h4>
                  <p className="text-white/80 text-sm">Implement accessible design</p>
                </div>
              </div>
            </div>

            {/* Content & Documentation */}
            <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Content & Documentation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Technical Writing</h4>
                  <p className="text-white/80 text-sm">Create technical documentation</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">API Documentation</h4>
                  <p className="text-white/80 text-sm">Document APIs and endpoints</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Code Comments</h4>
                  <p className="text-white/80 text-sm">Write clear code documentation</p>
                </div>
              </div>
            </div>

            {/* Project Management */}
            <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Project Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Agile Management</h4>
                  <p className="text-white/80 text-sm">Manage agile development processes</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Scrum</h4>
                  <p className="text-white/80 text-sm">Implement Scrum methodology</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Project Planning</h4>
                  <p className="text-white/80 text-sm">Plan and organize projects</p>
                </div>
              </div>
            </div>

            {/* Emerging Technologies */}
            <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#00ffff] mb-4">Emerging Technologies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Blockchain</h4>
                  <p className="text-white/80 text-sm">Develop blockchain applications</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">AR/VR</h4>
                  <p className="text-white/80 text-sm">Create augmented and virtual reality</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Internet of Things</h4>
                  <p className="text-white/80 text-sm">Build IoT applications</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Edge Computing</h4>
                  <p className="text-white/80 text-sm">Develop edge computing solutions</p>
                </div>
              </div>
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
