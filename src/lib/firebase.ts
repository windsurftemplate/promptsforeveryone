'use client';

import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDbNOQM9KjlTrIsHsLiQLGWfDilwyc4mh4",
  authDomain: "promptsforall-8068a.firebaseapp.com",
  projectId: "promptsforall-8068a",
  storageBucket: "promptsforall-8068a.firebasestorage.app",
  messagingSenderId: "486259788940",
  appId: "1:486259788940:web:bad81b33a1c2abfdde7fa9",
  measurementId: "G-RH79PQ2B33",
  databaseURL: "https://promptsforall-8068a-default-rtdb.firebaseio.com",
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);
const auth = getAuth(app);

export { app, db, auth };
