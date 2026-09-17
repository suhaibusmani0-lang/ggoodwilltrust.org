import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { sanitize, validateEmail, validatePhone, validateName, validateMessage, checkRateLimit } from '@/lib/validate';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    // Rate limit: 5 requests per hour (3600000 ms)
    if (!checkRateLimit(ip, 5, 3600000)) {
      return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const { name, email, phone, subject, message } = body;

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
    if (!subject || subject.length < 2 || subject.length > 200) {
      return NextResponse.json({ success: false, message: 'Invalid subject length.' }, { status: 400 });
    }
    if (!validateMessage(message)) {
      return NextResponse.json({ success: false, message: 'Invalid message length (5-2000 characters required).' }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedName = sanitize(name);
    const sanitizedEmail = sanitize(email);
    const sanitizedPhone = sanitize(phone);
    const sanitizedSubject = sanitize(subject);
    const sanitizedMessage = sanitize(message);

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
      subject: `New Contact Form Submission: ${sanitizedSubject}`,
      text: `
        Name: ${sanitizedName}
        Email: ${sanitizedEmail}
        Phone: ${sanitizedPhone}
        Subject: ${sanitizedSubject}
        Message:
        ${sanitizedMessage}
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
