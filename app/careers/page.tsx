'use client';

import Card from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const positions = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Full-time',
    description: 'Join our frontend team to build the next generation of developer tools with React and TypeScript.'
  },
  {
    id: 2,
    title: 'Machine Learning Engineer',
    department: 'AI Research',
    location: 'Remote',
    type: 'Full-time',
    description: 'Help develop and improve our AI models for code generation and analysis.'
  },
  {
    id: 3,
    title: 'Product Designer',
    department: 'Design',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Full-time',
    description: 'Create beautiful and intuitive interfaces for complex developer tools.'
  },
  {
    id: 4,
    title: 'Developer Advocate',
    department: 'Developer Relations',
    location: 'Remote',
    type: 'Full-time',
    description: 'Be the bridge between our users and product team, creating content and gathering feedback.'
  }
];

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        Join Our Team
      </h1>

      <div className="space-y-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Why Windsurf IDE?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400 text-xl">🚀</span>
              </div>
              <h3 className="font-semibold">Innovation First</h3>
              <p className="text-text-muted">Work on cutting-edge AI technology and shape the future of development.</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <span className="text-purple-400 text-xl">🌍</span>
              </div>
              <h3 className="font-semibold">Remote-First</h3>
              <p className="text-text-muted">Work from anywhere in the world with our distributed team.</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                <span className="text-pink-400 text-xl">💪</span>
              </div>
              <h3 className="font-semibold">Growth & Impact</h3>
              <p className="text-text-muted">Opportunities to learn, grow, and make a real impact on the industry.</p>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Open Positions</h2>
          {positions.map(position => (
            <Card key={position.id} className="p-6 hover:border-primary-accent/20 transition-colors cursor-pointer">
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{position.title}</h3>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-2 py-1 bg-surface rounded-full text-text-muted">
                      {position.department}
                    </span>
                    <span className="px-2 py-1 bg-surface rounded-full text-text-muted">
                      {position.location}
                    </span>
                    <span className="px-2 py-1 bg-surface rounded-full text-text-muted">
                      {position.type}
                    </span>
                  </div>
                  <p className="text-text-muted">{position.description}</p>
                </div>
                <Button className="md:flex-shrink-0">
                  Apply Now
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Don&apos;t see the right role?</h2>
          <p className="text-text-muted mb-6">
            We&apos;re always looking for talented people to join our team. Send us your resume and we&apos;ll keep you in mind for future positions.
          </p>
          <Button variant="ghost">
            Send Your Resume
          </Button>
        </Card>
      </div>
    </div>
  );
}
