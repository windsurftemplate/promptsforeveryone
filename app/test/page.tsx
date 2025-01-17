'use client';

import { useEffect } from 'react';

export default function TestPage() {
  useEffect(() => {
    // Test API connection
    const testConnection = async () => {
      try {
        const response = await fetch('/api/prompts');
        if (response.ok) {
          const data = await response.json();
          console.log('API connection successful:', data);
        }
      } catch (error) {
        console.error('API connection error:', error);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-primary p-8">
      <h1 className="text-2xl font-bold mb-4">Extension Test Page</h1>
      <div className="space-y-4">
        <div className="p-4 bg-surface rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Test Prompt 1</h2>
          <p className="text-text-muted">Click the extension icon to copy this prompt!</p>
        </div>
        <div className="p-4 bg-surface rounded-lg">
          <h2 className="text-xl font-semibold mb-2">API Connection Status</h2>
          <p className="text-text-muted">Check the console for API connection status</p>
        </div>
      </div>
    </div>
  );
}
