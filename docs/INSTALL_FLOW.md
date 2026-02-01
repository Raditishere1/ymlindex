# Install Flow - Bagaimana Semuanya Bekerja

## 🎯 Konsep Penting

**TIDAK ADA INSTALL LOKAL!**

Semua proses install terjadi di **Vercel cloud** saat build.

## 📦 Yang Ada Di Repository

Repository GitHub **HANYA** berisi:
- ✅ Source code (.ts, .tsx, .js)
- ✅ Config files (package.json, tsconfig.json, dll)
- ✅ Prisma schema
- ✅ Documentation
- ✅ system.js (file konfigurasi utama)

Repository **TIDAK** berisi:
- ❌ node_modules/ (dependencies)
- ❌ .next/ (build output)
- ❌ dist/ atau build/
- ❌ Binary files (kecuali gambar di README)

## 🔄 Build Flow di Vercel

### 1️⃣ Trigger Deploy

```
[GitHub Push]
     ↓
[Vercel Detects Change]
     ↓
[Start Build]
```

### 2️⃣ Install Dependencies

```bash
# Vercel otomatis run:
npm install

# Atau jika ada yarn.lock:
yarn install

# Atau jika ada pnpm-lock.yaml:
pnpm install
```

**Yang di-install**:
- next
- react
- react-dom
- @prisma/client
- prisma
- typescript
- tailwindcss
- Dan semua dependencies di package.json

**Total size**: ~300MB (normal)
**Waktu**: 1-2 menit

### 3️⃣ Post-Install Hook

```bash
# Dari package.json:
npm run postinstall

# Yang dijalankan:
prisma generate
```

**Yang terjadi**:
- Prisma membaca `prisma/schema.prisma`
- Generate TypeScript client
- Client disimpan di `node_modules/@prisma/client`

**Waktu**: 10-30 detik

### 4️⃣ Build Application

```bash
# Dari package.json:
npm run build

# Yang dijalankan:
prisma generate && next build
```

**Yang terjadi**:
1. Generate Prisma client (lagi, untuk safety)
2. Compile TypeScript → JavaScript
3. Bundle React components
4. Optimize images & assets
5. Generate static pages (jika ada)
6. Create server functions
7. Output ke folder `.next/`

**Waktu**: 1-3 menit

### 5️⃣ Deploy to Edge Network

```
[Build Complete]
     ↓
[Upload to Vercel CDN]
     ↓
[Distribute to Edge Locations]
     ↓
[App Live! 🎉]
```

**Waktu**: 10-30 detik

## 📊 Total Build Time

```
Install dependencies:  1-2 min
Generate Prisma:       30 sec
Build Next.js:         1-3 min
Deploy:                30 sec
─────────────────────────────
TOTAL:                 3-6 min
```

## 🔍 Detailed Build Logs

Di Vercel Dashboard → Deployments → [Your Deploy] → Build Logs:

```log
[00:00:05] Cloning repository...
[00:00:10] Installing dependencies...
[00:01:45] Running "npm install"
[00:01:50] Running "npm run postinstall"
[00:02:00] Generating Prisma Client...
[00:02:15] Running "npm run build"
[00:02:20] Compiling...
[00:04:50] Build completed
[00:05:00] Deploying...
[00:05:20] Deployment complete
```

## 🚫 Common Build Failures

### Missing package.json

```log
ERROR: No package.json found
```

**Penyebab**: package.json tidak ter-upload

**Solusi**: Pastikan package.json ada di root repository

### Missing dependencies

```log
ERROR: Module 'react' not found
```

**Penyebab**: package.json tidak lengkap

**Solusi**: Check package.json, pastikan semua dependencies listed

### Prisma generate failed

```log
ERROR: Schema file not found at prisma/schema.prisma
```

**Penyebab**: Folder prisma tidak ter-upload

**Solusi**: Pastikan folder `prisma/` ada dengan file `schema.prisma`

### TypeScript errors

```log
ERROR: Type 'string' is not assignable to type 'number'
```

**Penyebab**: Type errors di code

**Solusi**: Fix TypeScript errors, push lagi

### Build timeout

```log
ERROR: Build exceeded maximum duration of 45m0s
```

**Penyebab**: Build terlalu lama (jarang terjadi)

**Solusi**: 
- Simplify build process
- Contact Vercel support

## 🔧 Build Configuration

### package.json (PENTING!)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "18.3.1",
    "@prisma/client": "5.14.0",
    // ... dll
  },
  "devDependencies": {
    "prisma": "5.14.0",
    "typescript": "5.4.5",
    // ... dll
  }
}
```

**Key points**:
- `postinstall`: Run setelah npm install
- `build`: Command untuk build production
- `dependencies`: Runtime dependencies
- `devDependencies`: Build-time dependencies

### vercel.json (Optional)

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

Biasanya **TIDAK PERLU** karena Vercel auto-detect Next.js.

## 🎯 Optimization Tips

### 1. Lock File

**WAJIB commit** salah satu:
- `package-lock.json` (npm)
- `yarn.lock` (yarn)
- `pnpm-lock.yaml` (pnpm)

**Keuntungan**:
- Build lebih cepat
- Consistent dependencies
- Lebih aman

### 2. Caching

Vercel otomatis cache:
- `node_modules/`
- `.next/cache/`

**Benefit**: Build berikutnya lebih cepat (1-2 menit)

### 3. Incremental Builds

Next.js support incremental static regeneration.

**Config** di `next.config.js`:
```javascript
module.exports = {
  experimental: {
    incrementalCacheHandlerPath: './cache-handler.js'
  }
}
```

### 4. Build Output

Check size:
```log
Route (app)                Size     First Load JS
┌ ○ /                      5.2 kB         95.3 kB
├ ○ /student/dashboard     8.1 kB         98.2 kB
└ ○ /admin/login           4.8 kB         94.9 kB
```

**Target**:
- Per page: <10 kB
- First Load JS: <100 kB

## 📈 Monitoring

### Vercel Analytics (Free)

Enable di Dashboard:
- Settings → Analytics
- Toggle ON

**Metrics**:
- Page load time
- User sessions
- Bounce rate

### Build Analytics

Track di Dashboard → Deployments:
- Build duration trend
- Success rate
- Error types

## ✅ Verification Checklist

Setelah deploy, check:

- [ ] Build sukses (hijau)
- [ ] No errors di logs
- [ ] App accessible di URL
- [ ] Homepage loads
- [ ] Student register works
- [ ] Admin login works
- [ ] Database queries work
- [ ] Image upload works
- [ ] Quiz submission works

**Semua hijau?** Congratulations! 🎉

## 🔄 Continuous Deployment

Setiap push ke GitHub:
1. Vercel auto-detect
2. Auto-build
3. Auto-deploy
4. Auto-rollback jika fail

**Disable auto-deploy**:
- Settings → Git
- Uncheck "Production Branch"

**Manual deploy**:
- Deployments → Three dots → Redeploy

Selesai! Build flow complete. 🚀
