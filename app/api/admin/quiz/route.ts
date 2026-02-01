import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { saveImageLocally } from '@/lib/upload';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const subject = formData.get('subject') as string;
    const description = formData.get('description') as string;
    const duration = parseInt(formData.get('duration') as string);
    const questionCount = parseInt(formData.get('questionCount') as string);

    const quizPack = await prisma.quizPack.create({
      data: { title, subject, description, duration },
    });

    for (let i = 0; i < questionCount; i++) {
      const imageFile = formData.get(`question_${i}_image`) as File | null;
      let imageUrl = null;
      
      if (imageFile) {
        imageUrl = await saveImageLocally(imageFile);
      }

      const questionText = formData.get(`question_${i}_text`) as string;
      const type = formData.get(`question_${i}_type`) as string;
      const options = formData.get(`question_${i}_options`) as string;
      const correctRaw = formData.get(`question_${i}_correct`) as string;
      const explanation = formData.get(`question_${i}_explanation`) as string;

      let correctAnswer;
      if (type === 'multiple') {
        correctAnswer = JSON.stringify(correctRaw.split(',').map(s => s.trim()));
      } else {
        correctAnswer = JSON.stringify(correctRaw.trim());
      }

      await prisma.question.create({
        data: {
          quizPackId: quizPack.id,
          questionText,
          imageUrl,
          type,
          options,
          correctAnswer,
          explanation,
          orderIndex: i,
        },
      });
    }

    return NextResponse.json({ success: true, quizPackId: quizPack.id });
  } catch (error) {
    console.error('Create quiz error:', error);
    return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
  }
}
