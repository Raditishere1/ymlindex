import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminQuizDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/admin/login');

  const quizPack = await prisma.quizPack.findUnique({
    where: { id: params.id },
    include: {
      questions: { orderBy: { orderIndex: 'asc' } },
      attempts: {
        include: { student: true },
        orderBy: { submittedAt: 'desc' },
        take: 50,
      },
    },
  });

  if (!quizPack) redirect('/admin/dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <Link href="/admin/dashboard" className="text-blue-600 hover:underline mb-2 inline-block">
            ← Kembali ke Dashboard
          </Link>
          <h1 className="text-2xl font-bold">{quizPack.title}</h1>
          <p className="text-gray-600">{quizPack.subject}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Info Paket</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Durasi:</dt>
                <dd className="font-semibold">{quizPack.duration} menit</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Jumlah Soal:</dt>
                <dd className="font-semibold">{quizPack.questions.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Total Attempt:</dt>
                <dd className="font-semibold">{quizPack.attempts.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Status:</dt>
                <dd>
                  <span className={`px-2 py-1 rounded text-xs ${quizPack.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                    {quizPack.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Statistik</h2>
            {quizPack.attempts.length === 0 ? (
              <p className="text-gray-500 text-sm">Belum ada yang mengerjakan</p>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Rata-rata Skor:</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(quizPack.attempts.reduce((sum, a) => sum + a.score, 0) / quizPack.attempts.length)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Skor Tertinggi:</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.max(...quizPack.attempts.map(a => a.score))}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card mt-6">
          <h2 className="text-xl font-semibold mb-4">Hasil Siswa</h2>
          {quizPack.attempts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Belum ada hasil</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="pb-2">Nama Siswa</th>
                    <th className="pb-2">Skor</th>
                    <th className="pb-2">Benar</th>
                    <th className="pb-2">Waktu</th>
                    <th className="pb-2">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {quizPack.attempts.map((attempt) => (
                    <tr key={attempt.id} className="border-b last:border-0">
                      <td className="py-2">{attempt.student.name}</td>
                      <td className="py-2 font-semibold text-blue-600">{attempt.score}</td>
                      <td className="py-2">{attempt.correctCount}/{attempt.totalQuestions}</td>
                      <td className="py-2">
                        {Math.floor(attempt.duration / 60)}:{(attempt.duration % 60).toString().padStart(2, '0')}
                      </td>
                      <td className="py-2 text-gray-600">
                        {new Date(attempt.submittedAt).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
