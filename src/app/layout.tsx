import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import RootLayoutClient from '@/components/layout/RootLayoutClient';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Prompts For Everyone',
  description: 'Your go-to destination for AI-crafted prompts and inspiration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <RootLayoutClient>{children}</RootLayoutClient>
    </html>
  );
}
