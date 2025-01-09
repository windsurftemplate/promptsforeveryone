import { generateSubcategoryMetadata } from '../../metadata';

export async function generateMetadata({ params }: { params: { id: string; subId: string } }) {
  return generateSubcategoryMetadata(params.id, params.subId);
} 