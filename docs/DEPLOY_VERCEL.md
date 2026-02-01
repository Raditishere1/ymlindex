# Deploy ke Vercel - Panduan Lengkap

## 📌 Ringkasan

Vercel akan secara otomatis:
1. Clone repository dari GitHub
2. Install semua dependencies (`npm install`)
3. Generate Prisma client (`prisma generate`)
4. Build Next.js app (`next build`)
5. Deploy ke production

**TIDAK ADA** proses install lokal yang diperlukan!

## 🚀 Langkah-Langkah Detail

### 1. Persiapan Repository GitHub

```bash
# Di komputer lokal (TIDAK install apapun)
1. Extract online-quiz-free-vercel.zip
2. Buka folder hasil extract
3. Pastikan struktur folder benar:
   ✅ app/
   ✅ components/
   ✅ lib/
   ✅ prisma/
   ✅ system.js
   ✅ package.json
   ❌ JANGAN ada node_modules/
   ❌ JANGAN ada .next/
```

### 2. Upload ke GitHub

**Via GitHub Web**:
1. Login ke github.com
2. Click "New repository"
3. Nama: `quiz-app` (atau terserah)
4. Public/Private: terserah
5. JANGAN centang "Add README" (sudah ada)
6. Click "Create repository"
7. Click "uploading an existing file"
8. Drag & drop SEMUA file dari folder extract
9. Click "Commit changes"

**Via Git CLI** (jika familiar):
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/quiz-app.git
git push -u origin main
```

### 3. Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com)
2. Click "Sign Up" (atau Login jika sudah punya akun)
3. Login dengan GitHub
4. Click "Add New Project"
5. Import repository `quiz-app`
6. Konfigurasi:
   - **Framework Preset**: Next.js (auto-detect)
   - **Root Directory**: `./` (biarkan default)
   - **Build Command**: `npm run build` (biarkan default)
   - **Output Directory**: `.next` (biarkan default)

### 4. Environment Variables (PENTING!)

Di section "Environment Variables", tambahkan:

```env
DATABASE_URL=file:./dev.db
SESSION_SECRET=gunakan-random-string-minimal-32-karakter
NODE_ENV=production
```

**Cara generate SESSION_SECRET**:
```bash
# Di terminal (atau online random generator)
openssl rand -base64 32

# Atau buka browser console:
btoa(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
```

### 5. Deploy!

1. Click "Deploy"
2. Tunggu 2-5 menit (Vercel akan install & build)
3. Jika sukses, akan muncul konfetti 🎉
4. Click "Visit" untuk membuka app

## ✅ Verifikasi Deploy Sukses

Cek URL app Anda:
```
https://quiz-app-username.vercel.app
```

Test:
1. Halaman landing muncul
2. Click "Masuk Sebagai Siswa"
3. Daftar dengan nama
4. Dashboard muncul (kosong normal jika belum ada quiz)
5. Logout
6. Login sebagai admin (Aphrodite / 123)
7. Buat paket soal pertama

## 🐛 Troubleshooting Build Errors

### Error: "Prisma Client not found"

**Penyebab**: Prisma generate tidak jalan

**Solusi**:
1. Check `package.json` ada script:
   ```json
   "postinstall": "prisma generate",
   "build": "prisma generate && next build"
   ```
2. Redeploy

### Error: "DATABASE_URL not found"

**Penyebab**: Environment variable belum di-set

**Solusi**:
1. Vercel Dashboard → Settings → Environment Variables
2. Tambahkan `DATABASE_URL=file:./dev.db`
3. Redeploy

### Error: "Module not found"

**Penyebab**: Dependencies tidak ter-install

**Solusi**:
1. Check `package.json` lengkap
2. Pastikan ada `package-lock.json`
3. Redeploy

### Build timeout

**Penyebab**: Build terlalu lama (>45 menit di FREE tier)

**Solusi**:
- Ini seharusnya TIDAK terjadi (build normal <5 menit)
- Jika terjadi, contact Vercel support

## 🔄 Update & Redeploy

Setelah deploy pertama, untuk update:

1. Edit file di GitHub (atau push perubahan)
2. Vercel **otomatis** detect perubahan
3. Vercel **otomatis** rebuild & redeploy
4. Selesai! (Tanpa manual trigger)

**Untuk disable auto-deploy**:
- Vercel Dashboard → Settings → Git
- Uncheck "Automatically deploy"

## 📊 Monitoring

**Build Logs**:
- Vercel Dashboard → Deployments
- Click deployment → View Build Logs

**Runtime Logs**:
- Vercel Dashboard → Deployments
- Click deployment → View Function Logs

**Analytics** (optional):
- Vercel Dashboard → Analytics
- Enable Vercel Analytics (gratis)

## 💰 FREE Tier Limits

Vercel FREE tier mencukupi untuk:
- ✅ 100GB bandwidth/bulan
- ✅ Unlimited deployments
- ✅ 100 hours execution time/bulan
- ✅ Edge network global

**Tidak termasuk**:
- ❌ Custom domain berbayar (optional)
- ❌ Team collaboration (optional)

Untuk quiz app dengan <1000 users/bulan, FREE tier **lebih dari cukup**.

## 🎯 Next Steps

Setelah deploy sukses:
1. **Ganti password admin** di `system.js`
2. **Customize** app name, subjects, dll di `system.js`
3. **Buat paket soal** pertama via Admin Panel
4. **Share URL** ke siswa!

**Congratulations!** 🎉

App Anda sudah live dan gratis selamanya!
