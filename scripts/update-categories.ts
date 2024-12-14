import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, update, DataSnapshot } from 'firebase/database';
import dotenv from 'dotenv';

dotenv.config();

interface Prompt {
  title: string;
  description: string;
  category: string;
  tags?: string[];
  userId: string;
  userName: string;
  createdAt: number;
  updatedAt: number;
  visibility: 'public' | 'private';
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function updateCategories() {
  try {
    const promptsRef = ref(db, 'prompts');
    const snapshot = await get(promptsRef);
    
    if (!snapshot.exists()) {
      console.log('No prompts found');
      return;
    }

    const updates: Record<string, string> = {};
    let count = 0;

    snapshot.forEach((child: DataSnapshot) => {
      const prompt = child.val() as Prompt;
      if (prompt.category === 'general') {
        updates[`/prompts/${child.key}/category`] = 'Project Initialization & Setup';
        count++;
      }
    });

    if (count > 0) {
      await update(ref(db), updates);
      console.log(`Updated ${count} prompts from 'general' to 'Project Initialization & Setup'`);
    } else {
      console.log('No prompts needed updating');
    }
  } catch (error) {
    console.error('Error updating categories:', error);
  }
}

updateCategories();
