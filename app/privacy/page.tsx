'use client';

import Card from '@/components/ui/Card';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        Privacy Policy
      </h1>

      <div className="space-y-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="text-text-muted">
            At Windsurf IDE, we take your privacy seriously. This privacy policy explains how we collect, use, and protect your personal information when you use our services.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Account Information</h3>
              <p className="text-text-muted">
                When you create an account, we collect your email address, name, and other profile information you choose to provide.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Usage Data</h3>
              <p className="text-text-muted">
                We collect information about how you use Windsurf IDE, including your interaction with features and services.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Technical Data</h3>
              <p className="text-text-muted">
                We collect technical information such as your IP address, browser type, and device information.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <ul className="space-y-3 text-text-muted">
            <li>• To provide and maintain our services</li>
            <li>• To improve and personalize your experience</li>
            <li>• To communicate with you about updates and changes</li>
            <li>• To ensure the security of our platform</li>
            <li>• To comply with legal obligations</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Data Protection</h2>
          <p className="text-text-muted mb-4">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
          <div className="bg-surface p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Security Measures</h3>
            <ul className="space-y-2 text-text-muted">
              <li>• Encryption of data in transit and at rest</li>
              <li>• Regular security assessments</li>
              <li>• Access controls and authentication</li>
              <li>• Continuous monitoring and logging</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <p className="text-text-muted mb-4">
            You have the right to:
          </p>
          <ul className="space-y-3 text-text-muted">
            <li>• Access your personal information</li>
            <li>• Correct inaccurate data</li>
            <li>• Request deletion of your data</li>
            <li>• Object to data processing</li>
            <li>• Data portability</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-text-muted">
            If you have any questions about our privacy policy or how we handle your data, please contact us at privacy@windsurf-ide.com
          </p>
        </Card>
      </div>
    </div>
  );
}
