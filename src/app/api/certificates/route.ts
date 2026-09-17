import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Certificate } from '@/lib/models/Schema';

export async function GET() {
  try {
    await connectDB();
    const certificates = await Certificate.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: certificates, certificates });
  } catch (error) {
    console.error('Certificates GET error:', error);
    return NextResponse.json({ success: true, data: [], certificates: [], error: 'Database connection failed' });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Check if this is a CREATE action from admin
    if (body.action === 'create' || (body.title && body.course)) {
      const { title, name, enrollment_no, dob, course, description, file_url, grade } = body;

      if (!title || !enrollment_no) {
        return NextResponse.json({ success: false, message: 'Title and Enrollment Number are required.' }, { status: 400 });
      }

      const newCert = await Certificate.create({
        title,
        name: name || '',
        enrollment_no: enrollment_no.trim().toUpperCase(),
        dob: dob ? new Date(dob) : undefined,
        course: course || '',
        description: description || '',
        file_url: file_url || '',
        grade: grade || 'A',
      });

      return NextResponse.json({ success: true, data: newCert });
    }

    // Otherwise this is a public verification check
    const { enrollment_no, dob } = body;

    if (!enrollment_no || !dob) {
      return NextResponse.json({ success: false, message: 'Enrollment number and Date of Birth are required.' }, { status: 400 });
    }

    const certificate = await Certificate.findOne({
      enrollment_no: { $regex: new RegExp(`^${enrollment_no.trim()}$`, 'i') },
    }).lean();

    if (!certificate) {
      return NextResponse.json({ success: false, message: 'Certificate not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: certificate, certificate });
  } catch (error: any) {
    console.error('Certificates POST error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Certificate ID is required' }, { status: 400 });
    }

    await Certificate.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Certificate deleted successfully' });
  } catch (error: any) {
    console.error('Certificate deletion error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to delete certificate' }, { status: 500 });
  }
}
