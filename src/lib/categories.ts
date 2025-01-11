export interface PromptCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  subcategories?: PromptCategory[];
}

export const promptCategories: PromptCategory[] = [
  {
    id: 'writing',
    name: 'Writing',
    description: 'Prompts for creative writing, content creation, and storytelling',
    icon: '✍️'
  },
  {
    id: 'coding',
    name: 'Coding',
    description: 'Prompts for programming, development, and technical tasks',
    icon: '💻'
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Prompts for business strategy, marketing, and professional tasks',
    icon: '💼'
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Prompts for learning, teaching, and academic purposes',
    icon: '📚'
  },
  {
    id: 'art',
    name: 'Art & Design',
    description: 'Prompts for visual arts, design, and creative projects',
    icon: '🎨'
  }
]; 