import { generateCategoryMetadata } from '../metadata';

export async function generateMetadata({ params }: { params: { id: string } }) {
  return generateCategoryMetadata(params.id);
} 