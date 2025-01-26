'use client';

import BlogPostClient from './BlogPostClient';

interface Props {
  slug: string;
}

export default function BlogPostWrapper({ slug }: Props) {
  return <BlogPostClient slug={slug} />;
} 