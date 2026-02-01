import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/session';
import SYSTEM_CONFIG from '../../../../system';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const { username: adminUsername, password: adminPassword, displayName } = 
      SYSTEM_CONFIG.adminAccount;

    if (username === adminUsername && password === adminPassword) {
      await createSession({
        userId: 'admin-' + Date.now(),
        role: 'admin',
        name: displayName,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Username atau password salah' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}
