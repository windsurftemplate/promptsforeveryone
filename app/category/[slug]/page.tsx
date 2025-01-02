import Link from 'next/link';
import { ref, get, DatabaseReference, DataSnapshot } from 'firebase/database';
import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import { CATEGORY_DESCRIPTIONS } from '@/lib/constants';

// 1. Define Prompt type
interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  categories?: string[];
  visibility: 'public' | 'private';
}

// 2. Route params type (string | string[] to handle multiple scenarios)
interface CategoryPageProps {
  params: Promise<{ slug: string | string[] }>;
}

// 3. AdSpace Component
const AdSpace = ({ position }: { position: 'top' | 'sidebar' | 'bottom' }) => {
  const adStyles = {
    top: 'w-full h-[100px] mb-8',
    sidebar: 'w-full h-[600px]',
    bottom: 'w-full h-[100px] mt-8',
  };

  return (
    <div
      className={`bg-black/30 border border-[#00ffff]/10 rounded-lg flex items-center justify-center ${adStyles[position]}`}
    >
      <span className="text-[#00ffff]/40">Ad Space - {position}</span>
    </div>
  );
};

// 4. Main CategoryPage Component
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const formattedSlug = Array.isArray(slug) ? slug.join('/') : slug;

  // Fetch prompts from Firebase
  const prompts = await fetchPrompts(formattedSlug);

  // If no prompts, trigger 404
  if (!prompts.length) {
    notFound();
  }

  // Format category name for display (e.g., "web-dev" -> "Web Dev")
  const categoryName = formatCategoryName(Array.isArray(slug) ? slug.join('-') : slug);

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <AdSpace position="top" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#00ffff]">
                {categoryName} Prompts
              </h1>
              <p className="text-white/60">
                {CATEGORY_DESCRIPTIONS[slug as keyof typeof CATEGORY_DESCRIPTIONS] ??
                  'Explore our collection of prompts'}
              </p>
            </div>

            {prompts.length > 0 ? (
              <div className="grid gap-6">
                {prompts.map((prompt) => (
                  <div key={prompt.id} className="bg-black/50 border p-6 rounded-lg">
                    <h2 className="text-xl text-white">{prompt.title}</h2>
                    <p className="text-white/60">{prompt.description}</p>
                    <Link href={`/prompt/${prompt.id}`} className="text-[#00ffff]">
                      View Details →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-white/60">No prompts found.</p>
            )}
          </div>

          <div className="lg:w-[300px]">
            <AdSpace position="sidebar" />
          </div>
        </div>

        <AdSpace position="bottom" />
      </div>
    </div>
  );
}

// 5. Fetch Prompts Helper Function
async function fetchPrompts(slug: string): Promise<Prompt[]> {
  const promptsRef: DatabaseReference = ref(db, 'prompts');
  const snapshot: DataSnapshot = await get(promptsRef);
  const promptsData: Prompt[] = [];

  if (snapshot.exists()) {
    Object.entries(snapshot.val() || {}).forEach(([id, data]) => {
      const promptData = data as Prompt;
      promptsData.push({
        id,
        title: promptData.title,
        description: promptData.description,
        category: promptData.category,
        categories: promptData.categories,
        visibility: promptData.visibility,
      });
    });
  }

  return promptsData.filter(
    (prompt) =>
      prompt.visibility !== 'private' &&
      (prompt.category === slug || prompt.categories?.includes(slug))
  );
}

// 6. Format Category Helper Function
function formatCategoryName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}