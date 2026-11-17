import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ScholarshipRegistration } from '@/lib/models/Schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== 'string' || query.trim().length < 5) {
      return NextResponse.json({
        success: false,
        message: 'Please enter a valid Registration Number or 10-digit Mobile Number.',
      }, { status: 400 });
    }

    const trimmed = query.trim();

    await connectDB();

    // Look for registration by Registration No or Phone
    const registration = await ScholarshipRegistration.findOne({
      $or: [
        { registration_no: trimmed.toUpperCase() },
        { receipt_no: trimmed.toUpperCase() },
        { phone: trimmed },
      ],
    }).sort({ createdAt: -1 }).lean();

    if (!registration) {
      return NextResponse.json({
        success: false,
        message: 'No registration record found for the provided details. Please verify your Registration No or Mobile Number.',
      }, { status: 404 });
    }

    // STRICT CHECK: Payment MUST be completed!
    if (registration.payment_status !== 'completed') {
      return NextResponse.json({
        success: false,
        message: 'Fee payment is pending for this candidate. An official receipt is only generated and accessible after successful payment of the ₹100 registration fee.',
      }, { status: 402 }); // 402 Payment Required
    }

    return NextResponse.json({
      success: true,
      data: registration,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Fetch receipt error:', msg);
    return NextResponse.json({
      success: false,
      message: 'Failed to look up receipt. Please try again later.',
    }, { status: 500 });
  }
}
