import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-dark via-primary to-surface p-8 md:p-12">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text">
            Discover Windsurf IDE Prompts
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mb-8">
            Enhance your development workflow with community-curated prompts designed specifically for Windsurf IDE&apos;s AI assistant.
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
            <Card key={category.name} className="group cursor-pointer">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-accent transition-colors">
                  {category.name}
                </h3>
                <p className="text-text-muted">{category.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Prompts */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Prompts</h2>
          <Link href="/prompts">
            <Button variant="ghost">View All</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredPrompts.map((prompt) => (
            <Card key={prompt.title} className="group cursor-pointer">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-primary-accent transition-colors">
                      {prompt.title}
                    </h3>
                    <p className="text-text-muted text-sm">{prompt.author}</p>
                  </div>
                  <Button variant="ghost" size="sm">Copy</Button>
                </div>
                <p className="text-text-muted mb-4">{prompt.description}</p>
                <div className="flex gap-2">
                  {prompt.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 text-xs rounded-full bg-surface-light text-text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

const categories = [
  {
    name: 'Code Review',
    description: 'Prompts for analyzing and improving code quality'
  },
  {
    name: 'Testing',
    description: 'Generate test cases and testing strategies'
  },
  {
    name: 'Refactoring',
    description: 'Transform and improve existing code'
  },
  {
    name: 'Documentation',
    description: 'Create and enhance code documentation'
  },
  {
    name: 'Debugging',
    description: 'Find and fix bugs in your code'
  },
  {
    name: 'Performance',
    description: 'Optimize code for better performance'
  }
];

const featuredPrompts = [
  {
    title: 'Comprehensive Code Review',
    author: 'Sarah Chen',
    description: 'Analyze code for best practices, potential bugs, and performance improvements',
    tags: ['review', 'best-practices', 'performance']
  },
  {
    title: 'Generate Unit Tests',
    author: 'Michael Rodriguez',
    description: 'Create comprehensive unit tests with edge cases and mocks',
    tags: ['testing', 'unit-tests', 'automation']
  },
  {
    title: 'Refactor for Clean Code',
    author: 'Alex Kim',
    description: 'Transform code to follow clean code principles and improve readability',
    tags: ['refactoring', 'clean-code', 'maintainability']
  },
  {
    title: 'API Documentation',
    author: 'Emma Wilson',
    description: 'Generate detailed API documentation with examples and edge cases',
    tags: ['documentation', 'api', 'examples']
  }
];
