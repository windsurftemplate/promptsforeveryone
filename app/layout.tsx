import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Metadata } from 'next';
import GoogleAnalytics from './components/GoogleAnalytics';
import ScrollToTop from './components/ScrollToTop';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PromptsForEveryone.com',
  description: 'Organize, Discover, and Share Ideas',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/logo.svg',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/logo.svg',
    },
  },
  openGraph: {
    title: 'Prompts For Everyone',
    description: 'Discover, create, and share AI prompts',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prompts For Everyone',
    description: 'Discover, create, and share AI prompts',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <GoogleAnalytics />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ScrollToTop />
          <Navbar />
          <main className="min-h-screen pt-24">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
