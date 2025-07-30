import { I18nProvider } from '@/app/i18n/providers';
import { getMessages } from '@/app/i18n/messages';
import { ReactNode } from 'react';
import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/app/contexts/AuthContext';
import { CartProvider } from '@/app/contexts/CartContext';
import { ThemeProvider } from '@/app/contexts/ThemeContext';
import { WishlistProvider } from '@/app/contexts/WishlistContext';
import SessionWrapper from '@/app/components/SessionWrapper';
import ClientLayout from './ClientLayout';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Movie List - Your Personal Movie Collection',
    template: '%s | Movie List',
  },
  description:
    'Manage your personal movie collection, track watched films, create wishlists, and discover new movies with friends.',
  keywords: [
    'movie list',
    'movie tracker',
    'film collection',
    'movie database',
    'watchlist',
    'movie reviews',
  ],
  authors: [{ name: 'Movie List Team' }],
  creator: 'Movie List',
  publisher: 'Movie List',
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXTAUTH_URL || 'https://localhost:3000',
    title: 'Movie List - Your Personal Movie Collection',
    description:
      'Manage your personal movie collection, track watched films, and discover new movies.',
    siteName: 'Movie List',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Movie List - Your Personal Movie Collection',
    description:
      'Manage your personal movie collection, track watched films, and discover new movies.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

type Props = {
  children: ReactNode;
  params: {
    locale: string;
  };
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  const supportedLocales = ['en', 'lv', 'ru'];
  const safeLocale = supportedLocales.includes(locale) ? locale : 'en';
  const messages = await getMessages(safeLocale);
  return (
    <html lang={safeLocale} suppressHydrationWarning className="scroll-smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'system';
                  var resolvedTheme;
                  
                  if (theme === 'system') {
                    resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  } else {
                    resolvedTheme = theme;
                  }
                  
                  if (resolvedTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <SessionWrapper>
          <I18nProvider locale={safeLocale} messages={messages}>
            <ThemeProvider>
              <AuthProvider>
                <WishlistProvider>
                  <CartProvider>
                    <ClientLayout>{children}</ClientLayout>
                  </CartProvider>
                </WishlistProvider>
              </AuthProvider>
            </ThemeProvider>
          </I18nProvider>
        </SessionWrapper>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
