#!/bin/bash

# Admin Dashboard
cat > app/admin/dashboard/page.tsx << 'EOF'
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/admin/login');

  const quizPacks = await prisma.quizPack.findMany({
    include: { _count: { select: { questions: true, attempts: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Paket Soal</h2>
          <Link href="/admin/quiz/create" className="btn-primary">
            + Buat Paket Baru
          </Link>
        </div>

        {quizPacks.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">Belum ada paket soal</p>
            <Link href="/admin/quiz/create" className="btn-primary inline-block mt-4">
              Buat Paket Pertama
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizPacks.map((pack) => (
              <Link key={pack.id} href={`/admin/quiz/${pack.id}`} className="card hover:shadow-md">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{pack.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${pack.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                    {pack.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{pack.subject}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>📝 {pack._count.questions} soal</span>
                  <span>👥 {pack._count.attempts} attempt</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
EOF

# Admin Create Quiz
cat > app/admin/quiz/create/page.tsx << 'EOF'
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import QuizForm from '@/components/QuizForm';

export default async function CreateQuizPage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/admin/login');

  return <QuizForm />;
}
EOF

echo "Admin pages created"
