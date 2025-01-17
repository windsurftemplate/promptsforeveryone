import React from 'react';

interface Ad {
  id: string;
  title: string;
  type: 'banner' | 'inline';
  content: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface AdDisplayProps {
  ad: Ad;
}

export default function AdDisplay({ ad }: AdDisplayProps) {
  if (ad.status !== 'active') {
    return null;
  }

  return (
    <div 
      className={`relative ${
        ad.type === 'banner' 
          ? 'col-span-full bg-black/40 backdrop-blur-sm border border-[#00ffff]/10 rounded-lg p-4'
          : 'bg-black/40 backdrop-blur-sm border border-[#00ffff]/10 rounded-lg p-4'
      }`}
    >
      <div className="absolute top-2 right-2 text-xs text-[#00ffff]/40">Ad</div>
      <div 
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: ad.content }}
      />
    </div>
  );
} 