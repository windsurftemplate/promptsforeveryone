'use client';

import { useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';

export default function TestPage() {
  useEffect(() => {
    // Test database connection
    const promptsRef = ref(db, 'prompts');
    onValue(promptsRef, (snapshot) => {
      console.log('Prompts data:', snapshot.val());
    });
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
          <h2 className="text-xl font-semibold mb-2">Firebase Connection Status</h2>
          <p className="text-text-muted">Check the console for database connection status</p>
        </div>
      </div>
    </div>
  );
}
