import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { AnimationProvider } from './contexts/AnimationContext';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <Router>
        <AuthProvider>
          <AnimationProvider>
            <App />
          </AnimationProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  </StrictMode>
);
