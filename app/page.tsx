import Link from 'next/link';
import SYSTEM_CONFIG from '../system';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            {SYSTEM_CONFIG.app.name}
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            {SYSTEM_CONFIG.app.tagline}
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="card bg-white">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-lg font-semibold mb-2">Multi Mata Pelajaran</h3>
              <p className="text-sm text-gray-600">
                {SYSTEM_CONFIG.app.subjects.length}+ mata pelajaran tersedia
              </p>
            </div>
            <div className="card bg-white">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-lg font-semibold mb-2">Ujian Terjadwal</h3>
              <p className="text-sm text-gray-600">
                Sistem timer otomatis max {SYSTEM_CONFIG.limits.maxDurationMinutes} menit
              </p>
            </div>
            <div className="card bg-white">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold mb-2">Sistem Ranking</h3>
              <p className="text-sm text-gray-600">
                Lihat peringkat per mata pelajaran
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/student/register" 
              className="btn-primary text-lg px-8 py-4 inline-block"
            >
              Masuk Sebagai Siswa
            </Link>
            <Link 
              href="/admin/login" 
              className="btn-secondary text-lg px-8 py-4 inline-block"
            >
              Login Admin
            </Link>
          </div>

          {/* Info */}
          <div className="mt-12 text-sm text-gray-500">
            <p>100% Gratis • Tanpa Biaya • Tanpa Kartu Kredit</p>
          </div>
        </div>
      </div>
    </div>
  );
}
