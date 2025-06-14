import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { ArrowRight, Sparkles, Brain, Eye, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Add the fonts to your fonts.css or index.css
// @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');

const HomePage = () => {
  const { user } = useAuth();
  const controls = useAnimation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animate elements on mount
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
    });
  }, [controls]);

  // Initialize canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Cleanup
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0D041B]">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-indigo-900/10 to-[#0D041B]" />
        
        {/* Animated elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full mix-blend-screen"
              style={{
                width: Math.random() * 400 + 100 + 'px',
                height: Math.random() * 400 + 100 + 'px',
                background: `radial-gradient(circle, ${
                  Math.random() > 0.5 ? 'rgba(168, 85, 247, 0.1)' : 'rgba(99, 102, 241, 0.1)'
                }, transparent 70%)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 200],
                y: [0, (Math.random() - 0.5) * 200],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={controls}
          className="text-center max-w-5xl mx-auto w-full"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8"
          >
            <Sparkles className="h-5 w-5 text-indigo-300 mr-2" />
            <span className="text-sm font-medium text-indigo-200">
              Discover Your Subconscious
            </span>
          </motion.div>
          
          {/* Main Heading */}
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 font-heading"
            style={{
              background: 'linear-gradient(90deg, #FFFFFF 0%, #E0EAFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 20px rgba(168, 85, 247, 0.3)',
            }}
          >
            OneirVision
          </motion.h1>
          
          {/* Subheading */}
          <motion.h2 
            className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-8 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            AI-Powered Dream Interpretation & Visualization Platform
          </motion.h2>
          
          {/* Description */}
          <motion.p 
            className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Unlock the hidden meaning of your dreams with powerful AI. Visualize them, reflect on them, and discover your inner universe.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link
              to={user ? '/dashboard' : '/auth/register'}
              className="group relative px-8 py-4 bg-gradient-to-r from-[#A855F7] to-[#6366F1] text-white font-medium rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 overflow-hidden"
            >
              <span className="relative z-10">
                {user ? 'Go to Dashboard' : 'Start Exploring Dreams'}
              </span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            
            {!user && (
              <Link
                to="/auth/login"
                className="px-8 py-4 bg-transparent border-2 border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-all duration-300"
              >
                Sign In
              </Link>
            )}
          </motion.div>
          
          {/* Features Grid */}
          <motion.div 
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {[
              {
                icon: <Brain className="h-8 w-8 text-indigo-400" />,
                title: 'AI-Powered Analysis',
                description: 'Get deep insights into your dreams with advanced AI interpretation.'
              },
              {
                icon: <Eye className="h-8 w-8 text-purple-400" />,
                title: 'Dream Visualization',
                description: 'Transform your dreams into stunning visual representations.'
              },
              {
                icon: <BookOpen className="h-8 w-8 text-pink-400" />,
                title: 'Dream Journal',
                description: 'Keep track of your dreams and discover patterns over time.'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;