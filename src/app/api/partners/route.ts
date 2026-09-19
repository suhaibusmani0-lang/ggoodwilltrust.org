import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Partner } from '@/lib/models/Schema';

export async function GET() {
  try {
    await connectDB();
    const partners = await Partner.find({ active: { $ne: false } }).sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({ success: true, data: partners });
  } catch (error: any) {
    console.error('Partners API GET error:', error);
    return NextResponse.json({ success: false, data: [], error: error.message || 'Database error' });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, subtitle, badge, logo_url, order, active } = body;

    if (!name || !logo_url) {
      return NextResponse.json({ success: false, message: 'Partner name and Logo URL are required' }, { status: 400 });
    }

    const newPartner = await Partner.create({
      name,
      subtitle: subtitle || '',
      badge: badge || 'Partner',
      logo_url,
      order: typeof order === 'number' ? order : 0,
      active: active !== false,
    });

    return NextResponse.json({ success: true, data: newPartner });
  } catch (error: any) {
    console.error('Partner API POST error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to create partner' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, name, subtitle, badge, logo_url, order, active } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Partner ID is required' }, { status: 400 });
    }

    const updated = await Partner.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(subtitle !== undefined && { subtitle }),
        ...(badge !== undefined && { badge }),
        ...(logo_url && { logo_url }),
        ...(typeof order === 'number' && { order }),
        ...(typeof active === 'boolean' && { active }),
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Partner not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Partner API PUT error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to update partner' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Partner ID is required' }, { status: 400 });
    }

    await Partner.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Partner deleted successfully' });
  } catch (error: any) {
    console.error('Partner API DELETE error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to delete partner' }, { status: 500 });
  }
}

