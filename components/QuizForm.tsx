
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SYSTEM_CONFIG from '../system';

export default function QuizForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(SYSTEM_CONFIG.app.subjects[0]);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, {
      questionText: '',
      imageFile: null,
      imagePreview: null,
      type: 'single',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: '',
      explanation: ''
    }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (questions.length < SYSTEM_CONFIG.limits.minQuestionsPerQuiz) {
      alert(`Minimal ${SYSTEM_CONFIG.limits.minQuestionsPerQuiz} soal`);
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('subject', subject);
      formData.append('description', description);
      formData.append('duration', duration.toString());

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (q.imageFile) {
          formData.append(`question_${i}_image`, q.imageFile);
        }
        formData.append(`question_${i}_text`, q.questionText);
        formData.append(`question_${i}_type`, q.type);
        formData.append(`question_${i}_options`, JSON.stringify(q.options));
        formData.append(`question_${i}_correct`, JSON.stringify(q.correctAnswer));
        formData.append(`question_${i}_explanation`, q.explanation);
      }
      formData.append('questionCount', questions.length.toString());

      const res = await fetch('/api/admin/quiz', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        alert('Gagal membuat paket soal');
      }
    } catch (error) {
      alert('Error: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Buat Paket Soal Baru</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Info Paket</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Judul Paket</label>
                <input type="text" className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div>
                <label className="label">Mata Pelajaran</label>
                <select className="input" value={subject} onChange={(e) => setSubject(e.target.value)}>
                  {SYSTEM_CONFIG.app.subjects.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Deskripsi (Opsional)</label>
                <textarea className="input" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>
              <div>
                <label className="label">Durasi (Menit)</label>
                <input type="number" className="input" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} min={SYSTEM_CONFIG.limits.minDurationMinutes} max={SYSTEM_CONFIG.limits.maxDurationMinutes} required />
              </div>
            </div>
          </div>

          <div className="card mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Soal ({questions.length}/{SYSTEM_CONFIG.limits.maxQuestionsPerQuiz})</h2>
              <button type="button" onClick={addQuestion} disabled={questions.length >= SYSTEM_CONFIG.limits.maxQuestionsPerQuiz} className="btn-primary">
                + Tambah Soal
              </button>
            </div>
            {questions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Belum ada soal. Klik "Tambah Soal"</p>
            ) : (
              <div className="space-y-4">
                {questions.map((q, i) => (
                  <div key={i} className="p-4 border rounded">
                    <h3 className="font-semibold mb-3">Soal #{i + 1}</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="label">Teks Soal</label>
                        <input type="text" className="input" value={q.questionText} onChange={(e) => {
                          const updated = [...questions];
                          updated[i].questionText = e.target.value;
                          setQuestions(updated);
                        }} />
                      </div>
                      <div>
                        <label className="label">Upload Gambar</label>
                        <input type="file" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const updated = [...questions];
                            updated[i].imageFile = file;
                            updated[i].imagePreview = URL.createObjectURL(file);
                            setQuestions(updated);
                          }
                        }} className="input" />
                      </div>
                      <div>
                        <label className="label">Tipe Soal</label>
                        <select className="input" value={q.type} onChange={(e) => {
                          const updated = [...questions];
                          updated[i].type = e.target.value;
                          updated[i].options = e.target.value === 'boolean' ? ['Benar', 'Salah'] : ['A', 'B', 'C', 'D'];
                          setQuestions(updated);
                        }}>
                          {SYSTEM_CONFIG.questionTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="label">Jawaban Benar</label>
                        <input type="text" className="input" placeholder={q.type === 'multiple' ? 'A,C (pisah dengan koma)' : 'A'} value={q.correctAnswer} onChange={(e) => {
                          const updated = [...questions];
                          updated[i].correctAnswer = e.target.value;
                          setQuestions(updated);
                        }} required />
                      </div>
                      <div>
                        <label className="label">Pembahasan (Opsional)</label>
                        <textarea className="input" value={q.explanation} onChange={(e) => {
                          const updated = [...questions];
                          updated[i].explanation = e.target.value;
                          setQuestions(updated);
                        }} rows={2} />
                      </div>
                      <button type="button" onClick={() => setQuestions(questions.filter((_, idx) => idx !== i))} className="btn-danger text-sm">
                        Hapus Soal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => router.back()} className="btn-secondary">Batal</button>
            <button type="submit" disabled={loading || questions.length === 0} className="btn-primary">
              {loading ? 'Menyimpan...' : 'Simpan Paket Soal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
