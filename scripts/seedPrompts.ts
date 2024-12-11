import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push } from 'firebase/database';
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const samplePrompts = [
  {
    title: "Code Review Best Practices",
    description: "A comprehensive guide for conducting effective code reviews that improve code quality and team collaboration.",
    content: `Here's how to conduct an effective code review:
1. Review the context and requirements first
2. Look for potential security vulnerabilities
3. Check for code readability and maintainability
4. Verify proper error handling
5. Ensure adequate test coverage
6. Be constructive and specific in feedback
7. Use a checklist to maintain consistency`,
    category: "Development",
    tags: ["code-review", "best-practices", "collaboration"],
    userId: "system",
    userName: "System",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,
    visibility: "public",
    isPublished: true
  },
  {
    title: "Git Workflow Guide",
    description: "Essential Git workflow patterns and best practices for team collaboration.",
    content: `# Git Workflow Best Practices
1. Create feature branches from main
2. Use conventional commit messages
3. Keep commits atomic and focused
4. Rebase feature branches regularly
5. Squash commits before merging
6. Delete branches after merging
7. Use meaningful branch names`,
    category: "Version Control",
    tags: ["git", "workflow", "version-control"],
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
    description: "Best practices for designing RESTful APIs that are scalable, maintainable, and developer-friendly.",
    content: `# RESTful API Design Guidelines
1. Use proper HTTP methods
2. Implement versioning
3. Use meaningful resource names
4. Include proper error handling
5. Implement rate limiting
6. Document thoroughly
7. Use proper status codes
8. Keep endpoints consistent`,
    category: "API",
    tags: ["api-design", "rest", "backend"],
    userId: "system",
    userName: "System",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,
    visibility: "public",
    isPublished: true
  },
  {
    title: "React Performance Optimization",
    description: "Tips and techniques for optimizing React applications for better performance.",
    content: `# React Performance Tips
1. Use React.memo for component memoization
2. Implement useMemo and useCallback hooks
3. Lazy load components and routes
4. Optimize images and assets
5. Implement proper key props
6. Avoid inline function definitions
7. Use production builds
8. Implement code splitting`,
    category: "Frontend",
    tags: ["react", "performance", "optimization"],
    userId: "system",
    userName: "System",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,
    visibility: "public",
    isPublished: true
  },
  {
    title: "TypeScript Best Practices",
    description: "Essential TypeScript patterns and practices for building type-safe applications.",
    content: `# TypeScript Best Practices
1. Use strict mode
2. Leverage type inference
3. Use interfaces for object shapes
4. Implement proper error handling
5. Use discriminated unions
6. Avoid any type
7. Use generics when appropriate
8. Document with TSDoc`,
    category: "TypeScript",
    tags: ["typescript", "type-safety", "javascript"],
    userId: "system",
    userName: "System",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,
    visibility: "public",
    isPublished: true
  }
];

async function seedPrompts() {
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    
    console.log('Adding prompts to Firebase Realtime Database...');
    
    const results = [];
    const promptsRef = ref(db, 'prompts');

    for (const prompt of samplePrompts) {
      try {
        // Create a new reference with an auto-generated key
        const newPromptRef = push(promptsRef);
        
        // Set the data at the new reference
        await set(newPromptRef, prompt);
        
        results.push({
          id: newPromptRef.key,
          title: prompt.title
        });
        
        console.log(`Added prompt: ${prompt.title} (${newPromptRef.key})`);
      } catch (error) {
        console.error(`Error adding prompt ${prompt.title}:`, error);
      }
    }
    
    console.log('\nResults:', results);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding prompts:', error);
    process.exit(1);
  }
}

// Run the seeding
seedPrompts();
