'use client';

import React from 'react';
import { ClipboardDocumentIcon, TrashIcon } from '@heroicons/react/24/outline';
import ShareButtons from './ShareButtons';
import { useAuth } from '@/contexts/AuthContext';

interface PromptCardProps {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  userId?: string;
  onDelete?: (id: string) => void;
  onCopy?: (content: string) => void;
  onClick?: () => void;
}

export default function PromptCard({
  id,
  title,
  description,
  content,
  tags,
  userId,
  onDelete,
  onCopy,
  onClick,
}: PromptCardProps) {
  const shareUrl = `${window.location.origin}/prompt/${id}`;
  const { user } = useAuth();
  const isCreator = user && userId && user.uid === userId;

  return (
    <div 
      className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6 hover:border-[#00ffff]/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-white hover:text-[#00ffff] transition-colors">
          {title}
        </h2>
        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => onCopy?.(content)}
            className="text-white/60 hover:text-[#00ffff] transition-colors"
            title="Copy prompt"
          >
            <ClipboardDocumentIcon className="w-5 h-5" />
          </button>
          {isCreator && onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="text-white/60 hover:text-[#00ffff] transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      <p className="text-white/60 mb-4 line-clamp-3">{description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="text-sm px-3 py-1 rounded-full bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/30"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-[#00ffff]/10" onClick={e => e.stopPropagation()}>
        <ShareButtons
          title={title}
          description={description}
          url={shareUrl}
        />
      </div>
    </div>
  );
} 