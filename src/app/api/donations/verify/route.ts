import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Donation } from '@/lib/models/Schema';

export async function POST(req: NextRequest) {
  try {
    const { receipt_no } = await req.json();

    if (!receipt_no || typeof receipt_no !== 'string' || receipt_no.trim().length < 5) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid receipt number' },
        { status: 400 }
      );
    }

    await connectDB();

    const donation = await Donation.findOne({
      receipt_no: receipt_no.trim().toUpperCase(),
      payment_status: 'completed',
    }).lean();

    if (!donation) {
      return NextResponse.json(
        { success: false, message: 'No completed donation found with this receipt number' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: donation });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}

