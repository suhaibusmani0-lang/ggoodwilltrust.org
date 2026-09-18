import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
});

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
    <html lang="en" data-scroll-behavior="smooth" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body className={`${jakarta.className} bg-[#09090b] text-[#f4f4f5] flex flex-col min-h-screen antialiased relative selection:bg-[#d4af37] selection:text-black tracking-[-0.01em]`}>
        {/* Subtle static noise/grain overlay for organic texture */}
        <div 
          className="fixed inset-0 pointer-events-none z-50 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />

        <SmoothScrollProvider>
          <Navbar />
          <main className="flex-grow pt-20">{children}</main>
          <Footer />
        </SmoothScrollProvider>

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
