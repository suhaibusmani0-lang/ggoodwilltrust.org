import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ScholarshipRegistration } from '@/lib/models/Schema';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      registration_no,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (!registration_no || !razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json({
        success: false,
        message: 'Incomplete transaction credentials received.',
      }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Verify signature if keySecret is available
    if (keySecret && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        console.error('Payment signature mismatch for Medha Pariksha registration:', registration_no);
        return NextResponse.json({
          success: false,
          message: 'Payment verification failed: Signature mismatch.',
        }, { status: 400 });
      }
    }

    await connectDB();

    const updated = await ScholarshipRegistration.findOneAndUpdate(
      {
        $or: [
          { registration_no: registration_no.toUpperCase() },
          { razorpay_order_id: razorpay_order_id },
        ],
      },
      {
        $set: {
          payment_status: 'completed',
          razorpay_payment_id,
        },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({
        success: false,
        message: 'Registration record not found to mark as completed.',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Registration and payment successfully verified!',
      data: updated,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Verify payment error for Medha Pariksha:', msg);
    return NextResponse.json({
      success: false,
      message: 'Payment verification encountered an internal error.',
    }, { status: 500 });
  }
}
