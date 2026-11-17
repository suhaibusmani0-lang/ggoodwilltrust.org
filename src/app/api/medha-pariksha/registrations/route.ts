import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ScholarshipRegistration } from '@/lib/models/Schema';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = Math.min(Number(searchParams.get('limit')) || 100, 200);

    await connectDB();

    const query: Record<string, unknown> = {};
    if (status && status !== 'all') {
      query.payment_status = status;
    }
    if (search) {
      query.$or = [
        { registration_no: { $regex: search, $options: 'i' } },
        { receipt_no: { $regex: search, $options: 'i' } },
        { student_name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { school_name: { $regex: search, $options: 'i' } },
      ];
    }

    const [registrations, totalCount, completedCount] = await Promise.all([
      ScholarshipRegistration.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean(),
      ScholarshipRegistration.countDocuments(),
      ScholarshipRegistration.countDocuments({ payment_status: 'completed' }),
    ]);

    return NextResponse.json({
      success: true,
      data: registrations,
      meta: {
        total: totalCount,
        completed: completedCount,
        totalFeesCollected: completedCount * 100,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Fetch registrations error:', msg);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve registrations.',
    }, { status: 500 });
  }
}
