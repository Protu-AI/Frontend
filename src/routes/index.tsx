import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Lazy load pages
const Home = lazy(() => import('../pages/Home'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Suspense>
  );
}