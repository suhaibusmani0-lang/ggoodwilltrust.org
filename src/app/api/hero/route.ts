import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { HeroSlide } from '@/lib/models/Schema';

export async function GET() {
  try {
    await connectDB();
    const slides = await HeroSlide.find({ active: { $ne: false } }).sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({ success: true, data: slides });
  } catch (error: any) {
    console.error('Hero API GET error:', error);
    return NextResponse.json({ success: false, data: [], error: error.message || 'Database error' });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { headline, tag, image_url, order, active } = body;

    if (!headline || !image_url) {
      return NextResponse.json({ success: false, message: 'Headline and Image URL are required' }, { status: 400 });
    }

    const newSlide = await HeroSlide.create({
      headline,
      tag: tag || 'Initiative',
      image_url,
      order: typeof order === 'number' ? order : 0,
      active: active !== false,
    });

    return NextResponse.json({ success: true, data: newSlide });
  } catch (error: any) {
    console.error('Hero API POST error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to create slide' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, headline, tag, image_url, order, active } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Slide ID is required' }, { status: 400 });
    }

    const updated = await HeroSlide.findByIdAndUpdate(
      id,
      {
        ...(headline && { headline }),
        ...(tag !== undefined && { tag }),
        ...(image_url && { image_url }),
        ...(typeof order === 'number' && { order }),
        ...(typeof active === 'boolean' && { active }),
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Hero API PUT error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to update slide' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Slide ID is required' }, { status: 400 });
    }

    await HeroSlide.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Hero slide deleted successfully' });
  } catch (error: any) {
    console.error('Hero API DELETE error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to delete slide' }, { status: 500 });
  }
}

