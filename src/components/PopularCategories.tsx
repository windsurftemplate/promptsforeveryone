'use client';

import Link from 'next/link';

export const popularCategories = [
  {
    name: 'General Prompts',
    href: '/category/general',
    icon: '📝',
    description: 'General-purpose prompts for various development tasks'
  },
  {
    name: 'Frontend Design & Development',
    href: '/category/frontend',
    icon: '🎨',
    description: 'UI/UX design patterns and frontend best practices'
  },
  {
    name: 'Full-Stack Features',
    href: '/category/full-stack',
    icon: '🔄',
    description: 'End-to-end implementation of common features'
  },
  {
    name: 'API Integration & Development',
    href: '/category/api',
    icon: '🔌',
    description: 'RESTful APIs and third-party service integration'
  },
  {
    name: 'Authentication & Security',
    href: '/category/auth',
    icon: '🔒',
    description: 'User authentication and security best practices'
  },
  {
    name: 'Testing & Debugging',
    href: '/category/testing',
    icon: '🐛',
    description: 'Testing strategies and debugging techniques'
  },
  {
    name: 'DevOps & Deployment',
    href: '/category/devops',
    icon: '🚀',
    description: 'Deployment workflows and infrastructure management'
  },
  {
    name: 'Database & Storage',
    href: '/category/database',
    icon: '💾',
    description: 'Database design, queries, and storage solutions'
  },
  {
    name: 'Performance Optimization',
    href: '/category/performance',
    icon: '⚡',
    description: 'Code and application performance improvements'
  },
  {
    name: 'Mobile Development',
    href: '/category/mobile',
    icon: '📱',
    description: 'Mobile app development and responsive design'
  },
  {
    name: 'AI & Machine Learning',
    href: '/category/ai-ml',
    icon: '🤖',
    description: 'AI integration and machine learning implementations'
  },
  {
    name: 'Code Review & Quality',
    href: '/category/code-quality',
    icon: '✨',
    description: 'Code review tips and quality improvement practices'
  }
];

export default function PopularCategories() {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Popular Categories
          </h2>
          <p className="mt-4 text-xl text-white/70">
            Explore our most popular prompt categories
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {popularCategories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative bg-[#18181B] hover:bg-[#1F1F23] p-6 rounded-lg transition-all duration-300 ring-1 ring-white/[0.06] hover:ring-white/[0.1]"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{category.icon}</div>
                <h3 className="text-lg font-medium text-white/90 group-hover:text-[#818CF8] transition-colors duration-200">
                  {category.name}
                </h3>
              </div>
              <p className="mt-2 text-sm text-white/60">
                {category.description}
              </p>
              <div className="mt-4 flex items-center text-sm text-[#818CF8] group-hover:text-[#A78BFA]">
                <span className="group-hover:underline">Browse prompts</span>
                <svg
                  className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
