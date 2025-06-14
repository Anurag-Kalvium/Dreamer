import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiHome, 
  FiPieChart, 
  FiBookOpen, 
  FiZap, 
  FiMenu, 
  FiX, 
  FiUser,
  FiLogOut,
  FiSettings
} from 'react-icons/fi';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: 'Home', path: '/', icon: FiHome },
  { name: 'Journal', path: '/journal', icon: FiBookOpen },
  { name: 'Analyze', path: '/analyze', icon: FiZap },
  { name: 'Dashboard', path: '/dashboard', icon: FiPieChart },
  { name: 'Lucidity', path: '/lucidity', icon: FiSettings }
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  // Don't render navbar if user is not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      {/* Desktop Glassmorphism Pill Navbar */}
      <motion.nav 
        className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 hidden md:block"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          type: 'spring', 
          stiffness: 100,
          damping: 20
        }}
      >
        <div className="relative">
          {/* Glassmorphic pill container */}
          <div className="flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-2 py-2 shadow-2xl shadow-purple-500/10">
            {/* Navigation Items */}
            <div className="flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.path;
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`relative px-4 py-3 text-sm font-medium rounded-full transition-all duration-300 flex items-center space-x-2 group ${
                      isActive 
                        ? 'text-white bg-white/20 shadow-lg shadow-indigo-500/20' 
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 transition-all duration-300 ${
                      isActive ? 'text-indigo-300' : 'text-gray-400 group-hover:text-indigo-300'
                    }`} />
                    <span className="hidden lg:inline">{item.name}</span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full -z-10"
                        initial={false}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 30
                        }}
                      />
                    )}
                    
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400/0 to-purple-400/0 group-hover:from-indigo-400/10 group-hover:to-purple-400/10 transition-all duration-300 -z-10" />
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-white/20 mx-3" />

            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 px-4 py-3 rounded-full hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                  {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden xl:inline text-sm text-gray-300 group-hover:text-white transition-colors">
                  {user.name?.split(' ')[0] || 'User'}
                </span>
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-gray-900/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
                  >
                    {/* Profile Header */}
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                          {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name || 'User'}</p>
                          <p className="text-gray-400 text-sm truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Profile Actions */}
                    <div className="p-2">
                      <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                        <FiUser className="w-4 h-4" />
                        <span>Profile Settings</span>
                      </button>
                      <button 
                        onClick={logout}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Ambient glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-xl -z-10 opacity-50" />
        </div>
      </motion.nav>

      {/* Mobile Navbar */}
      <motion.nav 
        className="fixed top-4 right-4 z-50 md:hidden"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300 shadow-lg"
        >
          {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
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
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 w-80 h-full bg-gray-900/95 backdrop-blur-xl border-l border-white/20 shadow-2xl z-50 flex flex-col overflow-y-auto"
            >
              {/* Menu Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Menu</h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                
                {/* User Info */}
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                    {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.name || 'User'}</p>
                    <p className="text-gray-400 text-sm truncate">{user.email}</p>
                  </div>
                </div>
              </div>
              
              {/* Navigation Items */}
              <nav className="flex-1 p-4 space-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.path;
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <IconComponent className={`mr-3 h-5 w-5 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
                      {item.name}
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-indigo-400 rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>
              
              {/* User Actions */}
              <div className="p-4 border-t border-white/10 space-y-2">
                <button className="w-full flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                  <FiUser className="mr-3 h-5 w-5" />
                  Profile Settings
                </button>
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <FiLogOut className="mr-3 h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Click outside to close profile dropdown */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;