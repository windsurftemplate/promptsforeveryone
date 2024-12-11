'use client';

import { NextResponse } from 'next/server';
import { ref, set } from 'firebase/database';
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

// Sample prompts data
const samplePrompts = [
  {
    title: "Modern Frontend Architecture",
    description: "Guide for designing scalable frontend architectures",
    content: "Frontend architecture best practices guide",
    category: "Development",
    tags: ["frontend", "architecture"],
    userId: "system",
    userName: "System",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,
    visibility: "public",
    isPublished: true
  },
  {
    title: "API Design Guidelines",
    description: "Best practices for API design",
    content: "API design principles and patterns",
    category: "Development",
    tags: ["api", "backend"],
    userId: "system",
    userName: "System",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,
    visibility: "public",
    isPublished: true
  }
];

export async function POST() {
  try {
    // Reference to the prompts node in the database
    const promptsRef = ref(db, 'prompts');

    // Set all sample prompts at once
    await set(promptsRef, samplePrompts);

    return NextResponse.json({ 
      success: true, 
      message: 'Sample prompts successfully seeded to the database' 
    });
  } catch (error) {
    console.error('Error seeding prompts:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to seed sample prompts' 
    }, { status: 500 });
  }
}
