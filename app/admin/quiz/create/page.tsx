import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import QuizForm from '@/components/QuizForm';

export default async function CreateQuizPage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/admin/login');

  return <QuizForm />;
}
