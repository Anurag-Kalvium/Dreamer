import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';

// Create typed icon components to fix TypeScript errors
const FiHome = FiIcons.FiHome as React.ComponentType<{ className?: string }>;
const FiMoon = FiIcons.FiMoon as React.ComponentType<{ className?: string }>;
const FiBookOpen = FiIcons.FiBookOpen as React.ComponentType<{ className?: string }>;
const FiBarChart2 = FiIcons.FiBarChart2 as React.ComponentType<{ className?: string }>;
const FiSettings = FiIcons.FiSettings as React.ComponentType<{ className?: string }>;
const FiMenu = FiIcons.FiMenu as React.ComponentType<{ className?: string }>;
const FiX = FiIcons.FiX as React.ComponentType<{ className?: string }>;
const FiPlus = FiIcons.FiPlus as React.ComponentType<{ className?: string }>;

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: <FiHome className="w-5 h-5" /> },
    { name: 'Dashboard', path: '/dashboard', icon: <FiBarChart2 className="w-5 h-5" /> },
    { name: 'Dream Analysis', path: '/analyze', icon: <FiMoon className="w-5 h-5" /> },
    { name: 'Journal', path: '/journal', icon: <FiBookOpen className="w-5 h-5" /> },
    { name: 'Insights', path: '/insights', icon: <FiBarChart2 className="w-5 h-5" /> },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = isOpen ? 'auto' : 'hidden';
  };

  // Close sidebar when clicking outside
  const handleClickOutside = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (isOpen && !target.closest('.sidebar-container')) {
      setIsOpen(false);
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-dark-bg/80 backdrop-blur-sm border border-gray-700 text-white lg:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClickOutside}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 w-64 bg-dark-bg/90 backdrop-blur-lg border-r border-gray-800 z-50 flex flex-col sidebar-container ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      >
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-vivid-blue to-deep-purple flex items-center justify-center">
            <FiMoon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-vivid-blue to-teal-400">
            OneirVision
          </h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-gradient-to-r from-vivid-blue/20 to-deep-purple/20 text-white border-l-4 border-vivid-blue'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
              onClick={() => {
                setIsOpen(false);
                document.body.style.overflow = 'auto';
              }}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link
            to="/analyze"
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-vivid-blue to-deep-purple text-white rounded-xl font-medium hover:shadow-lg hover:shadow-vivid-blue/20 transition-all"
            onClick={() => {
              setIsOpen(false);
              document.body.style.overflow = 'auto';
            }}
          >
            <FiPlus className="w-5 h-5" />
            <span>New Dream</span>
          </Link>
        </div>

        <div className="p-4 border-t border-gray-800">
          <Link
            to="/settings"
            className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              location.pathname === '/settings'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
            }`}
            onClick={() => {
              setIsOpen(false);
              document.body.style.overflow = 'auto';
            }}
          >
            <FiSettings className="w-5 h-5 mr-3" />
            Settings
          </Link>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
