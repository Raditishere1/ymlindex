import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import SYSTEM_CONFIG from '../../../../system';

export async function POST(request: NextRequest) {
  try {
    const { quizPackId, studentId, answers, duration } = await request.json();
    const quizPack = await prisma.quizPack.findUnique({
      where: { id: quizPackId },
      include: { questions: true },
    });
    if (!quizPack) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    
    let correctCount = 0;
    quizPack.questions.forEach((q) => {
      const userAnswer = answers[q.id];
      const correctAnswer = JSON.parse(q.correctAnswer);
      if (q.type === 'multiple') {
        const userArr = userAnswer || [];
        if (JSON.stringify(userArr.sort()) === JSON.stringify(correctAnswer.sort())) correctCount++;
      } else {
        if (userAnswer === correctAnswer) correctCount++;
      }
    });
    
    const score = correctCount * SYSTEM_CONFIG.scoring.correctAnswer;
    const attempt = await prisma.attempt.create({
      data: {
        studentId, quizPackId,
        answers: JSON.stringify(answers),
        score, totalQuestions: quizPack.questions.length,
        correctCount, duration,
        startedAt: new Date(Date.now() - duration * 1000),
      },
    });
    return NextResponse.json({ success: true, attemptId: attempt.id, score });
  } catch (error) {
    return NextResponse.json({ error: 'Submit failed' }, { status: 500 });
  }
}
