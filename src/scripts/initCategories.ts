import { ref, set } from 'firebase/database';
import { db } from '../lib/firebase';

const categories = [
  {
    id: 'frontend-development',
    name: 'Frontend Development',
    description: 'Build modern user interfaces and web applications',
    items: [
      { name: 'React Components', description: 'Build reusable UI components', icon: '⚛️' },
      { name: 'Styling & CSS', description: 'Create beautiful layouts and designs', icon: '🎨' },
      { name: 'Forms & Validation', description: 'Handle user input effectively', icon: '📝' },
      { name: 'State Management', description: 'Manage application state', icon: '🔄' },
      { name: 'Animations', description: 'Add smooth transitions and effects', icon: '✨' }
    ]
  },
  {
    id: 'backend-development',
    name: 'Backend Development',
    description: 'Create robust server-side applications',
    items: [
      { name: 'API Routes', description: 'Create RESTful and GraphQL endpoints', icon: '🛣️' },
      { name: 'Database Models', description: 'Design efficient data structures', icon: '💾' },
      { name: 'Authentication', description: 'Implement secure user auth', icon: '🔒' },
      { name: 'File Handling', description: 'Manage file uploads and storage', icon: '📁' },
      { name: 'Caching', description: 'Optimize performance with caching', icon: '⚡' }
    ]
  },
  {
    id: 'full-stack-features',
    name: 'Full Stack Features',
    description: 'Implement complete end-to-end functionality',
    items: [
      { name: 'User Management', description: 'Complete user system setup', icon: '👥' },
      { name: 'Payment Integration', description: 'Implement payment processing', icon: '💳' },
      { name: 'Real-time Features', description: 'Add WebSocket functionality', icon: '🔥' },
      { name: 'Search & Filters', description: 'Implement search functionality', icon: '🔍' },
      { name: 'Analytics', description: 'Track user behavior and metrics', icon: '📊' }
    ]
  },
  {
    id: 'devops-deployment',
    name: 'DevOps & Deployment',
    description: 'Deploy and maintain your applications',
    items: [
      { name: 'Docker Setup', description: 'Containerize your application', icon: '🐳' },
      { name: 'CI/CD Pipeline', description: 'Automate deployment workflow', icon: '🔄' },
      { name: 'Monitoring', description: 'Set up application monitoring', icon: '📡' },
      { name: 'Security', description: 'Implement security best practices', icon: '🛡️' },
      { name: 'Testing', description: 'Create comprehensive tests', icon: '🧪' }
    ]
  }
];

export async function initializeCategories() {
  try {
    const categoriesRef = ref(db, 'categories');
    await set(categoriesRef, categories);
    console.log('Categories initialized successfully');
  } catch (error) {
    console.error('Error initializing categories:', error);
  }
} 