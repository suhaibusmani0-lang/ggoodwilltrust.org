import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Program } from '@/lib/models/Schema';

export async function GET() {
  try {
    await connectDB();
    const programs = await Program.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: programs, programs });
  } catch (error) {
    console.error('Programs API error:', error);
    // Return empty list gracefully instead of crashing the UI
    return NextResponse.json({ success: true, data: [], programs: [], error: 'Database connection failed' });
  }
}
