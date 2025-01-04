'use client';


import { motion } from 'framer-motion';
import {
  SparklesIcon,
  LightBulbIcon,
  ChatBubbleBottomCenterTextIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    title: 'AI-Powered Prompts',
    description: 'Access a curated collection of high-quality prompts optimized for various AI models and use cases.',
    icon: SparklesIcon,
  },
  {
    title: 'Smart Categories',
    description: 'Organize prompts with intelligent categorization and easy-to-navigate subcategories.',
    icon: LightBulbIcon,
  },
  {
    title: 'Interactive Chat',
    description: 'Test and refine prompts in real-time with our interactive chat interface.',
    icon: ChatBubbleBottomCenterTextIcon,
  },
  {
    title: 'Private Collections',
    description: 'Create and manage private prompt collections for personal or team use.',
    icon: ShieldCheckIcon,
  },
  {
    title: 'Version Control',
    description: 'Track prompt iterations and improvements with built-in version control.',
    icon: ArrowPathIcon,
  },
  {
    title: 'Cloud Sync',
    description: 'Access your prompts from anywhere with secure cloud synchronization.',
    icon: CloudArrowUpIcon,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00ffff] to-white bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Powerful Features for Your Prompts
          </motion.h1>
          <motion.p 
            className="text-white/60 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover the tools and capabilities that make Prompts For Everyone the ultimate platform for managing and optimizing your AI prompts.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6 hover:border-[#00ffff]/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all duration-300"
            >
              <div className="rounded-full bg-[#00ffff]/10 w-12 h-12 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-[#00ffff]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-white/60">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Ready to enhance your prompt management?
          </h2>
          <button className="bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] px-8 py-3 rounded-lg transition-all duration-300 border border-[#00ffff]/30">
            Get Started Now
          </button>
        </motion.div>
      </div>
    </div>
  );
} 