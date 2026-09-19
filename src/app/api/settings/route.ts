import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { SiteSetting } from '@/lib/models/Schema';

// Default stats fallback
const DEFAULT_SETTINGS = {
  stat_rations: 2000,
  stat_rakhis: 5100,
  stat_beneficiaries: 1100,
  stat_clinics: 1000,
  phone: '+91 79828 04385',
  email: 'globalgoodwill4@gmail.com',
  address: 'G-48 Shaheen Bagh, Okhla, New Delhi - 110025, India',
};

export async function GET() {
  try {
    await connectDB();
    const settingsDocs = await SiteSetting.find({}).lean();
    
    // Convert array of key/value docs to a single object
    const settingsObj: Record<string, any> = { ...DEFAULT_SETTINGS };
    for (const doc of settingsDocs) {
      settingsObj[doc.key] = doc.value;
    }

    return NextResponse.json({ success: true, data: settingsObj });
  } catch (error: any) {
    console.error('Settings API GET error:', error);
    return NextResponse.json({ success: true, data: DEFAULT_SETTINGS, fallback: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Body can be an object with multiple key-value pairs e.g. { stat_rations: 2500, phone: '...' }
    const promises = Object.entries(body).map(([key, value]) =>
      SiteSetting.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true }
      )
    );

    await Promise.all(promises);

    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (error: any) {
    console.error('Settings API POST error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to update settings' }, { status: 500 });
  }
}

