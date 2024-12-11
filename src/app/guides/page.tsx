'use client';

import Card from '@/components/ui/Card';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const guides = [
  {
    id: 1,
    title: 'Getting Started with Windsurf IDE',
    description: 'Learn the basics of setting up and using Windsurf IDE for your development workflow.',
    category: 'Basics',
    difficulty: 'Beginner',
    duration: '15 min'
  },
  {
    id: 2,
    title: 'AI Assistant Best Practices',
    description: 'Master the art of writing effective prompts and utilizing AI assistance in your coding.',
    category: 'AI Features',
    difficulty: 'Intermediate',
    duration: '20 min'
  },
  {
    id: 3,
    title: 'Advanced Code Generation',
    description: 'Discover advanced techniques for generating complex code patterns and structures.',
    category: 'Advanced',
    difficulty: 'Advanced',
    duration: '30 min'
  },
  {
    id: 4,
    title: 'Customizing Your Environment',
    description: 'Learn how to customize Windsurf IDE to match your preferences and workflow.',
    category: 'Configuration',
    difficulty: 'Intermediate',
    duration: '25 min'
  }
];

export default function GuidesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        Guides & Tutorials
      </h1>

      <div className="space-y-8">
        {/* Search and Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search guides..."
                className="w-full px-4 py-2 bg-surface rounded-lg border border-surface-light focus:outline-none focus:border-primary-accent"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 bg-surface rounded-lg border border-surface-light focus:outline-none focus:border-primary-accent">
                <option value="">All Categories</option>
                <option value="basics">Basics</option>
                <option value="ai">AI Features</option>
                <option value="advanced">Advanced</option>
              </select>
              <select className="px-4 py-2 bg-surface rounded-lg border border-surface-light focus:outline-none focus:border-primary-accent">
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Featured Guide */}
        <Card className="p-6 border-2 border-primary-accent/20">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center space-x-2">
                <span className="bg-primary-accent/20 text-primary-accent px-2 py-1 rounded text-sm">Featured</span>
                <span className="text-text-muted">•</span>
                <span className="text-text-muted text-sm">15 min read</span>
              </div>
              <h2 className="text-2xl font-bold">Getting Started with Windsurf IDE</h2>
              <p className="text-text-muted">
                A comprehensive guide to help you get started with Windsurf IDE. Learn about the core features
                and how to set up your development environment for maximum productivity.
              </p>
              <Button>Start Learning</Button>
            </div>
            <div className="w-full md:w-64 h-48 bg-surface rounded-lg"></div>
          </div>
        </Card>

        {/* Guide Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.slice(1).map(guide => (
            <Card key={guide.id} className="p-6 hover:border-primary-accent/20 transition-colors">
              <Link href={`/guides/${guide.id}`} className="space-y-4 block">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="bg-surface px-2 py-1 rounded">{guide.category}</span>
                  <span className="text-text-muted">•</span>
                  <span className="text-text-muted">{guide.duration}</span>
                </div>
                <h3 className="text-xl font-bold hover:text-primary-accent transition-colors">
                  {guide.title}
                </h3>
                <p className="text-text-muted">
                  {guide.description}
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <span className={`
                    px-2 py-1 rounded
                    ${guide.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                      guide.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'}
                  `}>
                    {guide.difficulty}
                  </span>
                </div>
              </Link>
            </Card>
          ))}
        </div>

        {/* Newsletter */}
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Stay Updated</h2>
          <p className="text-text-muted mb-6">
            Subscribe to our newsletter to receive new guides and tutorials directly in your inbox.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-surface rounded-lg border border-surface-light focus:outline-none focus:border-primary-accent"
            />
            <Button>Subscribe</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
