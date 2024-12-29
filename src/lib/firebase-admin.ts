import * as admin from 'firebase-admin';

// Check if all required environment variables are present
const requiredEnvVars = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
};

// Validate environment variables
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error: any) {
    console.error('Error initializing Firebase Admin:', error);
    throw new Error('Failed to initialize Firebase Admin: ' + error.message);
  }
}

export const auth = admin.auth();
export const db = admin.database();

// Function to get admin database instance
export const getAdminDB = () => {
  if (!admin.apps.length) {
    throw new Error('Firebase Admin not initialized');
  }
  return admin.database();
}; 