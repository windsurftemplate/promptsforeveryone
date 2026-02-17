'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#8B5CF6] to-[#8B5CF6] bg-clip-text text-transparent">
          About Prompts For Everyone
        </h1>
        
        <div className="space-y-8">
          <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">Our Mission</h2>
            <p className="text-white/80">
            AI is no longer the future—it’s the present. But too often, it feels out of reach for everyday users. 
            We’re here to change that. Prompts For Everyone is about democratizing access to high-quality prompts, 
            turning AI into a tool anyone can use to create, innovate, and achieve more. Whether you’re a business owner, 
            content creator, developer, or just someone looking to explore, we make AI accessible, practical, and powerful.

            </p>
          </div>

          <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-[#8B5CF6]">Never Stops Growing</h3>
                <p className="text-white/80">At Prompts For Everyone, we’re constantly adding new prompts 
                across categories like content creation, coding, brainstorming, and productivity. 
                The best part? These aren’t handpicked by us—they’re shaped by the community. 
                With every vote, share, and contribution, the library evolves to reflect what’s working right now.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-[#8B5CF6]">Crowd-Powered Innovation</h3>
                <p className="text-white/80">Our voting system ensures the best prompts rise to the top, so you’re 
                always accessing ideas that are tested and loved by real users. This isn’t a static collection—it’s a living, 
                breathing hub of creativity.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-[#8B5CF6]">Designed for Every Level</h3>
                <p className="text-white/80">Whether you’re exploring AI for the first time or you’re a seasoned expert, we’ve got something for you. 
                From beginner-friendly guides to advanced workflows, our platform scales with your needs.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-[#8B5CF6]">Always Evolving</h3>
                <p className="text-white/80">AI is changing fast—and so are we. With regular updates, you’ll always have access 
                to the newest, most effective prompts and workflows, keeping you one step ahead of the curve.</p>
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
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-[#8B5CF6] hover:bg-[#8B5CF6]/80 transition-colors duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">Contact Us</h2>
            <p className="text-white/80 mb-4">
              Have questions or suggestions? We'd love to hear from you. Reach out to our team for real-time discussions.
            </p>
            <a 
              href="mailto:contact@promptsforeveryone.com" 
              className="text-[#8B5CF6] hover:text-[#8B5CF6]/80 transition-colors"
            >
              contact@promptsforeveryone.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
