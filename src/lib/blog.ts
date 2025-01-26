import matter from 'gray-matter';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  readTime: string;
  summary: string;
  slug: string;
  author?: string;
  tags?: string[];
}

export function parseBlogContent(content: string): Partial<BlogPost> {
  const { data, content: parsedContent } = matter(content);
  
  return {
    title: data.title,
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    readTime: data.readTime || '5 min read',
    summary: data.summary || '',
    author: data.author,
    tags: data.tags,
    content: parsedContent
  };
}

export function formatBlogContent(post: BlogPost): string {
  const frontMatter = {
    title: post.title || '',
    date: post.date || new Date().toISOString(),
    readTime: post.readTime || '5 min read',
    summary: post.summary || '',
    author: post.author || 'Anonymous',
    tags: post.tags || []
  };

  return matter.stringify(post.content || '', frontMatter);
}

export function generateSlug(title: string): string {
  return title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
} 