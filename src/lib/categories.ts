export interface PromptCategory {
  id: string;
  name: string;
  description: string;
  icon: string; // Text abbreviation for the icon
  group: string;
}

export const promptCategories: PromptCategory[] = [
  // Development & Programming
  {
    id: 'code-gen',
    name: 'Code Generation',
    description: 'Generate code snippets and boilerplate code',
    icon: 'CODE',
    group: 'Development'
  },
  {
    id: 'debugging',
    name: 'Debugging',
    description: 'Debug code and find solutions to common errors',
    icon: 'DBG',
    group: 'Development'
  },
  {
    id: 'testing',
    name: 'Testing',
    description: 'Generate test cases and testing scenarios',
    icon: 'TEST',
    group: 'Development'
  },
  {
    id: 'refactoring',
    name: 'Code Refactoring',
    description: 'Improve and optimize existing code',
    icon: 'RFCT',
    group: 'Development'
  },
  {
    id: 'api-design',
    name: 'API Design',
    description: 'Design and document APIs',
    icon: 'API',
    group: 'Development'
  },

  // Data & Analytics
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    description: 'Analyze and interpret data sets',
    icon: 'DATA',
    group: 'Data'
  },
  {
    id: 'data-viz',
    name: 'Data Visualization',
    description: 'Create visual representations of data',
    icon: 'VIZ',
    group: 'Data'
  },
  {
    id: 'sql-queries',
    name: 'SQL Queries',
    description: 'Generate and optimize SQL queries',
    icon: 'SQL',
    group: 'Data'
  },
  {
    id: 'data-clean',
    name: 'Data Cleaning',
    description: 'Clean and preprocess data',
    icon: 'CLN',
    group: 'Data'
  },

  // AI & Machine Learning
  {
    id: 'ml-models',
    name: 'ML Models',
    description: 'Design and train machine learning models',
    icon: 'ML',
    group: 'AI'
  },
  {
    id: 'nlp',
    name: 'Natural Language Processing',
    description: 'Process and analyze text data',
    icon: 'NLP',
    group: 'AI'
  },
  {
    id: 'cv',
    name: 'Computer Vision',
    description: 'Image and video processing tasks',
    icon: 'CV',
    group: 'AI'
  },
  {
    id: 'rl',
    name: 'Reinforcement Learning',
    description: 'Design RL agents and environments',
    icon: 'RL',
    group: 'AI'
  },

  // Web Development
  {
    id: 'frontend',
    name: 'Frontend Development',
    description: 'Create user interfaces and web components',
    icon: 'FE',
    group: 'Web'
  },
  {
    id: 'backend',
    name: 'Backend Development',
    description: 'Build server-side applications',
    icon: 'BE',
    group: 'Web'
  },
  {
    id: 'web-security',
    name: 'Web Security',
    description: 'Implement security best practices',
    icon: 'SEC',
    group: 'Web'
  },
  {
    id: 'web-perf',
    name: 'Web Performance',
    description: 'Optimize web application performance',
    icon: 'PERF',
    group: 'Web'
  },

  // DevOps & Infrastructure
  {
    id: 'devops',
    name: 'DevOps',
    description: 'Automate development operations',
    icon: 'OPS',
    group: 'DevOps'
  },
  {
    id: 'cloud',
    name: 'Cloud Computing',
    description: 'Deploy and manage cloud services',
    icon: 'CLD',
    group: 'DevOps'
  },
  {
    id: 'containers',
    name: 'Containerization',
    description: 'Work with Docker and containers',
    icon: 'CNT',
    group: 'DevOps'
  },
  {
    id: 'ci-cd',
    name: 'CI/CD',
    description: 'Set up continuous integration/deployment',
    icon: 'CI',
    group: 'DevOps'
  },

  // Mobile Development
  {
    id: 'ios',
    name: 'iOS Development',
    description: 'Build iOS applications',
    icon: 'IOS',
    group: 'Mobile'
  },
  {
    id: 'android',
    name: 'Android Development',
    description: 'Create Android applications',
    icon: 'AND',
    group: 'Mobile'
  },
  {
    id: 'cross-platform',
    name: 'Cross-Platform',
    description: 'Develop cross-platform mobile apps',
    icon: 'XP',
    group: 'Mobile'
  },

  // Design & UX
  {
    id: 'ui-design',
    name: 'UI Design',
    description: 'Design user interfaces',
    icon: 'UI',
    group: 'Design'
  },
  {
    id: 'ux-research',
    name: 'UX Research',
    description: 'Conduct user experience research',
    icon: 'UX',
    group: 'Design'
  },
  {
    id: 'accessibility',
    name: 'Accessibility',
    description: 'Implement accessible design',
    icon: 'A11Y',
    group: 'Design'
  },

  // Content & Documentation
  {
    id: 'tech-writing',
    name: 'Technical Writing',
    description: 'Create technical documentation',
    icon: 'DOC',
    group: 'Content'
  },
  {
    id: 'api-docs',
    name: 'API Documentation',
    description: 'Document APIs and endpoints',
    icon: 'APID',
    group: 'Content'
  },
  {
    id: 'code-comments',
    name: 'Code Comments',
    description: 'Write clear code documentation',
    icon: 'CMT',
    group: 'Content'
  },

  // Project Management
  {
    id: 'agile',
    name: 'Agile Management',
    description: 'Manage agile development processes',
    icon: 'AGL',
    group: 'Management'
  },
  {
    id: 'scrum',
    name: 'Scrum',
    description: 'Implement Scrum methodology',
    icon: 'SCM',
    group: 'Management'
  },
  {
    id: 'proj-planning',
    name: 'Project Planning',
    description: 'Plan and organize projects',
    icon: 'PLN',
    group: 'Management'
  },

  // Security & Testing
  {
    id: 'security-test',
    name: 'Security Testing',
    description: 'Test application security',
    icon: 'SEC',
    group: 'Security'
  },
  {
    id: 'pentesting',
    name: 'Penetration Testing',
    description: 'Conduct security assessments',
    icon: 'PEN',
    group: 'Security'
  },
  {
    id: 'code-review',
    name: 'Code Review',
    description: 'Review code for security issues',
    icon: 'REV',
    group: 'Security'
  },

  // Emerging Technologies
  {
    id: 'blockchain',
    name: 'Blockchain',
    description: 'Develop blockchain applications',
    icon: 'BLK',
    group: 'Emerging'
  },
  {
    id: 'ar-vr',
    name: 'AR/VR',
    description: 'Create augmented and virtual reality',
    icon: 'XR',
    group: 'Emerging'
  },
  {
    id: 'iot',
    name: 'Internet of Things',
    description: 'Build IoT applications',
    icon: 'IOT',
    group: 'Emerging'
  },
  {
    id: 'edge-computing',
    name: 'Edge Computing',
    description: 'Develop edge computing solutions',
    icon: 'EDGE',
    group: 'Emerging'
  }
]; 