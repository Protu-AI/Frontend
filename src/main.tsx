import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { AnimationProvider } from "./contexts/AnimationContext";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <AnimationProvider>
          <App />
        </AnimationProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);
