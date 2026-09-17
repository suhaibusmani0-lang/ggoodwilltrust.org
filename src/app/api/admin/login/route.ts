import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required.' }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL || '';
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || '';

    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, adminPasswordHash);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const token = Date.now().toString(36) + Math.random().toString(36);

    const response = NextResponse.json({ success: true });
    
    response.cookies.set('admin_session', token, {
      maxAge: 86400,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin login API error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
