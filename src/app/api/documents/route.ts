import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, description, category, file_url } = body;

    if (!title) {
      return NextResponse.json({ success: false, message: 'Title is required' }, { status: 400 });
    }

    const newDoc = await GDocument.create({
      title,
      description,
      category: category || 'Reports',
      file_url: file_url || '',
    });

    return NextResponse.json({ success: true, data: newDoc });
  } catch (error: any) {
    console.error('Document creation error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to create document' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Document ID is required' }, { status: 400 });
    }

    await GDocument.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Document deleted successfully' });
  } catch (error: any) {
    console.error('Document deletion error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to delete document' }, { status: 500 });
  }
}
