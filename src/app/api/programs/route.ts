import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Program } from '@/lib/models/Schema';

export async function GET() {
  try {
    await connectDB();
    const programs = await Program.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: programs, programs });
  } catch (error) {
    console.error('Programs API error:', error);
    return NextResponse.json({ success: true, data: [], programs: [], error: 'Database connection failed' });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, description, image_urls } = body;

    if (!title) {
      return NextResponse.json({ success: false, message: 'Title is required' }, { status: 400 });
    }

    const newProgram = await Program.create({
      title,
      description,
      image_urls: Array.isArray(image_urls) ? image_urls : image_urls ? [image_urls] : [],
    });

    return NextResponse.json({ success: true, data: newProgram });
  } catch (error: any) {
    console.error('Program creation error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to create program' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Program ID is required' }, { status: 400 });
    }

    await Program.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Program deleted successfully' });
  } catch (error: any) {
    console.error('Program deletion error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to delete program' }, { status: 500 });
  }
}
