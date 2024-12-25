import Card from '@/components/ui/Card';

export default function DigitalOceanDeploymentGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Deploy to DigitalOcean</h1>
          <p className="text-gray-400 mb-8">Follow these steps to deploy your prompt application to DigitalOcean App Platform and set up Firebase authentication.</p>

          <div className="space-y-8">
            {/* DigitalOcean Setup */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. DigitalOcean Setup</h2>
              <div className="space-y-4">
                <div className="pl-4 border-l-2 border-blue-500">
                  <h3 className="font-medium mb-2">Create a DigitalOcean Account</h3>
                  <p className="text-gray-400">Sign up at digitalocean.com and create a new project.</p>
                </div>
                <div className="pl-4 border-l-2 border-blue-500">
                  <h3 className="font-medium mb-2">Create App</h3>
                  <p className="text-gray-400">Go to App Platform and click "Create App" → "Create App from Source Code".</p>
                </div>
              </div>
            </section>

            {/* Source Code */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Connect Repository</h2>
              <div className="space-y-4">
                <div className="pl-4 border-l-2 border-purple-500">
                  <h3 className="font-medium mb-2">GitHub Integration</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-400">
                    <li>Connect your GitHub account</li>
                    <li>Select your repository</li>
                    <li>Choose the branch to deploy</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* App Configuration */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Configure App Settings</h2>
              <div className="space-y-4">
                <div className="pl-4 border-l-2 border-green-500">
                  <h3 className="font-medium mb-2">Build & Run Settings</h3>
                  <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm text-gray-300">
{`Build Command: npm run build
Run Command: npm start
Environment: Node.js
Node.js Version: 18.x`}
                    </code>
                  </pre>
                </div>
                <div className="pl-4 border-l-2 border-green-500">
                  <h3 className="font-medium mb-2">Environment Variables</h3>
                  <p className="text-gray-400 mb-2">Add these in the Environment Variables section:</p>
                  <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm text-gray-300">
{`NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=`}
                    </code>
                  </pre>
                </div>
              </div>
            </section>

            {/* Firebase Setup */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Firebase Configuration</h2>
              <div className="pl-4 border-l-2 border-yellow-500">
                <h3 className="font-medium mb-2">Update Firebase Settings</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-400">
                  <li>Go to Firebase Console → Authentication → Settings</li>
                  <li>Add your DigitalOcean app URL to Authorized domains</li>
                  <li>Update database rules if needed</li>
                </ol>
              </div>
            </section>

            {/* Deployment */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Deploy & Monitor</h2>
              <div className="space-y-4">
                <div className="pl-4 border-l-2 border-red-500">
                  <h3 className="font-medium mb-2">Deploy Settings</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>Enable automatic deployments</li>
                    <li>Configure health checks</li>
                    <li>Set up alerts (optional)</li>
                    <li>Configure custom domain (optional)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Troubleshooting */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Troubleshooting</h2>
              <div className="pl-4 border-l-2 border-red-500">
                <h3 className="font-medium mb-2">Common Issues</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  <li>Check deployment logs for build errors</li>
                  <li>Verify environment variables are set correctly</li>
                  <li>Ensure Firebase domain authorization is complete</li>
                  <li>Monitor app metrics for performance issues</li>
                  <li>Check app component status in DigitalOcean dashboard</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </Card>
    </div>
  );
} 