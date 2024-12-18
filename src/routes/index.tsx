import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Lazy load pages
const Chatbot = lazy(() => import('../pages/Chatbot'));
// const Home = lazy(() => import('../pages/Home')); // Will be implemented later

export default function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Redirect root to chat for now */}
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="/chat" element={<Chatbot />} />
        {/* Other routes will be added later */}
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </Suspense>
  );
}