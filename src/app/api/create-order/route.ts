import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Donation } from '@/lib/models/Schema';
import { sanitize, validateEmail, validateName, validateAmount, validatePAN } from '@/lib/validate';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, pan, amount, purpose } = body;

    // Validate inputs
    if (!validateName(name)) {
      return NextResponse.json({ success: false, message: 'Invalid name.' }, { status: 400 });
    }
    if (!validateEmail(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email.' }, { status: 400 });
    }
    if (!validateAmount(Number(amount))) {
      return NextResponse.json({ success: false, message: 'Invalid amount. Must be between ₹1 and ₹10,00,000.' }, { status: 400 });
    }
    if (pan && !validatePAN(pan)) {
      return NextResponse.json({ success: false, message: 'Invalid PAN format.' }, { status: 400 });
    }

    const sanitizedName = sanitize(name);
    const sanitizedEmail = sanitize(email);
    const sanitizedPhone = sanitize(phone || '');
    const sanitizedPan = sanitize(pan || '');
    const sanitizedPurpose = sanitize(purpose || 'General Donation');

    // Verify Razorpay credentials exist
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      console.error('Razorpay credentials missing: KEY_ID=', !!keyId, 'KEY_SECRET=', !!keySecret);
      return NextResponse.json({ success: false, message: 'Payment gateway configuration error.' }, { status: 500 });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const receipt_no = 'GGT-' + new Date().getFullYear() + '-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    // Create Razorpay order
    let order;
    try {
      order = await razorpay.orders.create({
        amount: Math.round(Number(amount) * 100),
        currency: 'INR',
        receipt: receipt_no,
      });
    } catch (rzpError: unknown) {
      const msg = rzpError instanceof Error ? rzpError.message : 'Unknown Razorpay error';
      console.error('Razorpay order creation failed:', msg);
      return NextResponse.json({ success: false, message: 'Payment gateway error. Please try again.' }, { status: 502 });
    }

    // Save to MongoDB (with receipt_no!)
    try {
      await connectDB();
      const newDonation = new Donation({
        receipt_no,
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        pan: sanitizedPan,
        amount: Number(amount),
        purpose: sanitizedPurpose,
        razorpay_order_id: order.id,
        payment_status: 'pending',
      });
      await newDonation.save();
    } catch (dbError) {
      // Order is created in Razorpay but DB save failed — still return the order
      console.error('DB save failed (order still valid):', dbError);
    }

    return NextResponse.json({ success: true, order, receipt_no });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Create Order API error:', msg);
    return NextResponse.json({ success: false, message: 'Internal server error. Please try again.' }, { status: 500 });
  }
}
