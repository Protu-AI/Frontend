import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { ChatLayout } from "./features/chat/components/ChatLayout";
import { MainLayout } from "./layouts/MainLayout";
import { ForgotPassword } from "./pages/ForgotPassword/ForgotPassword";
import { Settings } from "./pages/Settings";
import { Learn } from "./pages/Learn";
import { Path } from "./pages/Path";
import CoursePage from "./pages/CoursePage";
import LessonPage from "./pages/LessonPage";
import { Quizzes } from "./pages/Quizzes";
import { QuizGenerator } from "./pages/Quizzes/QuizGenerator";
import { QuizPage } from "./pages/Quizzes/QuizPage";
import { QuizFeedback } from "./pages/Quizzes/QuizFeedback";
import { ChatProvider } from "./contexts/ChatContext";
// hhhhh

export default function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/settings/*" element={<Settings />} />

        {/* Wrap routes that need ChatContext with ChatProvider */}
        <Route
          path="/chatbot"
          element={
            <ChatProvider>
              {" "}
              {/* Wrap ChatLayout */}
              <MainLayout>
                <ChatLayout />
              </MainLayout>
            </ChatProvider>
          }
        />
        <Route
          path="/lesson/:lessonId"
          element={
            <ChatProvider>
              {" "}
              {/* Wrap LessonPage */}
              <LessonPage />
            </ChatProvider>
          }
        />

        <Route path="/learn" element={<Learn />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/quizzes/generate" element={<QuizGenerator />} />
        <Route path="/quizzes/take/:quizId" element={<QuizPage />} />
        <Route path="/quizzes/feedback/:quizId" element={<QuizFeedback />} />
        <Route path="/path/:pathName" element={<Path />} />
        <Route path="/course/:courseName" element={<CoursePage />} />
      </Routes>
    </div>
  );
}
