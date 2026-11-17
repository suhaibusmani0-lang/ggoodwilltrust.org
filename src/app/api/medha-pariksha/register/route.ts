import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ScholarshipRegistration } from '@/lib/models/Schema';
import { sanitize } from '@/lib/validate';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      student_name,
      guardian_name,
      category,
      school_name,
      city,
      phone,
      email,
    } = body;

    // Validate inputs
    if (!student_name || typeof student_name !== 'string' || student_name.trim().length < 2) {
      return NextResponse.json({ success: false, message: 'Please enter a valid student name.' }, { status: 400 });
    }
    if (!guardian_name || typeof guardian_name !== 'string' || guardian_name.trim().length < 2) {
      return NextResponse.json({ success: false, message: 'Please enter a valid father/mother/guardian name.' }, { status: 400 });
    }
    if (!school_name || typeof school_name !== 'string' || school_name.trim().length < 2) {
      return NextResponse.json({ success: false, message: 'Please enter the school or college name.' }, { status: 400 });
    }
    if (!city || typeof city !== 'string' || city.trim().length < 2) {
      return NextResponse.json({ success: false, message: 'Please enter city and state.' }, { status: 400 });
    }
    if (!phone || typeof phone !== 'string' || phone.trim().length < 10) {
      return NextResponse.json({ success: false, message: 'Please enter a valid 10-digit mobile/WhatsApp number.' }, { status: 400 });
    }
    if (!category || typeof category !== 'string') {
      return NextResponse.json({ success: false, message: 'Please select an examination category.' }, { status: 400 });
    }

    const sanitizedStudentName = sanitize(student_name.trim());
    const sanitizedGuardianName = sanitize(guardian_name.trim());
    const sanitizedCategory = sanitize(category.trim());
    const sanitizedSchoolName = sanitize(school_name.trim());
    const sanitizedCity = sanitize(city.trim());
    const sanitizedPhone = sanitize(phone.trim());
    const sanitizedEmail = email ? sanitize(email.trim().toLowerCase()) : '';

    const year = new Date().getFullYear();
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const registration_no = `AKMP-${year}-${randomDigits}`;
    const receipt_no = `GGT-MP-${Math.floor(100000 + Math.random() * 900000)}`;

    const amountInRupees = 100;
    const amountInPaise = amountInRupees * 100;

    // Razorpay setup
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.warn('Razorpay credentials missing in environment.');
      return NextResponse.json({
        success: false,
        message: 'Payment gateway configuration is missing. Please contact trust helpline.',
      }, { status: 500 });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    let order;
    try {
      order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: receipt_no,
        notes: {
          exam: 'Dr. A.P.J. Abdul Kalam Medha Pariksha',
          registration_no,
          student_name: sanitizedStudentName,
          category: sanitizedCategory,
          phone: sanitizedPhone,
        },
      });
    } catch (rzpErr: unknown) {
      const msg = rzpErr instanceof Error ? rzpErr.message : 'Unknown Razorpay error';
      console.error('Razorpay order creation failed for Kalam Medha Pariksha:', msg);
      return NextResponse.json({
        success: false,
        message: 'Failed to initiate payment with gateway. Please try again.',
      }, { status: 502 });
    }

    // Connect DB & Save Pending Registration for Full Backend Transparency
    await connectDB();
    const newReg = new ScholarshipRegistration({
      registration_no,
      receipt_no,
      student_name: sanitizedStudentName,
      guardian_name: sanitizedGuardianName,
      category: sanitizedCategory,
      school_name: sanitizedSchoolName,
      city: sanitizedCity,
      phone: sanitizedPhone,
      email: sanitizedEmail,
      amount: amountInRupees,
      razorpay_order_id: order.id,
      payment_status: 'pending',
      exam_name: 'Dr. A.P.J. Abdul Kalam Medha Pariksha',
    });

    await newReg.save();

    return NextResponse.json({
      success: true,
      order,
      registration_no,
      receipt_no,
      amount: amountInRupees,
      key_id: keyId,
      student_name: sanitizedStudentName,
      category: sanitizedCategory,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Kalam Medha Pariksha registration error:', msg);
    return NextResponse.json({
      success: false,
      message: 'Failed to process registration. Please check your details and retry.',
    }, { status: 500 });
  }
}
