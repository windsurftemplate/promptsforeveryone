import React from 'react';
import Image from 'next/image';

export default function DashboardPreview() {
  return (
    <div className="relative w-full max-w-6xl mx-auto py-48 px-4">
      {/* Glowing border container */}
      <div className="relative rounded-2xl overflow-hidden animate-float">
        {/* Background glow effect */}
        <div className="absolute -inset-1 bg-[#8B5CF6] opacity-20 blur-lg animate-pulse-glow" />
        
        {/* Border glow */}
        <div className="absolute inset-0 rounded-2xl border border-[#8B5CF6]/50 z-10" />
        
        {/* Dark background for contrast */}
        <div className="relative bg-black/90 rounded-2xl overflow-hidden">
          {/* Image */}
          <Image
            src="/Screenshot-webpage.png"
            alt="Prompts For Everyone Dashboard Preview"
            width={1200}
            height={675}
            priority
            className="w-full h-auto rounded-2xl transition-transform duration-700 hover:scale-105"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
      </div>
      
      {/* Radial gradient background effect */}
      <div className="absolute -inset-40 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,255,255,0.1),transparent_70%)] blur-2xl animate-pulse-glow" />
    </div>
  );
} 