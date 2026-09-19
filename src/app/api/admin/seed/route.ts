import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Program, GDocument, Certificate, HeroSlide, Partner, Testimonial, SiteSetting } from '@/lib/models/Schema';

export async function POST() {
  try {
    await connectDB();

    // 1. Seed Hero Slides
    const existingHero = await HeroSlide.countDocuments();
    if (existingHero === 0) {
      await HeroSlide.create([
        {
          tag: 'Chapter 01 • Education',
          headline: 'Nurturing young minds with dignity, books & dreams',
          image_url: '/assets/hompage1.jpg',
          order: 1,
          active: true,
        },
        {
          tag: 'Chapter 02 • Healthcare',
          headline: 'Bringing vital medical expertise to underserved communities',
          image_url: '/assets/hompage2.jpg',
          order: 2,
          active: true,
        },
        {
          tag: 'Chapter 03 • Sustenance',
          headline: 'Direct food security & emergency humanitarian aid',
          image_url: '/assets/hompage3.jpg',
          order: 3,
          active: true,
        },
        {
          tag: 'Chapter 04 • Empowerment',
          headline: 'Vocational avenues fostering financial independence',
          image_url: '/assets/hompage4.jpg',
          order: 4,
          active: true,
        },
        {
          tag: 'Chapter 05 • Brotherhood',
          headline: 'Spreading harmony and grassroots care across New Delhi',
          image_url: '/assets/hompage5.jpg',
          order: 5,
          active: true,
        },
      ]);
    }

    // 2. Seed Brand Partners & Alliances
    const existingPartners = await Partner.countDocuments();
    if (existingPartners === 0) {
      await Partner.create([
        {
          name: 'The Times of India',
          subtitle: 'Media & Civic Outreach',
          badge: 'Media Alliance',
          logo_url: '/partners/times-of-india.svg',
          order: 1,
          active: true,
        },
        {
          name: 'Colgate',
          subtitle: 'Oral Health & Hygiene Camps',
          badge: 'Health Partner',
          logo_url: '/partners/colgate.svg',
          order: 2,
          active: true,
        },
        {
          name: 'Vidyanjali',
          subtitle: 'Ministry of Education, Govt. of India',
          badge: 'Govt. Initiative',
          logo_url: '/partners/vidyanjali.png',
          order: 3,
          active: true,
        },
        {
          name: 'British Council',
          subtitle: 'International Education & Cultural Relations',
          badge: 'Global Council',
          logo_url: '/partners/british-council.svg',
          order: 4,
          active: true,
        },
        {
          name: 'Mercedes-Benz',
          subtitle: 'Corporate Social Responsibility (CSR)',
          badge: 'CSR Partner',
          logo_url: '/partners/mercedes-benz.svg',
          order: 5,
          active: true,
        },
        {
          name: 'Zarnetic',
          subtitle: 'Digital Infrastructure & IT Operations',
          badge: 'Technology Partner',
          logo_url: '/partners/zarnetic.svg',
          order: 6,
          active: true,
        },
        {
          name: 'NCF',
          subtitle: 'Noble Citizen Foundation',
          badge: 'Civic Foundation',
          logo_url: '/partners/ncf.webp',
          order: 7,
          active: true,
        },
        {
          name: 'Spread Smiles Foundation',
          subtitle: 'Grassroots Community & Child Welfare',
          badge: 'Community NGO',
          logo_url: '/partners/spread-smiles.svg',
          order: 8,
          active: true,
        },
      ]);
    }

    // 3. Seed Testimonials
    const existingTestimonials = await Testimonial.countDocuments();
    if (existingTestimonials === 0) {
      await Testimonial.create([
        { name: 'Mohd Minhaj Alam', review: 'Amazing NGO doing real, impactful work on the ground in Shaheen Bagh. Truly inspiring commitment.', time: '2 weeks ago', rating: 5, active: true },
        { name: 'Dr. Bushra Shams', review: 'Very transparent and dedicated team. Their educational relief camps genuinely transform needy children.', time: '1 month ago', rating: 5, active: true },
        { name: 'Suhaib Abbasi', review: 'Proud to see the grassroots footprint of G Goodwill Trust. Professional, genuine, and selfless.', time: '2 months ago', rating: 5, active: true },
        { name: 'Farid Baig', review: 'Commendable ration relief drives. You can see your donation reaching right into the hands of widows and daily wagers.', time: '3 months ago', rating: 5, active: true },
        { name: 'Zainab Khan', review: 'Attended their free health camp in Okhla. Free doctors, diagnostics and medicine for all without bias.', time: '1 month ago', rating: 5, active: true },
      ]);
    }

    // 4. Seed Impact Stats & Settings
    await SiteSetting.findOneAndUpdate(
      { key: 'stat_rations' },
      { key: 'stat_rations', value: 2000 },
      { upsert: true }
    );
    await SiteSetting.findOneAndUpdate(
      { key: 'stat_rakhis' },
      { key: 'stat_rakhis', value: 5100 },
      { upsert: true }
    );
    await SiteSetting.findOneAndUpdate(
      { key: 'stat_beneficiaries' },
      { key: 'stat_beneficiaries', value: 1100 },
      { upsert: true }
    );
    await SiteSetting.findOneAndUpdate(
      { key: 'stat_clinics' },
      { key: 'stat_clinics', value: 1000 },
      { upsert: true }
    );

    // 5. Seed Programs
    const existingPrograms = await Program.countDocuments();
    if (existingPrograms === 0) {
      await Program.create([
        {
          title: 'Education Initiatives & Scholarships',
          description: 'Providing merit-based scholarships, school supplies, free winter sweaters, and vocational computer training to empower underprivileged children in New Delhi.',
          image_urls: ['/assets/hompage1.jpg'],
        },
        {
          title: 'Community Healthcare & Medical Camps',
          description: 'Bringing vital preventive healthcare directly to grassroots levels in Shaheen Bagh and Okhla through free general health check-ups, dental camps, and diagnostic drives.',
          image_urls: ['/assets/hompage2.jpg'],
        },
        {
          title: 'Poverty Alleviation & Ration Relief Drives',
          description: 'Delivering immediate humanitarian relief, monthly nutrition kits, clothing distribution, and emergency assistance to vulnerable and marginalized families.',
          image_urls: ['/assets/hompage3.jpg'],
        },
      ]);
    }

    // 6. Seed Official Documents
    const existingDocs = await GDocument.countDocuments();
    if (existingDocs === 0) {
      await GDocument.create([
        {
          title: '80G Tax Exemption Certificate',
          description: 'Official 80G approval (Unique No: AAETG8344FF20241) granting 50% tax deductions to donors under Section 80G of the Indian Income Tax Act.',
          category: 'Certificates',
          file_url: 'https://ggoodwilltrust.org',
        },
        {
          title: 'Trust Registration Deed (Sep 30, 2024)',
          description: 'Official registration document and constitution of G Goodwill Trust under Reg No: 2024/10/IV/1387 in New Delhi.',
          category: 'Policies',
          file_url: 'https://ggoodwilltrust.org',
        },
        {
          title: 'Annual Community Impact Report',
          description: 'Comprehensive audited overview detailing grassroots relief drives, over 2,000 families fed, and healthcare initiatives.',
          category: 'Reports',
          file_url: 'https://ggoodwilltrust.org',
        },
      ]);
    }

    // 7. Seed Sample Certificates for Verification Testing
    const existingCerts = await Certificate.countDocuments();
    if (existingCerts === 0) {
      await Certificate.create([
        {
          title: 'Certificate of Course Completion',
          name: 'Mohd Zaid',
          enrollment_no: 'GGT-2026-101',
          dob: new Date('2005-06-15'),
          course: 'Vocational Digital Literacy',
          description: 'Successfully completed the 3-month basic computer training program with distinction.',
          grade: 'A+',
        },
        {
          title: 'Certificate of Merit & Scholarship',
          name: 'Ayesha Siddiqui',
          enrollment_no: 'GGT-2026-102',
          dob: new Date('2006-03-22'),
          course: 'Vidyanjali Educational Support Program',
          description: 'Awarded for exceptional academic dedication in high school studies.',
          grade: 'Exemplary',
        },
      ]);
    }

    return NextResponse.json({
      success: true,
      message: 'Initial data (Hero, Partners, Stats, Testimonials, Programs, Docs) seeded successfully into MongoDB!',
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Database seeding failed',
    }, { status: 500 });
  }
}
