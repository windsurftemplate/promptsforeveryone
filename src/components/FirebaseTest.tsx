'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function FirebaseTest() {
  const [status, setStatus] = useState('Checking connection...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Test Firebase connection
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setStatus(`Connected! Logged in as: ${user.email}`);
        } else {
          setStatus('Connected! Not logged in');
        }
      }, (error) => {
        setError(`Auth Error: ${error.message}`);
      });

      return () => unsubscribe();
    } catch (error) {
      setError(`Firebase Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, []);

  return (
    <div className="p-4 m-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Firebase Connection Status</h2>
      <p className={`${error ? 'text-red-600' : 'text-green-600'}`}>
        {error || status}
      </p>
      <div className="mt-2 text-sm text-gray-600">
        <p>API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing'}</p>
        <p>Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✓ Set' : '✗ Missing'}</p>
        <p>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Missing'}</p>
      </div>
    </div>
  );
}
