'use client';

import React from 'react';
import { PencilIcon, TrashIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import VoteButton from './VoteButton';

interface PromptCardProps {
  id: string;
  title: string;
  description: string;
  content: string;
  tags?: string[];
  onDelete?: (id: string) => void;
  onCopy?: (content: string) => void;
  onClick?: () => void;
  showActions?: boolean;
  votes?: number;
}

export default function PromptCard({
  id,
  title,
  description,
  content,
  tags = [],
  onDelete,
  onCopy,
  onClick,
  showActions = true,
  votes = 0
}: PromptCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-black/30 border border-[#00ffff]/20 rounded-lg p-6 hover:border-[#00ffff]/50 transition-all duration-300 group cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white group-hover:text-[#00ffff] transition-colors">
          {title}
        </h3>
        <VoteButton promptId={id} initialVotes={votes} />
      </div>

      <p className="text-white/70 mb-4">{description}</p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={`${id}-tag-${index}`}
              className="text-xs px-2 py-1 rounded-full bg-[#00ffff]/10 text-[#00ffff]/80"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {showActions && (
        <div className="flex justify-end gap-2 mt-4">
          {onCopy && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopy(content);
              }}
              className="p-2 text-white/60 hover:text-[#00ffff] transition-colors"
              title="Copy prompt"
            >
              <ClipboardDocumentIcon className="h-5 w-5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="p-2 text-white/60 hover:text-red-500 transition-colors"
              title="Delete prompt"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
} 