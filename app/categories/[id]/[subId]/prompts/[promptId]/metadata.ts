import { Metadata } from 'next';
import { db } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import { generateDynamicMetadata } from '../../../../../metadata';

export async function generateMetadata({ params }: { params: { id: string; subId: string; promptId: string } }): Promise<Metadata> {
  const { id: categoryId, subId: subcategoryId, promptId } = params;
  
  // Fetch all required data in a single query
  const combinedRef = ref(db, `prompts/${promptId}`);
  const [promptSnapshot, categorySnapshot] = await Promise.all([
    get(combinedRef),
    get(ref(db, `categories/${categoryId}`))
  ]);

  const prompt = promptSnapshot.val();
  const category = categorySnapshot.val();
  const subcategory = category?.subcategories?.[subcategoryId];

  if (!prompt) {
    return generateDynamicMetadata({
      title: 'Prompt Not Found',
      description: 'The requested prompt could not be found.',
      path: `/categories/${categoryId}/${subcategoryId}/prompts/${promptId}`,
      type: 'article'
    });
  }

  const keywords = [
    'AI prompts',
    'prompt templates',
    'prompt engineering',
    'ChatGPT prompts',
    ...(prompt.tags || []),
    subcategory?.name || '',
    category?.name || ''
  ].filter(Boolean);

  // Generate dynamic OG image URL with prompt details
  const ogImageUrl = `/api/og?title=${encodeURIComponent(prompt.title)}&description=${encodeURIComponent((prompt.description || '').slice(0, 200))}&category=${encodeURIComponent(subcategory?.name || category?.name || '')}`;

  return generateDynamicMetadata({
    title: `${prompt.title} - ${subcategory?.name || 'Prompt'} | PromptsForEveryone`,
    description: prompt.description || `A ${subcategory?.name?.toLowerCase() || ''} prompt in the ${category?.name || ''} category.`,
    path: `/categories/${categoryId}/${subcategoryId}/prompts/${promptId}`,
    type: 'article',
    keywords,
    image: ogImageUrl
  });
} 