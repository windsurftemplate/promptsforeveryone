'use client';

import Card from '@/components/ui/Card';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        Terms of Service
      </h1>

      <div className="space-y-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-text-muted">
            By accessing and using Windsurf IDE, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <div className="space-y-4">
            <p className="text-text-muted">
              Permission is granted to temporarily download one copy of Windsurf IDE for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-muted pl-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software contained in Windsurf IDE</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">3. Account Terms</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">3.1 Account Registration</h3>
              <p className="text-text-muted">
                You must be 13 years or older to use this Service. You must provide accurate, complete, and current information for your account registration.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">3.2 Account Security</h3>
              <p className="text-text-muted">
                You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">4. Service Terms</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">4.1 API Usage</h3>
              <p className="text-text-muted">
                Use of our API is subject to rate limiting and fair use policies. Excessive use may result in temporary or permanent suspension of service.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">4.2 Service Modifications</h3>
              <p className="text-text-muted">
                We reserve the right to modify or discontinue, temporarily or permanently, the Service with or without notice.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
          <p className="text-text-muted mb-4">
            The Service and its original content, features, and functionality are owned by Windsurf IDE and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">6. Termination</h2>
          <p className="text-text-muted mb-4">
            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p className="text-text-muted">
            If you have any questions about these Terms, please contact us at legal@windsurf-ide.com
          </p>
        </Card>
      </div>
    </div>
  );
}
