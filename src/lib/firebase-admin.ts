import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import { getAuth } from 'firebase-admin/auth';

// Function to format private key if it's a string from environment variable
function formatPrivateKey(key: string | undefined) {
  if (!key) return undefined;
  // If the key is already properly formatted, return it as is
  if (key.includes('-----BEGIN PRIVATE KEY-----')) return key;
  // Format the key string into a proper private key format
  return `-----BEGIN PRIVATE KEY-----\n${key.replace(/\\n/g, '\n')}\n-----END PRIVATE KEY-----`;
}

if (!getApps().length) {
  const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  
  if (!privateKey || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    throw new Error('Firebase Admin credentials are missing. Please check your environment variables.');
  }

  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
}

export const adminDb = getDatabase();
export const auth = getAuth();
export const db = adminDb; 