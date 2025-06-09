import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import HALO from 'vanta/dist/vanta.halo.min';
import { 
  ArrowRight, 
  Home, 
  BookOpen, 
  Brain, 
  BarChart2, 
  Moon, 
  User, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import '../fonts.css';

const HomePage = () => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(
        HALO({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          backgroundColor: 0x0f172a,
          size: 1.5
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Dream Journal', path: '/journal', icon: <BookOpen size={20} /> },
    { name: 'Dream Analysis', path: '/analyze', icon: <Brain size={20} /> },
    { name: 'Insights', path: '/insights', icon: <BarChart2 size={20} /> }
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Vanta.js Background */}
      <div 
        ref={vantaRef} 
        className="fixed inset-0 -z-10"
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation Bar - Only visible when logged in */}
        {user && (
          <nav className="backdrop-blur-lg bg-slate-800/50 border-b border-slate-700/50 fixed w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0 flex items-center">
                    <Moon className="h-8 w-8 text-indigo-400" />
                    <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                      OneirVision
                    </span>
                  </div>
                </div>
                
                {/* Desktop Navigation */}
                <div className="hidden md:block">
                  <div className="ml-10 flex items-center space-x-8">
                    {navLinks.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 ${
                          location.pathname === item.path
                            ? 'text-white bg-slate-700/50'
                            : 'text-slate-300 hover:bg-slate-700/30 hover:text-white'
                        }`}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Profile Dropdown */}
                <div className="ml-4 flex items-center md:ml-6 relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 max-w-xs rounded-full bg-slate-700/50 p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden md:inline text-slate-200">{user.name || 'User'}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 flex items-center space-x-2"
                      >
                        <User size={16} />
                        <span>Your Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 flex items-center space-x-2"
                      >
                        <LogOut size={16} />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </nav>
        )}

        {/* Hero Section */}
        <div className={`flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 ${user ? 'pt-20' : ''}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 mb-6">
              <Sparkles className="h-5 w-5 text-indigo-400 mr-2" />
              <span className="text-sm font-medium text-indigo-300">
                Discover Your Subconscious
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                OneirVision
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Unlock the hidden meanings of your dreams with our AI-powered dream analysis platform.
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/auth/register"
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/auth/login"
                  className="px-8 py-4 bg-transparent border-2 border-slate-600 text-white font-medium rounded-lg hover:bg-slate-800/50 transition-all"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-all"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
