import { Metadata } from 'next';
import { db } from '@/lib/firebase';
import { ref, get } from 'firebase/database';

export async function generateMetadata({ params }: { params: { id: string; subId: string; promptId: string } }): Promise<Metadata> {
  const { id: categoryId, subId: subcategoryId, promptId } = params;
  
  // Fetch prompt data
  const promptRef = ref(db, `prompts/${promptId}`);
  const promptSnapshot = await get(promptRef);
  const prompt = promptSnapshot.val();

  if (!prompt) {
    return {
      title: 'Prompt Not Found',
      description: 'The requested prompt could not be found.'
    };
  }

  // Fetch category and subcategory data
  const categoryRef = ref(db, `categories/${categoryId}`);
  const categorySnapshot = await get(categoryRef);
  const category = categorySnapshot.val();
  const subcategory = category?.subcategories?.[subcategoryId];

  return {
    title: `${prompt.title} - ${subcategory?.name || 'Prompt'} | PromptsForEveryone`,
    description: prompt.description || `A ${subcategory?.name?.toLowerCase() || ''} prompt in the ${category?.name || ''} category.`,
    keywords: [
      'AI prompts',
      'prompt templates',
      'prompt engineering',
      'ChatGPT prompts',
      ...(prompt.tags || []),
      subcategory?.name || '',
      category?.name || ''
    ],
    openGraph: {
      title: prompt.title,
      description: prompt.description,
      url: `https://promptsforeveryone.com/categories/${categoryId}/${subcategoryId}/prompts/${promptId}`,
      type: 'article',
      authors: [prompt.userName],
      publishedTime: prompt.createdAt,
    }
  };
} 