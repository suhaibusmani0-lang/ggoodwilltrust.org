import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ggoodwilltrust.org'),
  title: 'Dr. A.P.J. Abdul Kalam Medha Pariksha 2026-2027 | National Merit Scholarship',
  description: 'Apply now for Dr. A.P.J. Abdul Kalam Medha Pariksha. Combined Mega Cash Prizes: 1st ₹21,000 • 2nd ₹11,000 • 3rd ₹5,100 + Championship Trophies & Merit Certificates for Classes 6 to 12. Registration Fee: ₹100 Only. Last Date: 31.12.2026.',
  keywords: [
    'Dr APJ Abdul Kalam Medha Pariksha',
    'Abdul Kalam Medha Pariksha',
    'Kalam Medha Pariksha',
    'G Goodwill Trust Scholarship',
    'National Talent Hunt 2026',
    'Scholarship for Class 6 to 12',
    'Cash Prize Scholarship New Delhi',
    'Shaheen Bagh Student Scholarship',
    'Okhla Student Scholarship',
    'Delhi NCR Talent Search Exam',
    'Medha Pariksha Registration 2026',
    'School Talent Examination 100 Rs',
    'Combined Grand Prize Scholarship',
    'Sub Junior Junior Senior Scholarship Exam',
    'All India Merit Scholarship Exam',
    'Section 80G Educational Trust Delhi',
    'Spread Smiles Foundation Medha Pariksha',
    'No Crying Foundation Medha Pariksha',
    'Musawat Welfare Trust Medha Pariksha',
    'Nayab Training Educational Trust',
    'Buniyadi Sahara Trust Scholarship',
    'Zarnetic Medha Pariksha Sponsor',
    'Arshi Cafe Goodwill Scholarship',
    'Kalam Scholarship Syllabus and Dates',
    'Download Medha Pariksha Receipt',
    'Dr APJ Abdul Kalam Talent Award'
  ],
  authors: [{ name: 'G Goodwill Trust', url: 'https://www.ggoodwilltrust.org' }],
  creator: 'G Goodwill Trust',
  publisher: 'G Goodwill Trust',
  category: 'Education / Scholarship',
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
  },
  alternates: {
    canonical: 'https://www.ggoodwilltrust.org/medha-pariksha',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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

const jsonLdEvent = {
  '@context': 'https://schema.org',
  '@type': 'EducationEvent',
  name: 'Dr. A.P.J. Abdul Kalam Medha Pariksha 2026-2027',
  alternateName: [
    'Abdul Kalam Medha Pariksha',
    'Kalam Medha Pariksha',
    'G Goodwill Trust National Talent Hunt',
  ],
  description:
    'National merit scholarship examination and talent search test for school students from Classes 6 to 12. Combined Mega Cash Prizes across all categories: 1st ₹21,000, 2nd ₹11,000, 3rd ₹5,100 with Championship Trophies and Merit Certificates.',
  startDate: '2026-11-01T00:00:00+05:30',
  endDate: '2026-12-31T23:59:59+05:30',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  image: [
    'https://www.ggoodwilltrust.org/medha-pariksha-og.png',
    'https://www.ggoodwilltrust.org/logo.png',
  ],
  location: {
    '@type': 'Place',
    name: 'Designated Examination Centres across Delhi NCR & Partner Institutions',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'G-48 Shaheen Bagh, Okhla',
      addressLocality: 'New Delhi',
      addressRegion: 'Delhi',
      postalCode: '110025',
      addressCountry: 'IN',
    },
  },
  organizer: {
    '@type': 'NGO',
    name: 'G Goodwill Trust',
    url: 'https://www.ggoodwilltrust.org',
    logo: 'https://www.ggoodwilltrust.org/logo.png',
    telephone: '+91 79828 04385',
    email: 'globalgoodwill4@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'G-48 Shaheen Bagh, Okhla',
      addressLocality: 'New Delhi',
      addressRegion: 'Delhi',
      postalCode: '110025',
      addressCountry: 'IN',
    },
  },
  offers: {
    '@type': 'Offer',
    name: 'Candidate Examination & Registration Fee',
    price: '100',
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
    validFrom: '2026-11-01T00:00:00+05:30',
    validThrough: '2026-12-31T23:59:59+05:30',
    url: 'https://www.ggoodwilltrust.org/medha-pariksha',
  },
  sponsor: [
    { '@type': 'Organization', name: 'Spread Smiles Foundation' },
    { '@type': 'Organization', name: 'No Crying Foundation' },
    { '@type': 'Organization', name: 'Musawat Welfare Trust' },
    { '@type': 'Organization', name: 'Nayab Training & Educational Trust' },
    { '@type': 'Organization', name: 'Buniyadi Sahara Trust' },
    { '@type': 'Organization', name: 'Zarnetic' },
    { '@type': 'Organization', name: 'Arshi Cafe' },
  ],
};

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Dr. A.P.J. Abdul Kalam Medha Pariksha?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dr. A.P.J. Abdul Kalam Medha Pariksha is an esteemed national merit examination organized by G Goodwill Trust for students of Classes 6 to 12 to identify, reward, and nurture young academic talent across India.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the Combined Grand Championship prizes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The 3 Grand Winners across all categories receive: 1st Prize ₹21,000 + Trophy + Certificate; 2nd Prize ₹11,000 + Trophy + Certificate; 3rd Prize ₹5,100 + Trophy + Certificate. Every registered participant who attends the exam is awarded an official Certificate of Participation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who is eligible to participate in the examination?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Students studying in Classes 6 to 12 in any recognized educational board (CBSE, ICSE, State Boards, NIOS) can apply across three categories: Sub-Junior (Classes 6-8), Junior (Classes 9-10), and Senior (Classes 11-12).',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the registration fee and how can I pay?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The registration fee is ₹100 only. Candidates can pay securely online via UPI, Google Pay, PhonePe, Paytm, Debit Card, Credit Card, or Net Banking on the official registration portal.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the last date to submit the application?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The final date to register for Dr. A.P.J. Abdul Kalam Medha Pariksha is December 31, 2026 (31.12.2026).',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I download my candidate fee receipt and admit card?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Upon successful payment of ₹100, an official verified receipt with your Registration Number is generated immediately. You can download, print, or share it anytime by entering your registered mobile number on the portal.',
      },
    },
  ],
};

const jsonLdBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.ggoodwilltrust.org',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Scholarship Programs',
      item: 'https://www.ggoodwilltrust.org/scholarship',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Dr. A.P.J. Abdul Kalam Medha Pariksha',
      item: 'https://www.ggoodwilltrust.org/medha-pariksha',
    },
  ],
};

export default function MedhaParikshaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Search Engine Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEvent) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      {children}
    </>
  );
}
