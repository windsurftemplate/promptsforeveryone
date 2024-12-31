'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDbNOQM9KjlTrIsHsLiQLGWfDilwyc4mh4",
  authDomain: "promptsforall-8068a.firebaseapp.com",
  projectId: "promptsforall-8068a",
  storageBucket: "promptsforall-8068a.appspot.com",
  messagingSenderId: "486259788940",
  appId: "1:486259788940:web:bad81b33a1c2abfdde7fa9",
  measurementId: "G-RH79PQ2B33",
  databaseURL: "https://promptsforall-8068a-default-rtdb.firebaseio.com"
};

// Initialize Firebase
let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Realtime Database and Auth
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };
