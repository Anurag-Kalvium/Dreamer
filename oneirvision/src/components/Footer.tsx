import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {

  return (
    <footer className="w-full bg-dark-bg border-t border-gray-800/30 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-8">
          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {/* Title and description removed */}
          </motion.div>
          
          <div className="w-full h-px bg-gray-800/50 my-4" />
          
          <div className="flex flex-col md:flex-row justify-between items-center w-full text-sm">
            <p className="text-light-gray">
              &copy; {new Date().getFullYear()} OneirVision. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-light-gray hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-light-gray hover:text-white transition-colors">Terms of Service</a>
              <a href="/contact" className="text-light-gray hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
