import Card from '@/components/ui/Card';

export default function NetlifyDeploymentGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Deploy to Netlify</h1>
          <p className="text-gray-400 mb-8">Follow these steps to deploy your prompt application to Netlify and set up Firebase authentication.</p>

          <div className="space-y-8">
            {/* Netlify Setup */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Netlify Setup</h2>
              <div className="space-y-4">
                <div className="pl-4 border-l-2 border-blue-500">
                  <h3 className="font-medium mb-2">Create a Netlify Account</h3>
                  <p className="text-gray-400">Sign up at netlify.com and connect your GitHub account.</p>
                </div>
                <div className="pl-4 border-l-2 border-blue-500">
                  <h3 className="font-medium mb-2">Import Project</h3>
                  <p className="text-gray-400">Click "Add new site" → "Import an existing project" and select your repository.</p>
                </div>
              </div>
            </section>

            {/* Build Settings */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Configure Build Settings</h2>
              <div className="space-y-4">
                <div className="pl-4 border-l-2 border-purple-500">
                  <h3 className="font-medium mb-2">Build Configuration</h3>
                  <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm text-gray-300">
{`Build Command: npm run build
Publish Directory: .next
Base Directory: /
Runtime: Node.js
Node Version: 18.x`}
                    </code>
                  </pre>
                </div>
                <div className="pl-4 border-l-2 border-purple-500">
                  <h3 className="font-medium mb-2">Environment Variables</h3>
                  <p className="text-gray-400 mb-2">Add these in Site Settings → Environment variables:</p>
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

            {/* Netlify Configuration */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Netlify Configuration</h2>
              <div className="space-y-4">
                <div className="pl-4 border-l-2 border-green-500">
                  <h3 className="font-medium mb-2">Create netlify.toml</h3>
                  <p className="text-gray-400 mb-2">Add this configuration file to your repository root:</p>
                  <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm text-gray-300">
{`[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`}
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
                  <li>Add your Netlify domain to Authorized domains</li>
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
                    <li>Configure branch deploys</li>
                    <li>Set up deploy notifications</li>
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
                  <li>Check deploy logs for build errors</li>
                  <li>Verify environment variables are set correctly</li>
                  <li>Ensure Firebase domain authorization is complete</li>
                  <li>Check Netlify Functions logs if using serverless functions</li>
                  <li>Verify Next.js plugin is properly configured</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </Card>
    </div>
  );
} 