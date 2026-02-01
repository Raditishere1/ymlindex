# Setup Database - SQLite + Prisma

## 📌 Ringkasan

Database menggunakan **SQLite** dengan **Prisma ORM**.

**Keuntungan**:
- ✅ 100% gratis
- ✅ Tidak perlu server database
- ✅ File-based (1 file = 1 database)
- ✅ Zero configuration
- ✅ Perfect untuk FREE tier

## 🗄️ Database Schema

```prisma
// prisma/schema.prisma

model Student {
  id        String
  name      String
  attempts  Attempt[]
}

model QuizPack {
  id          String
  title       String
  subject     String
  description String?
  duration    Int
  isActive    Boolean
  questions   Question[]
  attempts    Attempt[]
}

model Question {
  id           String
  quizPackId   String
  questionText String?
  imageUrl     String?
  type         String
  options      String // JSON
  correctAnswer String // JSON
  explanation  String?
  orderIndex   Int
}

model Attempt {
  id            String
  studentId     String
  quizPackId    String
  answers       String // JSON
  score         Int
  totalQuestions Int
  correctCount  Int
  duration      Int
  startedAt     DateTime
  submittedAt   DateTime
}
```

## 🔧 Setup Otomatis di Vercel

Ketika Vercel build:

1. **Install Prisma**:
   ```bash
   npm install
   # Akan install @prisma/client dan prisma
   ```

2. **Generate Client**:
   ```bash
   npm run build
   # Akan run: prisma generate && next build
   ```

3. **Create Database**:
   - SQLite file dibuat otomatis saat pertama diakses
   - Location: `/tmp/dev.db` (ephemeral di Vercel)
   - Data akan hilang setiap redeploy (normal di FREE tier)

## ⚠️ PENTING: Data Persistence

**Di Vercel FREE tier**:
- Database ada di `/tmp/` (temporary)
- **Data HILANG** setiap redeploy
- Ini **normal** dan **expected**

**Solusi** jika butuh persistence:
1. Upgrade ke Vercel Pro + Vercel Postgres ($20/bulan)
2. Atau gunakan Turso (SQLite di cloud, ada FREE tier)

**Untuk development/demo**:
- SQLite ephemeral **sudah cukup**
- Data test bisa dibuat ulang lewat Admin Panel

## 🚀 Migrasi ke Turso (Optional)

Jika butuh data persistence gratis:

### 1. Setup Turso

```bash
# Install Turso CLI (di lokal, untuk setup saja)
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Buat database
turso db create quiz-app

# Get connection URL
turso db show quiz-app --url
```

### 2. Update Environment Variables

Di Vercel:
```env
DATABASE_URL=libsql://quiz-app-username.turso.io
TURSO_AUTH_TOKEN=your-auth-token-from-turso
```

### 3. Update Prisma Schema

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### 4. Deploy Ulang

Vercel akan otomatis connect ke Turso.

**FREE Tier Turso**:
- ✅ 500MB storage
- ✅ 1 billion row reads/bulan
- ✅ 25 million row writes/bulan

Cukup untuk ribuan siswa!

## 📊 Database Management

### Lihat Data (Development)

Jika run lokal:
```bash
npx prisma studio
```

Akan buka web UI di `http://localhost:5555`

### Lihat Data (Production - Turso)

```bash
turso db shell quiz-app

# SQL commands
SELECT * FROM Student;
SELECT * FROM QuizPack;
SELECT * FROM Attempt;
```

### Reset Database

**Local**:
```bash
rm prisma/dev.db
npm run dev
# Database akan dibuat ulang
```

**Vercel**:
- Redeploy → database otomatis reset
- Atau hapus `/tmp/dev.db` via Vercel function

## 🔍 Troubleshooting

### "Prisma Client is not generated"

**Solusi**:
```json
// package.json
"scripts": {
  "postinstall": "prisma generate",
  "build": "prisma generate && next build"
}
```

### "Database file is locked"

**Penyebab**: Multiple connections

**Solusi**:
- Gunakan singleton pattern (sudah ada di `lib/prisma.ts`)
- Restart Vercel function

### "Table does not exist"

**Penyebab**: Migration belum run

**Solusi**:
- Prisma akan auto-create tables dari schema
- Jika masih error, push schema:
  ```bash
  npx prisma db push
  ```

## 📈 Performance Tips

1. **Index** sudah ditambahkan di schema:
   ```prisma
   @@index([quizPackId])
   @@index([studentId])
   ```

2. **Connection pooling**:
   - Sudah handled by Prisma
   - Singleton pattern di `lib/prisma.ts`

3. **Query optimization**:
   - Gunakan `select` untuk field tertentu
   - Gunakan `include` hanya jika perlu

## 💡 Best Practices

1. **Backup** (jika pakai Turso):
   ```bash
   turso db dump quiz-app > backup.sql
   ```

2. **Seed data** (untuk development):
   ```typescript
   // prisma/seed.ts
   import { PrismaClient } from '@prisma/client'
   const prisma = new PrismaClient()
   
   async function main() {
     // Create admin, quiz packs, dll
   }
   
   main()
   ```

3. **Monitoring**:
   - Check Vercel logs
   - Monitor query performance

Selesai! Database setup complete. 🎉
