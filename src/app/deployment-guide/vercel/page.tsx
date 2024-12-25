import Card from '@/components/ui/Card';

export default function VercelDeploymentGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Deploy to Vercel</h1>
          <p className="text-gray-400 mb-8">Follow these steps to deploy your prompt application to Vercel and set up Firebase authentication.</p>

          <div className="space-y-8">
            {/* Vercel Setup */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Vercel Setup</h2>
              <div className="space-y-4">
                <div className="pl-4 border-l-2 border-blue-500">
                  <h3 className="font-medium mb-2">Create a Vercel Account</h3>
                  <p className="text-gray-400">Go to vercel.com and sign up using your GitHub account.</p>
                </div>
                <div className="pl-4 border-l-2 border-blue-500">
                  <h3 className="font-medium mb-2">Import Your Repository</h3>
                  <p className="text-gray-400">Click "Import Project" and select your GitHub repository.</p>
                </div>
              </div>
            </section>

            {/* Firebase Configuration */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Firebase Configuration</h2>
              <div className="space-y-4">
                <div className="pl-4 border-l-2 border-purple-500">
                  <h3 className="font-medium mb-2">Environment Variables</h3>
                  <p className="text-gray-400 mb-2">Add these environment variables in your Vercel project settings:</p>
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
                <div className="pl-4 border-l-2 border-purple-500">
                  <h3 className="font-medium mb-2">Firebase Console Setup</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-400">
                    <li>Go to Firebase Console</li>
                    <li>Select your project</li>
                    <li>Navigate to Authentication → Settings → Authorized domains</li>
                    <li>Add your Vercel deployment URL (e.g., your-app.vercel.app)</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* Database Rules */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Database Rules</h2>
              <div className="pl-4 border-l-2 border-green-500">
                <p className="text-gray-400 mb-2">Update your Realtime Database rules:</p>
                <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-gray-300">
{`{
  "rules": {
    "prompts": {
      ".indexOn": ["category", "userId", "visibility"],
      ".read": true,
      ".write": "auth != null"
    }
  }
}`}
                  </code>
                </pre>
              </div>
            </section>

            {/* Deployment */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Deploy</h2>
              <div className="space-y-4">
                <div className="pl-4 border-l-2 border-yellow-500">
                  <h3 className="font-medium mb-2">Automatic Deployments</h3>
                  <p className="text-gray-400">Vercel will automatically deploy when you push changes to your main branch.</p>
                </div>
                <div className="pl-4 border-l-2 border-yellow-500">
                  <h3 className="font-medium mb-2">Manual Deployment</h3>
                  <p className="text-gray-400">You can also trigger manual deployments from the Vercel dashboard.</p>
                </div>
              </div>
            </section>

            {/* Troubleshooting */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Troubleshooting</h2>
              <div className="pl-4 border-l-2 border-red-500">
                <h3 className="font-medium mb-2">Common Issues</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  <li>Verify all environment variables are correctly set in Vercel</li>
                  <li>Ensure your Firebase project's Authorized domains include your Vercel URL</li>
                  <li>Check Firebase Console for any authentication errors</li>
                  <li>Verify database rules are properly configured</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </Card>
    </div>
  );
} 