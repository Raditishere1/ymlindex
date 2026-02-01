import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import QuizInterface from '@/components/QuizInterface';

export default async function QuizPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== 'student') redirect('/student/register');

  const quizPack = await prisma.quizPack.findUnique({
    where: { id: params.id },
    include: { questions: { orderBy: { orderIndex: 'asc' } } },
  });

  if (!quizPack) redirect('/student/dashboard');

  return <QuizInterface quizPack={quizPack} studentId={session.userId} />;
}
