import Link from 'next/link';

const blogPosts = [
  {
    slug: 'mastering-prompt-engineering',
    title: 'Mastering Prompt Engineering: A Comprehensive Guide for Beginners',
    date: 'January 5, 2024',
    readTime: '10 min read',
    summary: 'Learn the fundamentals of prompt engineering and how to craft effective prompts for AI language models. This comprehensive guide covers core principles, advanced techniques, and best practices.',
  },
  {
    slug: 'ai-trends-2024',
    title: 'AI Trends in 2024: Shaping the Future of Technology',
    date: 'January 5, 2024',
    readTime: '12 min read',
    summary: 'Explore the latest trends in artificial intelligence, from multimodal AI models to enterprise solutions, responsible AI development, and the evolution of AI infrastructure.',
  },
  {
    slug: 'effective-prompt-patterns',
    title: 'Effective Prompt Patterns: Templates for Success with AI',
    date: 'January 5, 2024',
    readTime: '15 min read',
    summary: 'Discover proven prompt patterns and templates for different use cases, including content creation, technical writing, analysis, educational content, and business communication.',
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">
        Blog
      </h1>
      <div className="space-y-8">
        {blogPosts.map((post) => (
          <article key={post.slug} className="card p-6 hover:scale-[1.02] transition-transform duration-200">
            <Link href={`/blog/${post.slug}`}>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white hover:text-[#00ffff] transition-colors">
                  {post.title}
                </h2>
                <div className="flex items-center text-white/60 text-sm">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                <p className="text-white/80">
                  {post.summary}
                </p>
                <div className="pt-4">
                  <span className="text-[#00ffff] hover:text-[#00ffff]/80 transition-colors">
                    Read more →
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
