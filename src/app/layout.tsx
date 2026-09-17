import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ggoodwilltrust.org'),
  title: {
    default: 'G Goodwill Trust - Empowering Communities, Changing Lives',
    template: '%s | G Goodwill Trust',
  },
  description: 'G Goodwill Trust is a registered non-profit organization focused on education, healthcare, and empowerment of underprivileged communities in New Delhi, India.',
  keywords: ['NGO', 'non-profit', 'charity', 'education', 'healthcare', 'New Delhi', 'G Goodwill Trust', 'donate', 'volunteer'],
  authors: [{ name: 'G Goodwill Trust' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'G Goodwill Trust',
    title: 'G Goodwill Trust - Empowering Communities, Changing Lives',
    description: 'A registered non-profit organization focused on education, healthcare, and empowerment of underprivileged communities in New Delhi.',
    images: [{ url: '/logo.png', width: 400, height: 200, alt: 'G Goodwill Trust Logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'G Goodwill Trust',
    description: 'Empowering communities through education and healthcare in New Delhi.',
    images: ['/logo.png'],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico', apple: '/logo.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={inter.className + ' bg-slate-50 text-slate-900 flex flex-col min-h-screen antialiased'}>
        <Navbar />
        <main className="flex-grow pt-20">{children}</main>
        <Footer />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="lazyOnload" />
        <Script
          id="google-translate-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `function googleTranslateElementInit() { new window.google.translate.TranslateElement({pageLanguage: 'en', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element'); }`
          }}
        />
      </body>
    </html>
  );
}
