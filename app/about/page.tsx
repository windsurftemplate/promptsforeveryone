'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">
          About Prompts For Everyone
        </h1>
        
        <div className="space-y-8">
          <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">Our Mission</h2>
            <p className="text-white/80">
              Prompts For Everyone is dedicated to democratizing access to high-quality AI prompts. We believe in the power of well-crafted prompts to unlock the full potential of AI technology, making it accessible and useful for everyone.
            </p>
          </div>

          <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-[#00ffff]">Curated Prompts</h3>
                <p className="text-white/80">Carefully selected and tested prompts for various use cases, from content creation to coding assistance.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-[#00ffff]">Community Driven</h3>
                <p className="text-white/80">A platform where prompt engineers can share, collaborate, and learn from each other.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-[#00ffff]">Learning Resources</h3>
                <p className="text-white/80">Comprehensive guides and tutorials to help you master the art of prompt engineering.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-[#00ffff]">Regular Updates</h3>
                <p className="text-white/80">Stay up-to-date with the latest developments in AI and prompt engineering.</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">Join Our Community</h2>
            <p className="text-white/80 mb-6">
              Whether you're a beginner or an experienced prompt engineer, there's a place for you in our community. Share your knowledge, learn from others, and help shape the future of AI interaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/register" 
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-[#00ffff] hover:bg-[#00ffff]/80 transition-colors duration-200"
              >
                Get Started
              </Link>
              <Link 
                href="/discord" 
                className="inline-flex justify-center items-center px-6 py-3 border border-[#00ffff]/20 text-base font-medium rounded-md text-white bg-black/50 hover:bg-[#00ffff]/10 transition-colors duration-200"
              >
                Join Discord
              </Link>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">Contact Us</h2>
            <p className="text-white/80 mb-4">
              Have questions or suggestions? We'd love to hear from you. Reach out to our team or join our Discord community for real-time discussions.
            </p>
            <a 
              href="mailto:contact@promptsforeveryone.com" 
              className="text-[#00ffff] hover:text-[#00ffff]/80 transition-colors"
            >
              contact@promptsforeveryone.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
