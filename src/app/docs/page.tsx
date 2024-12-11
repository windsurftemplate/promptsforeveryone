'use client';

import Card from '@/components/ui/Card';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        Documentation
      </h1>

      <div className="space-y-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div className="p-4 bg-surface rounded-lg">
              <h3 className="font-semibold mb-2">Installation</h3>
              <p className="text-text-muted mb-4">Quick start guide to install and set up Windsurf IDE.</p>
              <Link href="/docs/installation" className="text-primary-accent hover:underline">Learn more →</Link>
            </div>
            <div className="p-4 bg-surface rounded-lg">
              <h3 className="font-semibold mb-2">Basic Usage</h3>
              <p className="text-text-muted mb-4">Learn the fundamentals of using Windsurf IDE.</p>
              <Link href="/docs/basics" className="text-primary-accent hover:underline">Learn more →</Link>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-surface rounded-lg">
              <h3 className="font-semibold mb-2">AI Assistant</h3>
              <p className="text-text-muted mb-4">Harness the power of AI in your development workflow.</p>
              <Link href="/docs/ai-assistant" className="text-primary-accent hover:underline">Learn more →</Link>
            </div>
            <div className="p-4 bg-surface rounded-lg">
              <h3 className="font-semibold mb-2">Smart Completion</h3>
              <p className="text-text-muted mb-4">Intelligent code suggestions and completions.</p>
              <Link href="/docs/completion" className="text-primary-accent hover:underline">Learn more →</Link>
            </div>
            <div className="p-4 bg-surface rounded-lg">
              <h3 className="font-semibold mb-2">Code Analysis</h3>
              <p className="text-text-muted mb-4">Advanced code analysis and refactoring tools.</p>
              <Link href="/docs/analysis" className="text-primary-accent hover:underline">Learn more →</Link>
            </div>
            <div className="p-4 bg-surface rounded-lg">
              <h3 className="font-semibold mb-2">Debugging</h3>
              <p className="text-text-muted mb-4">Powerful debugging capabilities and tools.</p>
              <Link href="/docs/debugging" className="text-primary-accent hover:underline">Learn more →</Link>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
          <p className="text-text-muted mb-4">
            Comprehensive API documentation for extending and customizing Windsurf IDE.
          </p>
          <Link href="/api" className="inline-block bg-primary-accent text-white px-4 py-2 rounded-lg hover:bg-primary-accent/90 transition-colors">
            View API Documentation
          </Link>
        </Card>
      </div>
    </div>
  );
}
