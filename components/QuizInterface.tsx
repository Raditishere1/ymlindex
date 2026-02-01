'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SYSTEM_CONFIG from '../system';

type Question = {
  id: string;
  questionText: string | null;
  imageUrl: string | null;
  type: string;
  options: string;
  correctAnswer: string;
  explanation: string | null;
};

type QuizPack = {
  id: string;
  title: string;
  subject: string;
  duration: number;
  questions: Question[];
};

export default function QuizInterface({ quizPack, studentId }: { quizPack: QuizPack; studentId: string }) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState(quizPack.duration * 60);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!started) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started]);

  const handleStart = () => setStarted(true);

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/student/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizPackId: quizPack.id,
          studentId,
          answers,
          duration: quizPack.duration * 60 - timeLeft,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/student/result/${data.attemptId}`);
      }
    } catch (error) {
      alert('Gagal submit jawaban');
      setSubmitting(false);
    }
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card max-w-2xl w-full">
          <h1 className="text-2xl font-bold mb-4">{quizPack.title}</h1>
          <p className="text-gray-600 mb-6">{quizPack.subject}</p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📝</span>
              <span>{quizPack.questions.length} Soal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⏱️</span>
              <span>{quizPack.duration} Menit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <span>Benar: +{SYSTEM_CONFIG.scoring.correctAnswer} poin</span>
            </div>
          </div>

          <button onClick={handleStart} className="btn-primary w-full text-lg py-3">
            Mulai Ujian
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quizPack.questions[currentIndex];
  const options = JSON.parse(currentQuestion.options);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{quizPack.title}</h2>
              <p className="text-sm text-gray-600">
                Soal {currentIndex + 1} dari {quizPack.questions.length}
              </p>
            </div>
            <div className={`text-lg font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-800'}`}>
              ⏱️ {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="card mb-6">
            {currentQuestion.imageUrl && (
              <div className="mb-4 relative h-64 bg-gray-100 rounded">
                <Image
                  src={currentQuestion.imageUrl}
                  alt="Soal"
                  fill
                  className="object-contain"
                />
              </div>
            )}
            
            {currentQuestion.questionText && (
              <p className="text-lg mb-4">{currentQuestion.questionText}</p>
            )}

            <div className="space-y-3">
              {options.map((option: string) => (
                <label
                  key={option}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    answers[currentQuestion.id] === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type={currentQuestion.type === 'single' || currentQuestion.type === 'boolean' ? 'radio' : 'checkbox'}
                    name={currentQuestion.id}
                    value={option}
                    checked={
                      currentQuestion.type === 'multiple'
                        ? (answers[currentQuestion.id] || []).includes(option)
                        : answers[currentQuestion.id] === option
                    }
                    onChange={(e) => {
                      if (currentQuestion.type === 'multiple') {
                        const current = answers[currentQuestion.id] || [];
                        if (e.target.checked) {
                          handleAnswer(currentQuestion.id, [...current, option]);
                        } else {
                          handleAnswer(currentQuestion.id, current.filter((o: string) => o !== option));
                        }
                      } else {
                        handleAnswer(currentQuestion.id, option);
                      }
                    }}
                    className="w-5 h-5"
                  />
                  <span className="font-medium">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="btn-secondary disabled:opacity-50"
            >
              ← Sebelumnya
            </button>

            {currentIndex === quizPack.questions.length - 1 ? (
              <button onClick={handleSubmit} className="btn-primary" disabled={submitting}>
                {submitting ? 'Menyimpan...' : 'Submit Jawaban'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(quizPack.questions.length - 1, prev + 1))}
                className="btn-primary"
              >
                Selanjutnya →
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {quizPack.questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(i)}
                className={`w-10 h-10 rounded ${
                  i === currentIndex
                    ? 'bg-blue-500 text-white'
                    : answers[q.id]
                    ? 'bg-green-200'
                    : 'bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
