import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import SYSTEM_CONFIG from '../../../system';
import LogoutButton from '@/components/LogoutButton';

export default async function StudentDashboard() {
  const session = await getSession();
  
  if (!session || session.role !== 'student') {
    redirect('/student/register');
  }

  const quizPacks = await prisma.quizPack.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: { questions: true, attempts: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Group by subject
  const groupedPacks = quizPacks.reduce((acc, pack) => {
    if (!acc[pack.subject]) acc[pack.subject] = [];
    acc[pack.subject].push(pack);
    return acc;
  }, {} as Record<string, typeof quizPacks>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {SYSTEM_CONFIG.app.name}
              </h1>
              <p className="text-sm text-gray-600">Halo, {session.name}!</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-6">Pilih Mata Pelajaran</h2>

        {Object.keys(groupedPacks).length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">Belum ada paket soal tersedia</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedPacks).map(([subject, packs]) => (
              <div key={subject}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  {subject}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {packs.map((pack) => (
                    <Link
                      key={pack.id}
                      href={`/student/quiz/${pack.id}`}
                      className="card hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-semibold mb-2">{pack.title}</h4>
                      {pack.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {pack.description}
                        </p>
                      )}
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>📝 {pack._count.questions} soal</span>
                        <span>⏱️ {pack.duration} menit</span>
                      </div>
                      <div className="mt-3 text-xs text-blue-600">
                        {pack._count.attempts} siswa telah mengerjakan
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
