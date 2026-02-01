import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function ResultPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== 'student') redirect('/student/register');

  const attempt = await prisma.attempt.findUnique({
    where: { id: params.id },
    include: { quizPack: true, student: true },
  });

  if (!attempt) redirect('/student/dashboard');

  const ranking = await prisma.attempt.findMany({
    where: { quizPackId: attempt.quizPackId },
    include: { student: true },
    orderBy: [{ score: 'desc' }, { duration: 'asc' }],
    take: 10,
  });

  const userRank = ranking.findIndex((a) => a.studentId === attempt.studentId) + 1;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card text-center mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold mb-2">Ujian Selesai!</h1>
            <p className="text-gray-600 mb-6">{attempt.quizPack.title}</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{attempt.score}</div>
                <div className="text-sm text-gray-600">Skor Total</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {attempt.correctCount}/{attempt.totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Benar</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.floor(attempt.duration / 60)}:{(attempt.duration % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-600">Waktu</div>
              </div>
            </div>

            {userRank > 0 && userRank <= 10 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
                <div className="text-2xl mb-1">🏆</div>
                <div className="font-semibold">Peringkat #{userRank}</div>
                <div className="text-sm text-gray-600">dari {ranking.length} peserta</div>
              </div>
            )}

            <Link href="/student/dashboard" className="btn-primary inline-block">
              Kembali ke Dashboard
            </Link>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">🏆 Top 10 Ranking</h2>
            <div className="space-y-2">
              {ranking.map((r, i) => (
                <div
                  key={r.id}
                  className={`flex items-center justify-between p-3 rounded ${
                    r.id === attempt.id ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-400">#{i + 1}</span>
                    <span className={r.id === attempt.id ? 'font-semibold' : ''}>
                      {r.student.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{r.score}</div>
                    <div className="text-xs text-gray-500">
                      {Math.floor(r.duration / 60)}:{(r.duration % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
