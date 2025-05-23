import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { DreamProvider } from './contexts/DreamContext';
import { AuthProvider } from './contexts/AuthContext';
import GoogleAuthWrapper from './components/GoogleAuthWrapper';

// Page components
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import InterpreterPage from './pages/InterpreterPage';
import VisualizerPage from './pages/VisualizerPage';
import JournalPage from './pages/JournalPage';
import AuthPage from './pages/AuthPage';

// Add Spline viewer script
function addSplineScript() {
  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'https://unpkg.com/@splinetool/viewer@1.9.95/build/spline-viewer.js';
  script.async = true;
  document.head.appendChild(script);
}

function App() {
  // Add Spline script on component mount
  useEffect(() => {
    addSplineScript();
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <Router>
      <GoogleAuthWrapper>
        <AuthProvider>
          <DreamProvider>
            <AppContent />
          </DreamProvider>
        </AuthProvider>
      </GoogleAuthWrapper>
    </Router>
  );
}

// Separate component to access useLocation hook
const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <div className="app bg-dark-bg min-h-screen text-white overflow-x-hidden">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/interpreter" element={<InterpreterPage />} />
          <Route path="/visualizer" element={<VisualizerPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      {!isHomePage && <Footer />}
    </div>
  );
}

export default App;
