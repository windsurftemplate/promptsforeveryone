import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Prompts For Everyone',
  description: 'Your AI Prompt Management Platform',
  openGraph: {
    title: 'Prompts For Everyone',
    description: 'Your AI Prompt Management Platform',
    url: 'https://promptsforeveryone.vercel.app',
    siteName: 'Prompts For Everyone',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Prompts For Everyone - Your AI Prompt Management Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prompts For Everyone',
    description: 'Your AI Prompt Management Platform',
    images: ['/api/og'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen pt-24">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
