// ====================================================
// SYSTEM.JS - SATU-SATUNYA FILE KONFIGURASI UTAMA
// ====================================================
// Semua konfigurasi aplikasi HARUS diambil dari file ini
// JANGAN hardcode config di file lain

const SYSTEM_CONFIG = {
  // Informasi Aplikasi
  app: {
    name: "QuizMaster Pro",
    tagline: "Platform Belajar & Ujian Online Gratis",
    theme: {
      primary: "#3B82F6", // blue-500
      secondary: "#60A5FA", // blue-400
      accent: "#DBEAFE", // blue-100
      background: "#FFFFFF",
      text: "#1F2937" // gray-800
    },
    subjects: [
      "Matematika",
      "Fisika",
      "Kimia",
      "Biologi",
      "Bahasa Indonesia",
      "Bahasa Inggris",
      "Sejarah",
      "Geografi",
      "Ekonomi",
      "PKN"
    ]
  },

  // Batasan Sistem
  limits: {
    maxQuestionsPerQuiz: 20,
    minQuestionsPerQuiz: 5,
    maxDurationMinutes: 90,
    minDurationMinutes: 10,
    defaultDurationMinutes: 30,
    maxImageSizeMB: 5,
    allowedImageTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"]
  },

  // Sistem Penilaian
  scoring: {
    correctAnswer: 5,
    wrongAnswer: 0,
    emptyAnswer: 0,
    passingScore: 60 // dalam persen
  },

  // Tipe Soal yang Didukung
  questionTypes: [
    { id: "single", label: "Pilihan Ganda (Tunggal)", options: ["A", "B", "C", "D", "E"] },
    { id: "multiple", label: "Pilihan Ganda (Kompleks)", options: ["A", "B", "C", "D", "E"] },
    { id: "boolean", label: "Benar/Salah", options: ["Benar", "Salah"] }
  ],

  // Akun Admin Default (WAJIB)
  adminAccount: {
    username: "Aphrodite",
    password: "123", // Di production harus di-hash
    displayName: "Administrator"
  },

  // Provider Layanan (Gratis 100%)
  providers: {
    database: {
      type: "sqlite", // sqlite | turso
      provider: "prisma",
      url: process.env.DATABASE_URL || "file:./dev.db"
    },
    auth: {
      type: "session-cookie",
      sessionName: "qm_session",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    },
    storage: {
      type: "local", // local | cloudinary
      uploadDir: "/public/uploads",
      baseUrl: "/uploads"
    }
  },

  // Konfigurasi Database (SQLite)
  databaseConfig: {
    sqlite: {
      filename: "dev.db",
      location: "./prisma/dev.db"
    }
  },

  // Ranking Settings
  ranking: {
    topLimit: 10,
    strategy: "best-attempt", // best-attempt | latest-attempt
    sortBy: ["score DESC", "duration ASC"]
  },

  // UI Settings
  ui: {
    studentsPerPage: 20,
    quizPacksPerPage: 12,
    showTimer: true,
    showQuestionNumber: true,
    confirmBeforeSubmit: true,
    showResultsImmediately: true
  }
};

// Export untuk digunakan di seluruh aplikasi
if (typeof module !== "undefined" && module.exports) {
  module.exports = SYSTEM_CONFIG;
}

export default SYSTEM_CONFIG;
