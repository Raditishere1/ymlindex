import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name || name.trim().length < 3) {
      return NextResponse.json(
        { error: 'Nama minimal 3 karakter' },
        { status: 400 }
      );
    }

    const student = await prisma.student.create({
      data: { name: name.trim() },
    });

    await createSession({
      userId: student.id,
      role: 'student',
      name: student.name,
    });

    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mendaftar' },
      { status: 500 }
    );
  }
}
