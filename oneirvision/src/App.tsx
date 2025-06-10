import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

// Components
import Sidebar from './components/Sidebar';

function App() {

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
  const isAuthPage = location.pathname === '/auth';
  
  return (
    <div className="app bg-dark-bg min-h-screen text-white overflow-x-hidden flex">
      {!isAuthPage && <Sidebar />}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-screen p-4 md:p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/analyze" element={<DreamAnalysisPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            {/* Add a catch-all route for 404 */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
