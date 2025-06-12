import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from './UserProfile';
import { FiHome, FiPieChart, FiBookOpen, FiZap, FiMenu, FiX, FiLogIn } from 'react-icons/fi';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactElement;
}

const navigation: NavItem[] = [
  { name: 'Home', path: '/', icon: <FiHome /> },
  { name: 'Dashboard', path: '/dashboard', icon: <FiPieChart /> },
  { name: 'Analyze', path: '/analyze', icon: <FiZap /> },
  { name: 'Journal', path: '/journal', icon: <FiBookOpen /> },
  { name: 'Insights', path: '/insights', icon: <FiPieChart /> }
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav 
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex justify-center"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
      >
        <div className="relative">
          {/* Glassmorphic pill container */}
          <div className={`flex items-center bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 rounded-full p-1.5 shadow-lg ${
            isScrolled ? 'shadow-black/30' : 'shadow-black/20'
          }`}>
            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`relative px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-200 flex flex-col items-center ${
                      isActive ? 'text-white' : 'text-gray-400 hover:text-white/80'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="transition-transform duration-200 group-hover:scale-110">
                        {React.cloneElement(item.icon, {
                          className: `w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`
                        })}
                      </span>
                      <span>{item.name}</span>
                    </div>
                    {isActive && (
                      <motion.span 
                        layoutId="nav-dot"
                        className="absolute -bottom-1 w-1.5 h-1.5 bg-indigo-400 rounded-full"
                        initial={false}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 30
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-0 right-0 w-72 h-full bg-gray-900/95 backdrop-blur-xl z-50 flex flex-col overflow-y-auto"
            >
              {/* Menu Header */}
              <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <span className="text-lg font-semibold text-white">Menu</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              
              {/* Navigation Items */}
              <nav className="flex-1 p-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center px-4 py-3 text-base font-medium rounded-lg mx-1 ${
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {React.cloneElement(item.icon, {
                        className: `mr-3 h-6 w-6 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`
                      })}
                      {item.name}
                      {isActive && (
                        <span className="ml-auto w-2 h-2 bg-indigo-400 rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>
              
              {/* User Section */}
              <div className="p-4 border-t border-white/5">
                {user ? (
                  <div className="px-4 py-3">
                    <UserProfile />
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-md"
                  >
                    <FiLogIn className="mr-2 h-5 w-5" />
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
