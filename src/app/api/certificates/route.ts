import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Certificate } from '@/lib/models/Schema';

export async function GET() {
  try {
    await connectDB();
    const certificates = await Certificate.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, certificates });
  } catch (error) {
    console.error('Certificates GET error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { enrollment_no, dob } = body;

    if (!enrollment_no || !dob) {
      return NextResponse.json({ success: false, message: 'Enrollment number and Date of Birth are required.' }, { status: 400 });
    }

    const certificate = await Certificate.findOne({
      enrollment_no: { $regex: new RegExp(`^${enrollment_no}$`, 'i') },
      dob: dob,
    }).lean();

    if (!certificate) {
      return NextResponse.json({ success: false, message: 'Certificate not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, certificate });
  } catch (error) {
    console.error('Certificates POST error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
