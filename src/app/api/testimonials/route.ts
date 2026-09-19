import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Testimonial } from '@/lib/models/Schema';

export async function GET() {
  try {
    await connectDB();
    const reviews = await Testimonial.find({ active: { $ne: false } }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    console.error('Testimonials API GET error:', error);
    return NextResponse.json({ success: false, data: [], error: error.message || 'Database error' });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, review, time, rating, active } = body;

    if (!name || !review) {
      return NextResponse.json({ success: false, message: 'Name and review text are required' }, { status: 400 });
    }

    const newReview = await Testimonial.create({
      name,
      review,
      time: time || 'Recently',
      rating: typeof rating === 'number' ? rating : 5,
      active: active !== false,
    });

    return NextResponse.json({ success: true, data: newReview });
  } catch (error: any) {
    console.error('Testimonial API POST error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to create testimonial' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Testimonial ID is required' }, { status: 400 });
    }

    await Testimonial.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error: any) {
    console.error('Testimonial API DELETE error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to delete testimonial' }, { status: 500 });
  }
}

