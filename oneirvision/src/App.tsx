import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import { DreamProvider } from './contexts/DreamContext';
import { AuthProvider } from './contexts/AuthContext';
import GoogleAuthWrapper from './components/GoogleAuthWrapper';

// Page components
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import DreamAnalysisPage from './pages/DreamAnalysisPage';
import JournalPage from './pages/JournalPage';
import AuthPage from './pages/AuthPage';
import InsightsPage from './pages/InsightsPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import LucidityPage from './pages/LucidityPage';

// Components
import Navbar from './components/Navbar';

function App() {
  // Ensure full viewport height on mobile
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  return (
    <div className="min-h-screen min-h-[calc(var(--vh, 1vh) * 100)] w-full bg-gradient-to-br from-[#0D041B] to-[#1E0B36] text-white overflow-x-hidden">
      <Router>
        <GoogleAuthWrapper>
          <AuthProvider>
            <DreamProvider>
              <div className="flex flex-col min-h-screen min-h-[calc(var(--vh, 1vh) * 100)] w-full">
                <Navbar />
                <AppContent />
              </div>
            </DreamProvider>
          </AuthProvider>
        </GoogleAuthWrapper>
      </Router>
    </div>
  );
}

// Separate component to access useLocation hook
const AppContent = () => {
  return (
    <main className="flex-1 w-full">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/analyze" element={<DreamAnalysisPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/profile-settings" element={<ProfileSettingsPage />} />
        <Route path="/lucidity" element={<LucidityPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </main>
  );
}

export default App;