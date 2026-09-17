import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Program, GDocument, Certificate } from '@/lib/models/Schema';

export async function POST() {
  try {
    await connectDB();

    // 1. Seed Programs (only if collection is empty or force seed)
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

    // 2. Seed Official Documents
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

    // 3. Seed Sample Certificates for Verification Testing
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
      message: 'Initial data seeded successfully into MongoDB!',
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Database seeding failed',
    }, { status: 500 });
  }
}

