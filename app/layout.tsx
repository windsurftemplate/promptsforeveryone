import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { Metadata } from 'next';
import GoogleAnalytics from './components/GoogleAnalytics';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'sonner';
import NavbarWrapper from './components/NavbarWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Prompts For Everyone - AI Prompt Library Community',
  description: 'Discover, create, and share AI prompts with the largest prompt engineering community',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' }
    ],
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon.png',
    },
  },
  openGraph: {
    title: 'Prompts For Everyone - AI Prompt Library Community',
    description: 'Discover, create, and share AI prompts with the largest prompt engineering community',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prompts For Everyone - AI Prompt Library Community',
    description: 'Discover, create, and share AI prompts with the largest prompt engineering community',
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
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "pv143imsm3");
            `
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ScrollToTop />
          <NavbarWrapper>
            {children}
          </NavbarWrapper>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
