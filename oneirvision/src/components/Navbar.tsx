import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Transition } from '@headlessui/react';
import { Bars3Icon as MenuIcon, XMarkIcon as XIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Interpreter', path: '/interpreter' },
    { name: 'Visualizer', path: '/visualizer' },
    { name: 'Journal', path: '/journal' },
    { name: 'About', path: '/about' }
  ];

  return (
    <motion.nav 
      className="fixed w-full top-0 z-50 glassmorphism border-b border-gray-800/30"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <motion.h1 
                className="text-2xl font-bold navbar-title"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, duration: 0.3 }}
              >
                OneirVision
              </motion.h1>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item, index) => (
                <motion.div key={item.name} className="relative group">
                  <Link
                    to={item.path}
                    className={`${
                      location.pathname === item.path
                        ? 'text-white'
                        : 'text-light-gray hover:text-white'
                    } px-3 py-2 rounded-md text-sm font-medium relative`}
                  >
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3, type: 'spring' }}
                    >
                      {item.name}
                    </motion.span>
                  </Link>
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-vivid-blue to-accent-pink transition-all duration-300 ${
                    location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-dark-bg/50 backdrop-blur-sm inline-flex items-center justify-center p-2 rounded-md text-light-gray hover:text-white focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <Transition
        show={isOpen}
        enter="transition ease-out duration-300"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-200"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="md:hidden backdrop-blur-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-dark-bg/90">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? 'text-white border-l-2 border-accent-pink'
                    : 'text-light-gray hover:text-white border-l-2 border-transparent hover:border-accent-pink'
                } block px-3 py-2 rounded-md text-base font-medium transition-all duration-200`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </Transition>
    </motion.nav>
  );
};

export default Navbar;
