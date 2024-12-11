export type PromptVisibility = 'public' | 'private';

export type PromptCategory = 
  | 'ChatGPT'
  | 'Code Assistant'
  | 'Writing'
  | 'Translation'
  | 'Data Analysis'
  | 'Image Generation'
  | 'Research'
  | 'Education'
  | 'Business'
  | 'Creative'
  | 'Other';

export interface Prompt {
  id?: string;
  title: string;
  description: string;
  content: string;
  category: PromptCategory;
  tags: string[];
  userId: string;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  visibility: PromptVisibility;
  isPublished: boolean;
}
