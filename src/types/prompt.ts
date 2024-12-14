export type PromptVisibility = 'public' | 'private';

export type PromptCategory = 
  | 'General Prompts'
  | 'Project Initialization & Setup'
  | 'Frontend Design & Development'
  | 'Backend Development'
  | 'Database Design & Integration'
  | 'Full-Stack Features'
  | 'Styling & Theming'
  | 'Responsive Design'
  | 'Forms & User Input Handling'
  | 'API Integration & Development'
  | 'Animations & Interactivity'
  | 'E-Commerce Features'
  | 'Authentication & Security'
  | 'Testing & Debugging'
  | 'Performance Optimization'
  | 'DevOps & Deployment'
  | 'Internationalization & Localization'
  | 'Real-Time Features'
  | 'Documentation & Knowledge Sharing'
  | 'Accessibility & Compliance'
  | 'Workflow Automation'
  | 'Third-Party Integration'
  | 'Algorithm & Data Structures'
  | 'Custom Components & Utilities';

export interface Prompt {
  id?: string;
  title: string;
  content: string;
  description: string;
  category: PromptCategory;
  userId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  visibility: PromptVisibility;
  isPublished: boolean;
  downloads?: number;
  tags?: string[];
}
