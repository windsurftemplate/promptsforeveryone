'use client';

import { useEffect, useState } from 'react';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export default function MarkdownPreview({ content, className = '' }: MarkdownPreviewProps) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    let mounted = true;
    
    import('marked')
      .then(markedModule => {
        if (mounted) {
          // Convert the result to a string explicitly
          const renderedHtml = String(markedModule.marked(content));
          setHtml(renderedHtml);
        }
      })
      .catch(error => {
        console.error('Error rendering markdown:', error);
      });

    return () => { mounted = false; };
  }, [content]);

  return (
    <div 
      className={`prose prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
