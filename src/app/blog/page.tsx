'use client';

import Card from '@/components/ui/Card';
import Link from 'next/link';

const blogPosts = [
  {
    id: 1,
    title: 'Introducing Windsurf IDE 2.0',
    excerpt: 'A new era of AI-powered development with enhanced features and improved performance.',
    author: 'Sarah Chen',
    date: 'Dec 10, 2023',
    category: 'Product Updates',
    readTime: '5 min read'
  },
  {
    id: 2,
    title: 'Best Practices for AI Prompts',
    excerpt: 'Learn how to write effective prompts that get the most out of your AI assistant.',
    author: 'Michael Rodriguez',
    date: 'Dec 8, 2023',
    category: 'Tutorials',
    readTime: '7 min read'
  },
  {
    id: 3,
    title: 'The Future of AI in Software Development',
    excerpt: 'Exploring how AI is reshaping the landscape of software development.',
    author: 'Dr. Alex Kumar',
    date: 'Dec 5, 2023',
    category: 'Industry Insights',
    readTime: '10 min read'
  }
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        Blog
      </h1>

      <div className="space-y-8">
        {/* Featured Post */}
        <Card className="p-6 border-2 border-primary-accent/20">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-text-muted">
              <span className="bg-primary-accent/20 text-primary-accent px-2 py-1 rounded">Featured</span>
              <span>•</span>
              <span>Product Updates</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
            <h2 className="text-2xl font-bold hover:text-primary-accent transition-colors">
              <Link href="/blog/introducing-windsurf-2">
                Introducing Windsurf IDE 2.0
              </Link>
            </h2>
            <p className="text-text-muted">
              A new era of AI-powered development with enhanced features and improved performance.
              Discover how our latest update revolutionizes your coding workflow.
            </p>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-surface-light"></div>
              <div>
                <p className="font-medium">Sarah Chen</p>
                <p className="text-sm text-text-muted">Dec 10, 2023</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.slice(1).map(post => (
            <Card key={post.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-text-muted">
                  <span>{post.category}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-xl font-bold hover:text-primary-accent transition-colors">
                  <Link href={`/blog/${post.id}`}>
                    {post.title}
                  </Link>
                </h2>
                <p className="text-text-muted">
                  {post.excerpt}
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-surface-light"></div>
                  <div>
                    <p className="font-medium">{post.author}</p>
                    <p className="text-sm text-text-muted">{post.date}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Categories */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-surface rounded-full text-sm text-text-muted hover:bg-surface-light cursor-pointer transition-colors">
              Product Updates
            </span>
            <span className="px-3 py-1 bg-surface rounded-full text-sm text-text-muted hover:bg-surface-light cursor-pointer transition-colors">
              Tutorials
            </span>
            <span className="px-3 py-1 bg-surface rounded-full text-sm text-text-muted hover:bg-surface-light cursor-pointer transition-colors">
              Industry Insights
            </span>
            <span className="px-3 py-1 bg-surface rounded-full text-sm text-text-muted hover:bg-surface-light cursor-pointer transition-colors">
              Case Studies
            </span>
            <span className="px-3 py-1 bg-surface rounded-full text-sm text-text-muted hover:bg-surface-light cursor-pointer transition-colors">
              Community
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
