'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SYSTEM_CONFIG from '../../../system';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal login');
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card">
          <h1 className="text-2xl font-bold text-center mb-2">
            {SYSTEM_CONFIG.app.name}
          </h1>
          <p className="text-gray-600 text-center mb-6">Login Admin</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="label">Username</label>
              <input
                type="text"
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-6">
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link href="/" className="text-blue-600 hover:underline">
              ← Kembali ke Beranda
            </Link>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-gray-600">
            <p className="font-semibold mb-1">Demo Credentials:</p>
            <p>Username: {SYSTEM_CONFIG.adminAccount.username}</p>
            <p>Password: {SYSTEM_CONFIG.adminAccount.password}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
