'use client';

import React from 'react';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon
} from 'react-share';

interface ShareButtonsProps {
  title: string;
  description: string;
  url: string;
}

export default function ShareButtons({ title, description, url }: ShareButtonsProps) {
  return (
    <div className="flex gap-2">
      <TwitterShareButton
        url={url}
        title={title}
        className="hover:scale-110 transition-transform duration-200"
      >
        <TwitterIcon size={24} round />
      </TwitterShareButton>

      <FacebookShareButton
        url={url}
        quote={`${title}\n${description}`}
        className="hover:scale-110 transition-transform duration-200"
      >
        <FacebookIcon size={24} round />
      </FacebookShareButton>

      <LinkedinShareButton
        url={url}
        title={title}
        summary={description}
        className="hover:scale-110 transition-transform duration-200"
      >
        <LinkedinIcon size={24} round />
      </LinkedinShareButton>

      <WhatsappShareButton
        url={url}
        title={`${title}\n${description}`}
        className="hover:scale-110 transition-transform duration-200"
      >
        <WhatsappIcon size={24} round />
      </WhatsappShareButton>
    </div>
  );
} 