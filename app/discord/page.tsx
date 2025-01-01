'use client';

import Card from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function DiscordPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        Join Our Discord Community
      </h1>

      <div className="space-y-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Connect with Developers</h2>
          <p className="text-text-muted mb-6">
            Join our vibrant community of developers, share your experiences, and get help from fellow Windsurf IDE users.
          </p>
          <Button size="lg" className="w-full md:w-auto">
            Join Discord Server
          </Button>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Community Channels</h2>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <span className="text-green-400">#</span>
                <div>
                  <p className="font-medium">general</p>
                  <p className="text-sm text-text-muted">General discussion and chat</p>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-blue-400">#</span>
                <div>
                  <p className="font-medium">help</p>
                  <p className="text-sm text-text-muted">Get help with Windsurf IDE</p>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-purple-400">#</span>
                <div>
                  <p className="font-medium">showcase</p>
                  <p className="text-sm text-text-muted">Share your projects</p>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-yellow-400">#</span>
                <div>
                  <p className="font-medium">announcements</p>
                  <p className="text-sm text-text-muted">Latest updates and news</p>
                </div>
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Community Benefits</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <p className="text-text-muted">Direct access to Windsurf IDE team members</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 mt-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                </div>
                <p className="text-text-muted">Early access to new features and updates</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 mt-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                </div>
                <p className="text-text-muted">Share and discover community-created prompts</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 mt-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                </div>
                <p className="text-text-muted">Participate in community events and challenges</p>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
