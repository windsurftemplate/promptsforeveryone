export type PromptVisibility = 'public' | 'private';

export type PromptCategory = string;

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: PromptCategory;
  subcategoryId?: string;
  subcategoryName?: string;
  userId: string;
  userName?: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  visibility: PromptVisibility;
  isPublished: boolean;
  downloads: number;
  tags: string[];
}
