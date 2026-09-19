import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'jofrbqku',
  api_key: process.env.CLOUDINARY_API_KEY || '334686696886189',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Oxm4VBRyOHUR5mrMzxRkdKv6Nv8',
  secure: true,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const customFolder = formData.get('folder') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    // Determine destination folder in Cloudinary
    const targetFolder = customFolder 
      ? `ggoodwilltrust/${customFolder.replace(/[^a-zA-Z0-9_-]/g, '')}`
      : 'ggoodwilltrust/uploads';

    // Convert file to base64 data URI
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mime = file.type || 'image/jpeg';
    const base64 = `data:${mime};base64,${buffer.toString('base64')}`;

    // Upload directly to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: targetFolder,
      resource_type: 'auto',
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Image upload failed' },
      { status: 500 }
    );
  }
}
