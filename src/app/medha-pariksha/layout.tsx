import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ggoodwilltrust.org'),
  title: 'Dr. A.P.J. Abdul Kalam Medha Pariksha 2026-2027 | National Merit Scholarship',
  description: 'Apply now for Dr. A.P.J. Abdul Kalam Medha Pariksha. Combined Mega Cash Prizes: 1st ₹21,000 • 2nd ₹11,000 • 3rd ₹5,100 + Championship Trophies & Merit Certificates for Classes 6 to 12. Registration Fee: ₹100 Only. Last Date: 31.12.2026.',
  keywords: [
    'Dr APJ Abdul Kalam Medha Pariksha',
    'Kalam Medha Pariksha',
    'G Goodwill Trust Scholarship',
    'National Talent Hunt 2026',
    'Scholarship for Class 6 to 12',
    'Cash Prize Scholarship New Delhi',
    'Shaheen Bagh Student Scholarship'
  ],
  alternates: {
    canonical: 'https://www.ggoodwilltrust.org/medha-pariksha',
  },
  openGraph: {
    title: 'Dr. A.P.J. Abdul Kalam Medha Pariksha (2026-2027)',
    description: 'Combined Mega Cash Prizes: 1st Prize ₹21,000 • 2nd Prize ₹11,000 • 3rd Prize ₹5,100 + Championship Trophies & Merit Certificates for Classes 6 to 12. Registration Fee: ₹100 Only. Apply Online Today.',
    url: 'https://www.ggoodwilltrust.org/medha-pariksha',
    siteName: 'G Goodwill Trust',
    images: [
      {
        url: 'https://www.ggoodwilltrust.org/medha-pariksha-og.png',
        width: 1200,
        height: 630,
        alt: 'Dr. A.P.J. Abdul Kalam Medha Pariksha 2026-2027 - G Goodwill Trust',
        type: 'image/png',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dr. A.P.J. Abdul Kalam Medha Pariksha 2026-2027',
    description: 'Combined Mega Cash Prizes: 1st ₹21,000 • 2nd ₹11,000 • 3rd ₹5,100 + Grand Trophies for Classes 6 to 12. Registration Fee: ₹100 Only.',
    images: ['https://www.ggoodwilltrust.org/medha-pariksha-og.png'],
  },
};

export default function MedhaParikshaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
