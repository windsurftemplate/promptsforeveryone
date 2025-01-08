export interface Prompt {
  id?: string;
  title: string;
  description: string;
  content: string;
  categoryId?: string;
  category?: string;
  categories?: string[];
  userId: string;
  userName?: string;
  createdAt: string;
  updatedAt: string;
  visibility?: 'public' | 'private';
  tags?: string[];
  votes?: { [key: string]: boolean }; // Map of userIds to their vote status
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  plan: 'free' | 'paid';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripeSubscriptionStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  visibility: 'public' | 'private';
  createdAt: string;
  updatedAt: string;
} 