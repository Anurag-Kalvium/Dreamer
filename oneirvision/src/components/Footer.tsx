import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-dark-bg border-t border-gray-800/30 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-5">
        <div className="flex flex-col items-center justify-between">
          {/* Footer content */}
          <div className="flex flex-col md:flex-row justify-between items-center w-full text-sm">
            <p className="text-light-gray">
              &copy; {new Date().getFullYear()} OneirVision. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-3 md:mt-0">
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
