import { QuizDashboard } from './QuizDashboard';
import { QuizHistory } from './QuizHistory';

export function Quizzes() {
  // TODO: In the future, this will check if user has past quizzes
  // For now, set to true to show the new layout
  const hasPastQuizzes = true;

  if (hasPastQuizzes) {
    return <QuizHistory />;
  }

  return <QuizDashboard />;
} 