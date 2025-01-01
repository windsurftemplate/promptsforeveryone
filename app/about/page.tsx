'use client';

import Link from 'next/link';
import Card from '@/components/ui/Card';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        About Windsurf IDE
      </h1>
      
      <div className="space-y-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-text-muted">
            Windsurf IDE is revolutionizing the way developers interact with AI. Our mission is to create the most intuitive and powerful development environment that seamlessly integrates AI assistance into your workflow.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">The Team</h2>
          <p className="text-text-muted mb-4">
            We are a team of passionate developers, designers, and AI researchers working together to build the future of software development.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-surface rounded-lg">
              <h3 className="font-semibold mb-2">Engineering</h3>
              <p className="text-text-muted">Building robust and scalable solutions</p>
            </div>
            <div className="p-4 bg-surface rounded-lg">
              <h3 className="font-semibold mb-2">Design</h3>
              <p className="text-text-muted">Crafting beautiful user experiences</p>
            </div>
            <div className="p-4 bg-surface rounded-lg">
              <h3 className="font-semibold mb-2">AI Research</h3>
              <p className="text-text-muted">Pushing the boundaries of AI capabilities</p>
            </div>
            <div className="p-4 bg-surface rounded-lg">
              <h3 className="font-semibold mb-2">Product</h3>
              <p className="text-text-muted">Shaping the future of development</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Join Us</h2>
          <p className="text-text-muted mb-4">
            We're always looking for talented individuals to join our team. Check out our open positions or reach out to us directly.
          </p>
          <Link href="/careers" className="inline-block bg-primary-accent text-white px-4 py-2 rounded-lg hover:bg-primary-accent/90 transition-colors">
            View Open Positions
          </Link>
        </Card>
      </div>
    </div>
  );
}
