import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Donation } from '@/lib/models/Schema';
import { sanitize, validateEmail, validateName, validateAmount, validatePAN } from '@/lib/validate';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, phone, pan, amount, purpose } = body;

    if (!validateName(name)) {
      return NextResponse.json({ success: false, message: 'Invalid name.' }, { status: 400 });
    }
    if (!validateEmail(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email.' }, { status: 400 });
    }
    if (!validateAmount(amount)) {
      return NextResponse.json({ success: false, message: 'Invalid amount.' }, { status: 400 });
    }
    if (pan && typeof validatePAN === 'function' && !validatePAN(pan)) {
       return NextResponse.json({ success: false, message: 'Invalid PAN.' }, { status: 400 });
    }

    const sanitizedName = sanitize(name);
    const sanitizedEmail = sanitize(email);
    const sanitizedPhone = sanitize(phone || '');
    const sanitizedPan = sanitize(pan || '');
    const sanitizedPurpose = sanitize(purpose || 'General Donation');

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const receipt_no = 'GGT-' + new Date().getFullYear() + '-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    const orderOptions = {
      amount: Math.round(Number(amount) * 100), // amount in paise
      currency: 'INR',
      receipt: receipt_no,
    };

    const order = await razorpay.orders.create(orderOptions);

    const newDonation = new Donation({
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

    return NextResponse.json({ success: true, order, receipt_no });
  } catch (error) {
    console.error('Create Order API error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
