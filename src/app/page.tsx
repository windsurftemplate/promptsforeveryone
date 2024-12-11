'use client';

import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useState, useEffect } from 'react';

export default function Home() {
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);

  const titles = [
    "Discover Windsurf IDE Prompts",
    "Enhance Your Development Flow",
    "Power Up Your Coding",
    "Unlock AI's Full Potential"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-dark via-primary to-surface p-8 md:p-12">
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in">
            {titles[currentTitleIndex]}
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mb-8">
            Community-curated prompts designed specifically for Windsurf IDE.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/get-started">
              <Button size="lg">
                Get Started
              </Button>
            </Link>
            <Link href="/prompts">
              <Button variant="ghost" size="lg">
                Browse Prompts
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,64,60,0.2)_25%,rgba(68,64,60,0.2)_75%,transparent_75%,transparent)] bg-[length:16px_16px]" />
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Popular Categories</h2>
          <Link href="/explore">
            <Button variant="ghost">View All</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={`/category/${encodeURIComponent(category.name)}`}>
              <Card className="group cursor-pointer">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-accent transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-text-muted">{category.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t border-surface-light">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">About</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-text-muted hover:text-text transition-colors">About Us</Link></li>
                <li><Link href="/blog" className="text-text-muted hover:text-text transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="text-text-muted hover:text-text transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/docs" className="text-text-muted hover:text-text transition-colors">Documentation</Link></li>
                <li><Link href="/guides" className="text-text-muted hover:text-text transition-colors">Guides</Link></li>
                <li><Link href="/api" className="text-text-muted hover:text-text transition-colors">API</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Community</h3>
              <ul className="space-y-2">
                <li><Link href="/discord" className="text-text-muted hover:text-text transition-colors">Discord</Link></li>
                <li><Link href="/github" className="text-text-muted hover:text-text transition-colors">GitHub</Link></li>
                <li><Link href="/twitter" className="text-text-muted hover:text-text transition-colors">Twitter</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-text-muted hover:text-text transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-text-muted hover:text-text transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-text-muted hover:text-text transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-surface-light">
            <p className="text-center text-text-muted">
              &copy; {new Date().getFullYear()} Windsurf IDE. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const categories = [
  {
    name: 'ChatGPT',
    description: 'General purpose prompts for ChatGPT interactions'
  },
  {
    name: 'Code Assistant',
    description: 'Prompts for code generation, review, and debugging'
  },
  {
    name: 'Writing',
    description: 'Content creation and writing assistance prompts'
  },
  {
    name: 'Translation',
    description: 'Language translation and localization prompts'
  },
  {
    name: 'Data Analysis',
    description: 'Prompts for analyzing and visualizing data'
  },
  {
    name: 'Image Generation',
    description: 'Prompts for generating and editing images'
  },
  {
    name: 'Research',
    description: 'Academic and general research assistance'
  },
  {
    name: 'Education',
    description: 'Teaching and learning enhancement prompts'
  },
  {
    name: 'Business',
    description: 'Business strategy and communication prompts'
  }
];
