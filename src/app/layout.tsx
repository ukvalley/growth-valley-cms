import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components';
import { AuthProvider } from '@/lib/auth-context';
import { SettingsProvider } from '@/lib/settings-context';
import MainLayout from '@/components/MainLayout';

export const metadata: Metadata = {
  title: {
    default: 'Growth Valley | Predictable Revenue Systems',
    template: '%s | Growth Valley',
  },
  description: 'We design and manage end-to-end revenue infrastructure that turns marketing into measurable growth. Predictable revenue systems for scalable businesses.',
  keywords: ['revenue systems', 'growth consulting', 'funnel strategy', 'performance marketing', 'CRM automation', 'lead generation'],
  authors: [{ name: 'Growth Valley' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://growthvalley.in',
    siteName: 'Growth Valley',
    title: 'Growth Valley | Predictable Revenue Systems',
    description: 'We design and manage end-to-end revenue infrastructure that turns marketing into measurable growth.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Growth Valley',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Growth Valley | Predictable Revenue Systems',
    description: 'We design and manage end-to-end revenue infrastructure that turns marketing into measurable growth.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-surface text-primary">
        <ThemeProvider>
          <AuthProvider>
            <SettingsProvider>
              <MainLayout>{children}</MainLayout>
            </SettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}