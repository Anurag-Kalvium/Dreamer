import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import LoginButton from './LoginButton';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Load Spline script and initialize viewer
  useEffect(() => {
    // Create script element for Spline viewer
    const splineScript = document.createElement('script');
    splineScript.type = 'module';
    splineScript.src = 'https://unpkg.com/@splinetool/viewer@1.9.95/build/spline-viewer.js';
    document.head.appendChild(splineScript);
    
    // Create and append the spline-viewer element after script loads
    splineScript.onload = () => {
      const container = document.getElementById('spline-container');
      if (container) {
        const splineViewer = document.createElement('spline-viewer');
        splineViewer.setAttribute('url', 'https://prod.spline.design/2jgf14wgjtIOa06o/scene.splinecode');
        splineViewer.style.width = '100%';
        splineViewer.style.height = '100%';
        container.appendChild(splineViewer);
      }
    };
    
    // Cleanup function
    return () => {
      document.head.removeChild(splineScript);
    };
  }, []);

  // Animation variants for staggered animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.6,
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  const gradientWave = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 0.7, 
      y: 0,
      transition: {
        delay: 1.2,
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-dark-bg">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-deep-purple/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-vivid-blue/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-2/3 left-1/3 w-60 h-60 bg-accent-pink/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Spline 3D Model Container */}
      <div className="absolute inset-0 w-full h-full z-1 overflow-hidden" id="spline-container">
        {/* Spline model will be loaded here via script */}
      </div>
      
      {/* Overlay div to hide Spline badge */}
      <div className="absolute bottom-2 right-4 w-[500px] h-[50px] bg-dark-bg z-10 pointer-events-none"></div>

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <motion.div 
          className="text-center px-4"
          variants={container}
          initial="hidden"
          animate="show"
        >

          
          <motion.div 
            className="mt-10"
            variants={item}
          >
            <motion.button 
              className="px-8 py-4 bg-gradient-to-r from-vivid-blue via-deep-purple to-accent-pink text-white font-medium rounded-full hover:shadow-xl hover:shadow-accent-pink/30 transition-all duration-300 relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => isAuthenticated ? navigate('/interpreter') : navigate('/auth')}
            >
              <span className="relative z-10 flex items-center">
                {isAuthenticated ? 'Explore my dreams' : 'Get Started'}
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-accent-pink via-deep-purple to-vivid-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient Wave Animation at Bottom */}
      <motion.div 
        className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-deep-purple/20 to-transparent z-[5] opacity-70"
        variants={gradientWave}
        initial="hidden"
        animate="show"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1440 320\'%3E%3Cpath fill=\'%238A2BE2\' fill-opacity=\'0.2\' d=\'M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,176C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z\'%3E%3C/path%3E%3C/svg%3E")',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      />
    </div>
  );
};

export default HeroSection;
