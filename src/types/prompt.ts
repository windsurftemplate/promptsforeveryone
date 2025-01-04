export type PromptVisibility = 'public' | 'private';

export type PromptCategory = 
  | 'General'
  | 'Development'
  | 'Design'
  | 'Writing'
  | 'Business'
  | 'Education'
  | 'Other';

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
