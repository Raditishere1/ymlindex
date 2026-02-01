# QuizMaster Pro - Online Learning & Quiz Platform

Platform ujian online gratis 100% yang berjalan di Vercel FREE tier.

## ✨ Fitur Utama

### Untuk Siswa
- ✅ Registrasi dengan nama saja (tanpa email/password)
- ✅ Dashboard mata pelajaran
- ✅ Pilih dan kerjakan paket soal
- ✅ Timer otomatis (max 90 menit)
- ✅ Tipe soal: PG Tunggal, PG Kompleks, Benar/Salah
- ✅ Soal dengan foto/gambar
- ✅ Hasil langsung setelah submit
- ✅ Ranking per mata pelajaran

### Untuk Admin
- ✅ Login dengan username & password
- ✅ Buat paket soal baru
- ✅ Upload foto soal
- ✅ Atur jawaban benar & pembahasan
- ✅ Lihat hasil siswa

## 🚀 Tech Stack (100% GRATIS)

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite + Prisma ORM
- **Auth**: Session Cookie (Jose JWT)
- **Storage**: Local file system
- **Hosting**: Vercel FREE tier

## 📋 Prasyarat

- Akun GitHub (gratis)
- Akun Vercel (gratis, bisa login dengan GitHub)

**TIDAK DIPERLUKAN**:
- ❌ Install Node.js lokal
- ❌ Install dependencies lokal
- ❌ Kartu kredit
- ❌ Biaya apapun

## 🎯 Deploy ke Vercel (3 Langkah)

### 1️⃣ Upload ke GitHub

1. Download file `online-quiz-free-vercel.zip`
2. Extract file ZIP
3. Buat repository baru di GitHub
4. Upload semua file (KECUALI node_modules, .next, dll)

### 2️⃣ Connect ke Vercel

1. Login ke [Vercel](https://vercel.com) dengan akun GitHub
2. Click "Add New Project"
3. Import repository yang baru dibuat
4. Konfigurasi:
   - Framework Preset: **Next.js**
   - Build Command: (biarkan default)
   - Output Directory: (biarkan default)

### 3️⃣ Set Environment Variables

Di Vercel dashboard, tambahkan environment variables:

```
DATABASE_URL="file:./dev.db"
SESSION_SECRET="ganti-dengan-random-string-anda"
NODE_ENV="production"
```

Klik **Deploy**!

## 🔑 Login Admin Default

Setelah deploy sukses, login admin menggunakan:

- **Username**: `Aphrodite`
- **Password**: `123`

⚠️ **PENTING**: Ganti password di file `system.js` sebelum production!

## 📁 Struktur Project

```
online-quiz-free-vercel/
├── app/                    # Next.js App Router
│   ├── admin/             # Halaman admin
│   ├── student/           # Halaman siswa
│   ├── api/               # API Routes
│   └── page.tsx           # Landing page
├── components/            # React components
├── lib/                   # Utilities
│   ├── prisma.ts         # Database client
│   ├── session.ts        # Session management
│   └── upload.ts         # File upload
├── prisma/
│   └── schema.prisma     # Database schema
├── public/
│   └── uploads/          # Uploaded images
├── docs/                 # Dokumentasi lengkap
├── system.js             # ⭐ SATU-SATUNYA FILE CONFIG
├── package.json          # Dependencies
└── README.md             # File ini
```

## ⚙️ Konfigurasi Sistem

**SEMUA konfigurasi ada di `system.js`!**

Edit file ini untuk mengubah:
- Nama aplikasi
- Mata pelajaran
- Batasan soal & durasi
- Sistem penilaian
- Akun admin
- Dan lainnya...

## 📚 Dokumentasi Lengkap

- [SETUP_DATABASE.md](docs/SETUP_DATABASE.md) - Setup database
- [DEPLOY_VERCEL.md](docs/DEPLOY_VERCEL.md) - Deploy ke Vercel
- [INSTALL_FLOW.md](docs/INSTALL_FLOW.md) - Flow instalasi
- [FREE_TIER.md](docs/FREE_TIER.md) - Penjelasan FREE tier

## 🐛 Troubleshooting

### Build gagal di Vercel

**Penyebab**: Environment variables belum di-set

**Solusi**: 
1. Buka Vercel dashboard
2. Settings → Environment Variables
3. Tambahkan `DATABASE_URL` dan `SESSION_SECRET`
4. Redeploy

### Database error

**Penyebab**: Prisma belum generate client

**Solusi**: Vercel akan otomatis run `prisma generate` saat build. Pastikan `package.json` sudah benar.

### Upload gambar tidak muncul

**Penyebab**: Path salah atau permission

**Solusi**: Pastikan folder `public/uploads/` exists dan writable

## 📞 Support

Jika ada masalah:
1. Cek dokumentasi di folder `docs/`
2. Lihat Vercel build logs
3. Check file `system.js` untuk konfigurasi

## 📄 Lisensi

MIT License - Bebas digunakan untuk tujuan apapun

## 🎉 Selamat!

Aplikasi Anda sekarang sudah live dan dapat diakses di:
`https://your-project-name.vercel.app`

**100% GRATIS - Tanpa Kartu Kredit - Tanpa Biaya Tersembunyi**
