import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { Metadata } from 'next';
import GoogleAnalytics from './components/GoogleAnalytics';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'sonner';
import NavbarWrapper from './components/NavbarWrapper';
import { defaultMetadata } from './metadata';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    'sans-serif'
  ],
  adjustFontFallback: true
});

export const metadata: Metadata = {
  ...defaultMetadata,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#00ffff" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <NavbarWrapper>
            {children}
          </NavbarWrapper>
          <ScrollToTop />
          <Toaster position="bottom-right" />
        </AuthProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
