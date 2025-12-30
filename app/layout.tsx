import './globals.css';
import { Inter, Montserrat } from 'next/font/google';
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
  variable: '--font-inter',
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

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700'],
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
    <html lang="en" className={`${inter.variable} ${montserrat.variable} scroll-smooth`}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#0A8F6A" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.className} bg-black text-neutral-300 overflow-x-hidden selection:bg-emerald selection:text-white`}>
        {/* Ambient Background */}
        <div className="ambient-light" />
        <div className="noise-overlay" />

        <AuthProvider>
          <NavbarWrapper>
            {children}
          </NavbarWrapper>
          <ScrollToTop />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(0, 0, 0, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
