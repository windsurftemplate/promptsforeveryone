'use client';

import { useEffect, useState } from 'react';

interface CarouselItem {
  title: string;
  description: string;
  icon: string;
}

const FEATURES_ROW_1: CarouselItem[] = [
  {
    title: "Save & Organize",
    description: "Store your prompts in a secure vault with smart categorization and tagging system",
    icon: "SAVE"
  },
  {
    title: "Share & Collaborate",
    description: "Share prompts with your team or the community, collaborate in real-time",
    icon: "SHARE"
  },
  {
    title: "Customize & Edit",
    description: "Modify prompts to match your specific needs with our advanced editor",
    icon: "EDIT"
  },
  {
    title: "Version Control",
    description: "Track changes, maintain history, and rollback to previous versions",
    icon: "VER"
  },
  {
    title: "Template Library",
    description: "Access pre-built templates for common use cases and workflows",
    icon: "TPL"
  }
];

const FEATURES_ROW_2: CarouselItem[] = [
  {
    title: "Performance Analytics",
    description: "Track success rates and optimize your prompts with data insights",
    icon: "PRO"
  },
  {
    title: "Bulk Operations",
    description: "Import, export, and manage multiple prompts efficiently",
    icon: "BULK"
  },
  {
    title: "AI Optimization",
    description: "Let our AI suggest improvements to enhance prompt effectiveness",
    icon: "OPT"
  },
  {
    title: "Advanced Testing",
    description: "Test prompts across different scenarios and parameters",
    icon: "TEST"
  },
  {
    title: "Integration Ready",
    description: "Connect with popular AI models and development tools",
    icon: "API"
  }
];

export default function FeatureCarousel() {
  const [offset1, setOffset1] = useState(0);
  const [offset2, setOffset2] = useState(0);

  useEffect(() => {
    const animate = () => {
      setOffset1((prev) => (prev + 1) % (FEATURES_ROW_1.length * 300));
      setOffset2((prev) => (prev - 1 + FEATURES_ROW_2.length * 300) % (FEATURES_ROW_2.length * 300));
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden py-12 bg-gradient-to-b from-black/90 to-black relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,255,255,0.1),transparent_70%)]"></div>
      
      {/* First Row - Moving Right */}
      <div className="relative h-[220px] mb-12 overflow-hidden">
        <div 
          className="flex gap-8 absolute transition-transform duration-100 ease-linear"
          style={{
            transform: `translateX(-${offset1}px)`,
            width: `${FEATURES_ROW_1.length * 300}px`
          }}
        >
          {[...FEATURES_ROW_1, ...FEATURES_ROW_1].map((feature, index) => (
            <div
              key={index}
              className="w-[250px] p-6 bg-black/60 backdrop-blur-sm rounded-xl border border-[#00ffff]/20 hover:border-[#00ffff]/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] group"
            >
              <div className="text-2xl font-bold mb-4 transform group-hover:scale-110 transition-transform duration-300 text-[#00ffff]">
                {feature.icon}
              </div>
              <h3 className="text-[#00ffff] font-semibold mb-2 group-hover:text-white transition-colors duration-300">{feature.title}</h3>
              <p className="text-white/60 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Second Row - Moving Left */}
      <div className="relative h-[220px] overflow-hidden">
        <div 
          className="flex gap-8 absolute transition-transform duration-100 ease-linear"
          style={{
            transform: `translateX(-${offset2}px)`,
            width: `${FEATURES_ROW_2.length * 300}px`
          }}
        >
          {[...FEATURES_ROW_2, ...FEATURES_ROW_2].map((feature, index) => (
            <div
              key={index}
              className="w-[250px] p-6 bg-black/60 backdrop-blur-sm rounded-xl border border-[#00ffff]/20 hover:border-[#00ffff]/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] group"
            >
              <div className="text-2xl font-bold mb-4 transform group-hover:scale-110 transition-transform duration-300 text-[#00ffff]">
                {feature.icon}
              </div>
              <h3 className="text-[#00ffff] font-semibold mb-2 group-hover:text-white transition-colors duration-300">{feature.title}</h3>
              <p className="text-white/60 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 