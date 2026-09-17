import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { GDocument } from '@/lib/models/Schema';

export async function GET() {
  try {
    await connectDB();
    const documents = await GDocument.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: documents, documents });
  } catch (error) {
    console.error('Documents API error:', error);
    return NextResponse.json({ success: true, data: [], documents: [], error: 'Database connection failed' });
  }
}
