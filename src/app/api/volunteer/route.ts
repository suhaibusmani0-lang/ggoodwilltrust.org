import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { sanitize, validateEmail, validatePhone, validateName, validateMessage, checkRateLimit } from '@/lib/validate';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    // Rate limit: 3 requests per hour (3600000 ms)
    if (!checkRateLimit(ip, 3, 3600000)) {
      return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const { name, email, phone, city, reason } = body;

    // Validate inputs
    if (!validateName(name)) {
      return NextResponse.json({ success: false, message: 'Invalid name format or length (2-100 characters required).' }, { status: 400 });
    }
    if (!validateEmail(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email address.' }, { status: 400 });
    }
    if (!validatePhone(phone)) {
      return NextResponse.json({ success: false, message: 'Invalid phone number.' }, { status: 400 });
    }
    if (!city || city.length < 2 || city.length > 100) {
      return NextResponse.json({ success: false, message: 'Invalid city format.' }, { status: 400 });
    }
    if (!validateMessage(reason)) {
      return NextResponse.json({ success: false, message: 'Invalid reason length (5-2000 characters required).' }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedName = sanitize(name);
    const sanitizedEmail = sanitize(email);
    const sanitizedPhone = sanitize(phone);
    const sanitizedCity = sanitize(city);
    const sanitizedReason = sanitize(reason);

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Volunteer Registration: ${sanitizedName}`,
      text: `
        Name: ${sanitizedName}
        Email: ${sanitizedEmail}
        Phone: ${sanitizedPhone}
        City: ${sanitizedCity}
        Reason for volunteering:
        ${sanitizedReason}
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Registration successful!' });
  } catch (error) {
    console.error('Volunteer API error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
