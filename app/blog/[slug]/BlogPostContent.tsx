'use client';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { BlogPost } from '@/lib/blog';
import Link from 'next/link';
import { TwitterIcon, GithubIcon } from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

interface Props {
  post: BlogPost;
  popularPosts: BlogPost[];
}

export default function BlogPostContent({ post, popularPosts }: Props) {
  const gradientAnimation = {
    initial: { backgroundPosition: '0% 50%' },
    animate: { 
      backgroundPosition: '100% 50%',
      transition: {
        duration: 15,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "linear"
      }
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[50vh] flex items-center justify-center overflow-hidden"
      >
        <motion.div 
          className="absolute inset-0"
          initial={gradientAnimation.initial}
          animate={gradientAnimation.animate}
          style={{
            backgroundImage: `
              radial-gradient(circle at top left, rgba(0, 255, 255, 0.15), transparent 40%),
              radial-gradient(circle at bottom right, rgba(0, 255, 255, 0.1), transparent 40%),
              radial-gradient(circle at center, rgba(0, 255, 255, 0.05), transparent 50%)
            `,
            backgroundSize: '200% 200%'
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="text-[#8B5CF6] text-sm tracking-wider uppercase mb-4">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} • {post.readTime}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            {post.title}
          </h1>
          <div className="flex items-center justify-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/10" />
            <div className="text-white/80">{post.author}</div>
          </div>
        </div>
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 prose prose-invert prose-cyan max-w-none
              prose-h2:text-3xl prose-h2:font-bold prose-h2:text-white/90 
              prose-h3:text-2xl prose-h3:font-semibold prose-h3:text-white/80
              prose-p:text-white/70 prose-p:leading-relaxed
              prose-a:text-[#8B5CF6] prose-a:no-underline hover:prose-a:text-[#8B5CF6]/80
              prose-strong:text-white/90
              prose-code:text-[#8B5CF6] prose-code:bg-[#8B5CF6]/10 prose-code:px-2 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-black/50 prose-pre:border prose-pre:border-[#8B5CF6]/20
              prose-img:rounded-lg prose-img:shadow-xl
              prose-blockquote:border-l-[#8B5CF6] prose-blockquote:bg-[#8B5CF6]/5 prose-blockquote:py-0.5
              prose-li:text-white/70"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Popular Posts Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-80 shrink-0"
          >
            <div className="sticky top-24">
              <div className="rounded-xl border border-[#8B5CF6]/10 bg-black/40 backdrop-blur-xl p-6">
                <h2 className="text-xl font-semibold text-[#8B5CF6] mb-6">
                  Popular Posts
                </h2>
                <div className="space-y-6">
                  {popularPosts.length > 0 ? (
                    popularPosts.map((popularPost) => (
                      <Link 
                        key={popularPost.id}
                        href={`/blog/${popularPost.slug}`}
                        className="block group"
                      >
                        <article className="space-y-2">
                          <h3 className="text-white/80 group-hover:text-[#8B5CF6] transition-colors line-clamp-2">
                            {popularPost.title}
                          </h3>
                          <div className="text-sm text-[#8B5CF6]/40 flex items-center space-x-2">
                            <time dateTime={popularPost.date}>
                              {format(new Date(popularPost.date), 'MMM d, yyyy')}
                            </time>
                            <span className="w-1 h-1 rounded-full bg-[#8B5CF6]/40" />
                            <span>{popularPost.readTime}</span>
                          </div>
                        </article>
                      </Link>
                    ))
                  ) : (
                    <p className="text-white/60 text-center py-4">
                      No other posts available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 py-12 bg-black border-t border-[#8B5CF6]/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
              <div className="text-center">
                <h3 className="text-[#8B5CF6] font-semibold mb-4">Product</h3>
                <ul className="space-y-3">
                  <li><Link href="/explore" className="text-white/60 hover:text-[#8B5CF6] transition-colors">Explore</Link></li>
                  <li><Link href="/submit" className="text-white/60 hover:text-[#8B5CF6] transition-colors">Submit Prompt</Link></li>
                  <li><Link href="/price" className="text-white/60 hover:text-[#8B5CF6] transition-colors">Pricing</Link></li>
                </ul>
              </div>
              <div className="text-center">
                <h3 className="text-[#8B5CF6] font-semibold mb-4">Resources</h3>
                <ul className="space-y-3">
                  <li><Link href="/guides" className="text-white/60 hover:text-[#8B5CF6] transition-colors">Guides</Link></li>
                  <li><Link href="/blog" className="text-white/60 hover:text-[#8B5CF6] transition-colors">Blog</Link></li>
                  <li><Link href="/about" className="text-white/60 hover:text-[#8B5CF6] transition-colors">About</Link></li>
                  <li><Link href="/careers" className="text-white/60 hover:text-[#8B5CF6] transition-colors">Careers</Link></li>
                </ul>
              </div>
              <div className="text-center">
                <h3 className="text-[#8B5CF6] font-semibold mb-4">Legal</h3>
                <ul className="space-y-3">
                  <li><Link href="/terms" className="text-white/60 hover:text-[#8B5CF6] transition-colors">Terms</Link></li>
                  <li><Link href="/privacy" className="text-white/60 hover:text-[#8B5CF6] transition-colors">Privacy</Link></li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#8B5CF6]/10">
              <div className="text-white/60 text-sm mb-4 md:mb-0">
                © 2025 Prompts For Everyone. All rights reserved.
              </div>
              <div className="flex gap-6">
                <Link href="https://twitter.com" className="text-white/60 hover:text-[#8B5CF6] transition-colors">
                  <TwitterIcon className="w-5 h-5" />
                </Link>
                <Link href="https://github.com" className="text-white/60 hover:text-[#8B5CF6] transition-colors">
                  <GithubIcon className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 