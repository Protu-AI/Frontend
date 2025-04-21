import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { ChatLayout } from "./features/chat/components/ChatLayout";
import { MainLayout } from "./layouts/MainLayout";
import { ForgotPassword } from "./pages/ForgotPassword/ForgotPassword";
// import { ForgotPasswordStep2 } from './pages/ForgotPassword/ForgotPasswordStep2';
// import { ForgotPasswordStep3 } from './pages/ForgotPassword/ForgotPasswordStep3';
// import { ForgotPasswordStep4 } from './pages/ForgotPassword/ForgotPasswordStep4';
import { Settings } from "./pages/Settings";
import { Learn } from "./pages/Learn"; // Updated import
import Path from "./pages/Path"; // Updated import
import CoursePage from "./pages/CoursePage"; // Import the new CoursePage

export default function App() {
  const handleSendMessage = (content: string) => {
    console.log("Sending message:", content);
  };

  return (
    <div className="bg-light dark:bg-dark text-light dark:text-dark min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* <Route path="/forgot-password/step2" element={<ForgotPasswordStep2 />} />
        <Route path="/forgot-password/step3" element={<ForgotPasswordStep3 />} />
        <Route path="/forgot-password/step4" element={<ForgotPasswordStep4 />} /> */}
        <Route path="/settings/*" element={<Settings />} />
        <Route
          path="/chatbot"
          element={
            <MainLayout>
              <ChatLayout onSendMessage={handleSendMessage} />
            </MainLayout>
          }
        />
        <Route path="/learn" element={<Learn />} /> {/* Updated route path */}
        <Route path="/path/:pathName" element={<Path />} /> {/* Updated element */}
        <Route path="/course/:courseName" element={<CoursePage />} /> {/* New route */}
      </Routes>
    </div>
  );
}
