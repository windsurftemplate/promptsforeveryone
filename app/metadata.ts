import { Metadata } from 'next';

const defaultKeywords = [
  'AI prompts',
  'image prompts',
  'text prompts',
  'video prompts',
  'audio prompts',
  'prompt optimization',
  'prompt engineering',
  'ChatGPT prompts',
  'AI writing',
  'prompt templates',
  'AI assistant prompts',
  'prompt categories',
  'prompt library',
  'AI prompt collection',
  'prompt optimization',
  'AI conversation starters',
  'prompt examples'
];

export const defaultMetadata: Metadata = {
  metadataBase: new URL('https://promptsforeveryone.com'),
  title: {
    default: 'Discover, organize, & share AI prompts in a library built for creativity',
    template: '%s | Prompts For Everyone'
  },
  description: 'Explore the ultimate AI prompt library featuring image, text, video, and audio prompts. Optimize creativity with prompt engineering, templates, and ChatGPT prompts designed for AI writing, assistant tasks, and conversation starters. Discover categories like AI conversation, writing tools, and examples for every purpose.',
  keywords: defaultKeywords,
  authors: [{ name: 'Prompts For Everyone Team' }],
  creator: 'Prompts For Everyone',
  publisher: 'Prompts For Everyone',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#00ffff',
  colorScheme: 'dark',
  applicationName: 'Prompts For Everyone',
  referrer: 'origin-when-cross-origin',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Prompts For Everyone',
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://promptsforeveryone.com',
    siteName: 'Prompts For Everyone',
    title: 'Prompts For Everyone - AI Prompt Library',
    description: 'Discover and share AI prompts across various categories. Access collections of prompts for ChatGPT, writing, coding, and more.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Prompts For Everyone - AI Prompt Library'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prompts For Everyone - AI Prompt Library',
    description: 'Discover and share AI prompts across various categories. Access a collection of prompts for ChatGPT, writing, coding, and more.',
    images: ['/twitter-image.png'],
    creator: '@promptsforall',
    site: '@promptsforall'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
    yahoo: 'your-yahoo-verification',
    other: {
      'norton-safeweb': 'your-norton-verification',
    },
  },
  alternates: {
    canonical: 'https://promptsforeveryone.com',
    languages: {
      'en-US': 'https://promptsforeveryone.com',
    },
  },
  category: 'technology',
};

// Helper function to generate dynamic metadata
export function generateDynamicMetadata({
  title,
  description,
  path = '',
  type = 'website',
  image = '/og-image.png',
  keywords = [],
}: {
  title: string;
  description: string;
  path?: string;
  type?: string;
  image?: string;
  keywords?: string[];
}) {
  const url = `https://promptsforeveryone.com${path}`;
  
  return {
    title,
    description,
    keywords: [...defaultKeywords, ...keywords],
    openGraph: {
      title,
      description,
      url,
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    }
  } as Metadata;
} 