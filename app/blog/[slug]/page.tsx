import { Metadata } from 'next';
import BlogPostClient from './BlogPostClient';

interface Props {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Blog Post - ${resolvedParams.slug}`,
    description: 'Reading blog post...',
  };
}

export default async function BlogPostPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  return <BlogPostClient slug={resolvedParams.slug} />;
} 