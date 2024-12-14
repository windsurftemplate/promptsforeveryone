'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const categories = [
  {
    name: 'General Prompts',
    href: '/category/general',
    icon: '📝',
    description: 'Common prompts for everyday development tasks'
  },
  {
    name: 'Project Initialization & Setup',
    href: '/category/project-setup',
    icon: '🚀',
    description: 'Get your project off the ground quickly'
  },
  {
    name: 'Frontend Design & Development',
    href: '/category/frontend',
    icon: '🎨',
    description: 'Create beautiful and responsive user interfaces'
  },
  {
    name: 'Backend Development',
    href: '/category/backend',
    icon: '⚙️',
    description: 'Build robust server-side applications'
  },
  {
    name: 'Database Design & Integration',
    href: '/category/database',
    icon: '💾',
    description: 'Design and implement database solutions'
  },
  {
    name: 'Full-Stack Features',
    href: '/category/full-stack',
    icon: '🔄',
    description: 'End-to-end functionality and integrations'
  },
  {
    name: 'Styling & Theming',
    href: '/category/styling',
    icon: '🎯',
    description: 'Create consistent and beautiful designs'
  },
  {
    name: 'Responsive Design',
    href: '/category/responsive',
    icon: '📱',
    description: 'Build layouts that work on all devices'
  },
  {
    name: 'Forms & User Input',
    href: '/category/forms',
    icon: '📝',
    description: 'Handle user input and form validation'
  },
  {
    name: 'API Integration',
    href: '/category/api',
    icon: '🔌',
    description: 'Connect and integrate with external services'
  },
  {
    name: 'Animations & Interactivity',
    href: '/category/animations',
    icon: '✨',
    description: 'Add life to your applications'
  },
  {
    name: 'E-Commerce Features',
    href: '/category/ecommerce',
    icon: '🛍️',
    description: 'Build online shopping experiences'
  },
  {
    name: 'Authentication & Security',
    href: '/category/auth',
    icon: '🔒',
    description: 'Implement secure user authentication'
  },
  {
    name: 'Testing & Debugging',
    href: '/category/testing',
    icon: '🐛',
    description: 'Ensure quality and fix issues'
  },
  {
    name: 'Performance Optimization',
    href: '/category/performance',
    icon: '⚡',
    description: 'Speed up your applications'
  },
  {
    name: 'DevOps & Deployment',
    href: '/category/devops',
    icon: '🚢',
    description: 'Deploy and maintain your applications'
  },
  {
    name: 'Internationalization',
    href: '/category/i18n',
    icon: '🌍',
    description: 'Make your app accessible globally'
  },
  {
    name: 'Real-Time Features',
    href: '/category/realtime',
    icon: '🔥',
    description: 'Add real-time functionality'
  }
];

export default function Home() {
  const { user } = useAuth();
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);

  const titles = [
    'Find Your Perfect Prompt',
    'Boost Your Productivity',
    'Code Smarter, Not Harder',
    'Unlock AI Possibilities'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitleIndex((current) =>
        current === titles.length - 1 ? 0 : current + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center items-center space-y-6 mb-12">
        <h1 className="text-[3.33rem] md:text-[6rem] font-bold mb-6 bg-gradient-to-r from-[#A78BFA] via-[#818CF8] to-[#60A5FA] bg-clip-text text-transparent animate-fade-in">
          {titles[currentTitleIndex]}
        </h1>
        <p className="text-xl text-white/70">
          Community-curated prompts designed specifically for Windsurf IDE.
        </p>
        <Link
          href={user ? "/submit" : "/signup"}
          className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg transition-colors"
        >
          {user ? "Submit a Prompt" : "Sign Up to Submit"}
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
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="group p-6 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors border border-white/[0.06] hover:border-white/[0.1]"
          >
            <div className="flex items-start space-x-4">
              <span className="text-2xl">{category.icon}</span>
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-white/90">
                  {category.name}
                </h3>
                <p className="mt-1 text-sm text-white/60 group-hover:text-white/70">
                  {category.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white/90">About</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-white/60 hover:text-white/90 transition-colors">About Us</Link></li>
                <li><Link href="/blog" className="text-white/60 hover:text-white/90 transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="text-white/60 hover:text-white/90 transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white/90">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/docs" className="text-white/60 hover:text-white/90 transition-colors">Documentation</Link></li>
                <li><Link href="/guides" className="text-white/60 hover:text-white/90 transition-colors">Guides</Link></li>
                <li><Link href="/api" className="text-white/60 hover:text-white/90 transition-colors">API</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white/90">Community</h3>
              <ul className="space-y-2">
                <li><Link href="/discord" className="text-white/60 hover:text-white/90 transition-colors">Discord</Link></li>
                <li><Link href="/github" className="text-white/60 hover:text-white/90 transition-colors">GitHub</Link></li>
                <li><Link href="/twitter" className="text-white/60 hover:text-white/90 transition-colors">Twitter</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white/90">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-white/60 hover:text-white/90 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-white/60 hover:text-white/90 transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-white/60 hover:text-white/90 transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/[0.06]">
            <p className="text-center text-white/60">
              &copy; {new Date().getFullYear()} Windsurf IDE. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
