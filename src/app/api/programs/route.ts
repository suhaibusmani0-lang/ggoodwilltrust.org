import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Program } from '@/lib/models/Schema';

export async function GET() {
  try {
    await connectDB();
    const programs = await Program.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, programs });
  } catch (error) {
    console.error('Programs API error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
