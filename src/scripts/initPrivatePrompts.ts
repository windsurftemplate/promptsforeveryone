import { ref, set } from 'firebase/database';
import { db } from '@/lib/firebase';

export const defaultPrivatePrompts = [
  {
    name: "Personal Assistant",
    items: [
      {
        id: "pa1",
        name: "Daily Planner",
        description: "Create a detailed daily schedule and task list",
        icon: "📅"
      },
      {
        id: "pa2",
        name: "Meeting Notes",
        description: "Structure and summarize meeting notes",
        icon: "📝"
      }
    ]
  },
  {
    name: "Professional Writing",
    items: [
      {
        id: "pw1",
        name: "Email Templates",
        description: "Professional email templates for various situations",
        icon: "✉️"
      },
      {
        id: "pw2",
        name: "Report Writer",
        description: "Structure and format professional reports",
        icon: "📊"
      }
    ]
  },
  {
    name: "Creative Writing",
    items: [
      {
        id: "cw1",
        name: "Story Ideas",
        description: "Generate creative story concepts and outlines",
        icon: "📚"
      },
      {
        id: "cw2",
        name: "Character Development",
        description: "Create detailed character profiles and backgrounds",
        icon: "👤"
      }
    ]
  }
];

export async function initializePrivatePrompts(userId: string) {
  try {
    const userCategoriesRef = ref(db, `users/${userId}/categories`);
    
    // Add each default category
    for (const category of defaultPrivatePrompts) {
      const categoryId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      await set(ref(db, `users/${userId}/categories/${categoryId}`), {
        name: category.name,
        items: category.items,
        createdAt: new Date().toISOString(),
        isPrivate: true
      });
    }
    
    console.log('Default private prompts initialized successfully');
  } catch (error) {
    console.error('Error initializing private prompts:', error);
  }
} 