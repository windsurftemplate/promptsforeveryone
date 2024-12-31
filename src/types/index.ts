export interface Prompt {
  id?: string;
  title: string;
  content?: string;
  description: string;
  category?: string;
  tags?: string[];
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  isPrivate?: boolean;
  votes?: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  items: CategoryItem[];
  icon?: string;
  isPro?: boolean;
  isPrivate?: boolean;
  isExpanded?: boolean;
}

export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  plan?: 'free' | 'paid';
  role?: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
} 