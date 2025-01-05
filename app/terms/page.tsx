'use client';

import Card from '@/components/ui/Card';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#00ffff] via-[#0099ff] to-[#00ffff] bg-clip-text text-transparent">
        Terms of Service
      </h1>

      <div className="space-y-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
          <p className="text-white/80">
            By accessing and using PromptsForEveryone.com, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">2. Use License</h2>
          <div className="space-y-4">
            <p className="text-white/80">
              Permission is granted to use PromptsForEveryone.com for personal and commercial use subject to the following conditions:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80 pl-4">
              <li>You must not modify or copy the materials without explicit permission</li>
              <li>You must not use the materials in a way that suggests endorsement by PromptsForEveryone.com</li>
              <li>You must not redistribute the prompts without proper attribution</li>
              <li>You must not use the service for any illegal or unauthorized purpose</li>
              <li>You must not attempt to decompile or reverse engineer any software contained on PromptsForEveryone.com</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">3. Account Terms</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">3.1 Account Registration</h3>
              <p className="text-white/80">
                You must be 13 years or older to use this Service. You must provide accurate, complete, and current information for your account registration. You are responsible for maintaining the security of your account.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">3.2 Account Security</h3>
              <p className="text-white/80">
                You are responsible for safeguarding your password and for any activities or actions under your account. We recommend using a strong, unique password and enabling two-factor authentication when available.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">4. User Content</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">4.1 Prompt Submissions</h3>
              <p className="text-white/80">
                When you submit prompts to our platform, you retain your intellectual property rights but grant us a license to use, modify, and display the content on our platform. You are responsible for ensuring your submissions do not violate any third-party rights.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">4.2 Content Guidelines</h3>
              <p className="text-white/80">
                All submitted content must comply with our community guidelines. We reserve the right to remove any content that violates these guidelines or that we determine to be inappropriate.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">5. Premium Services</h2>
          <div className="space-y-4">
            <p className="text-white/80">
              Some features of PromptsForEveryone.com require a paid subscription. By subscribing to our premium services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80 pl-4">
              <li>You agree to pay all fees associated with your subscription plan</li>
              <li>Subscriptions will automatically renew unless cancelled</li>
              <li>You may cancel your subscription at any time</li>
              <li>Refunds are provided in accordance with our refund policy</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">6. Intellectual Property</h2>
          <p className="text-white/80">
            The Service and its original content (excluding user-submitted content), features, and functionality are owned by PromptsForEveryone.com and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">7. Termination</h2>
          <p className="text-white/80">
            We reserve the right to terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms of Service.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">8. Changes to Terms</h2>
          <p className="text-white/80">
            We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant changes. Your continued use of the Service after such modifications constitutes your acceptance of the new Terms.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">Contact Information</h2>
          <p className="text-white/80">
            If you have any questions about these Terms, please contact us at support@promptsforeveryone.com
          </p>
        </Card>
      </div>
    </div>
  );
}
