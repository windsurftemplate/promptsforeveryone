import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import dotenv from 'dotenv';

dotenv.config();

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

const categories = [
  {
    id: 'project-setup',
    name: 'Project Initialization & Setup',
    description: 'Templates and guides for starting new projects, setting up development environments, and configuring tools.',
    icon: '🚀'
  },
  {
    id: 'frontend',
    name: 'Frontend Design & Development',
    description: 'UI/UX design patterns, component architecture, and frontend best practices.',
    icon: '🎨'
  },
  {
    id: 'backend',
    name: 'Backend Development',
    description: 'Server-side architecture, API design, and backend system implementation.',
    icon: '⚙️'
  },
  {
    id: 'database',
    name: 'Database Design & Integration',
    description: 'Database schemas, queries, and data modeling best practices.',
    icon: '💾'
  },
  {
    id: 'full-stack',
    name: 'Full-Stack Features',
    description: 'End-to-end implementation of features spanning frontend and backend.',
    icon: '🔄'
  },
  {
    id: 'styling',
    name: 'Styling & Theming',
    description: 'CSS frameworks, design systems, and theming solutions.',
    icon: '🎯'
  },
  {
    id: 'responsive',
    name: 'Responsive Design',
    description: 'Mobile-first design and responsive layout implementations.',
    icon: '📱'
  },
  {
    id: 'forms',
    name: 'Forms & User Input Handling',
    description: 'Form validation, state management, and user input processing.',
    icon: '📝'
  },
  {
    id: 'api',
    name: 'API Integration & Development',
    description: 'RESTful APIs, GraphQL, and third-party service integration.',
    icon: '🔌'
  },
  {
    id: 'animations',
    name: 'Animations & Interactivity',
    description: 'UI animations, transitions, and interactive features.',
    icon: '✨'
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce Features',
    description: 'Shopping carts, payment processing, and product management.',
    icon: '🛍️'
  },
  {
    id: 'auth',
    name: 'Authentication & Security',
    description: 'User authentication, authorization, and security best practices.',
    icon: '🔒'
  },
  {
    id: 'testing',
    name: 'Testing & Debugging',
    description: 'Unit testing, integration testing, and debugging strategies.',
    icon: '🐛'
  },
  {
    id: 'performance',
    name: 'Performance Optimization',
    description: 'Code optimization, caching, and performance monitoring.',
    icon: '⚡'
  },
  {
    id: 'devops',
    name: 'DevOps & Deployment',
    description: 'CI/CD pipelines, deployment strategies, and infrastructure management.',
    icon: '🚢'
  },
  {
    id: 'i18n',
    name: 'Internationalization & Localization',
    description: 'Multi-language support and cultural adaptation.',
    icon: '🌍'
  },
  {
    id: 'realtime',
    name: 'Real-Time Features',
    description: 'WebSocket integration, live updates, and real-time data handling.',
    icon: '⚡'
  },
  {
    id: 'docs',
    name: 'Documentation & Knowledge Sharing',
    description: 'Code documentation, API documentation, and knowledge base creation.',
    icon: '📚'
  },
  {
    id: 'accessibility',
    name: 'Accessibility & Compliance',
    description: 'WCAG compliance, screen reader support, and accessibility best practices.',
    icon: '♿'
  },
  {
    id: 'automation',
    name: 'Workflow Automation',
    description: 'Task automation, build processes, and workflow optimization.',
    icon: '🤖'
  },
  {
    id: 'integrations',
    name: 'Third-Party Integration',
    description: 'External service integration and API consumption.',
    icon: '🔗'
  },
  {
    id: 'algorithms',
    name: 'Algorithm & Data Structures',
    description: 'Common algorithms, data structures, and problem-solving patterns.',
    icon: '🧮'
  },
  {
    id: 'components',
    name: 'Custom Components & Utilities',
    description: 'Reusable components, utility functions, and helper libraries.',
    icon: '🧩'
  },
  {
    id: 'general',
    name: 'General Prompts',
    description: 'General-purpose prompts and templates for various development tasks.',
    icon: '📝'
  }
];

async function addCategories() {
  try {
    const categoriesRef = ref(db, 'categories');
    await set(categoriesRef, categories.reduce((acc, category) => {
      acc[category.id] = {
        name: category.name,
        description: category.description,
        icon: category.icon,
        count: 0 // Initialize prompt count to 0
      };
      return acc;
    }, {} as Record<string, any>));
    console.log('Categories added successfully');
  } catch (error) {
    console.error('Error adding categories:', error);
  }
}

addCategories();
