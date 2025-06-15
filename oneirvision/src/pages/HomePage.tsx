import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Brain, 
  Zap, 
  Palette,
  BookOpen,
  TrendingUp,
  ChevronDown,
  Play,
  Download,
  Shield,
  Heart,
  Target,
  Users,
  Clock,
  Star,
  Eye,
  Moon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Spline from '@splinetool/react-spline';

const HomePage = () => {
  const { user } = useAuth();
  const controls = useAnimation();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [splineLoaded, setSplineLoaded] = useState(false);

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Mouse tracking for interactive elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animate elements on mount
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
    });
  }, [controls]);

  const journalingBenefits = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'Enhanced Self-Awareness',
      description: 'Discover patterns in your subconscious mind and gain deeper insights into your thoughts, emotions, and behaviors through consistent dream tracking.',
      gradient: 'from-indigo-500/20 to-purple-500/20',
      border: 'border-indigo-500/20'
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Emotional Processing',
      description: 'Process complex emotions and experiences in a safe space. Dreams often reflect our deepest feelings and help us work through challenges.',
      gradient: 'from-pink-500/20 to-rose-500/20',
      border: 'border-pink-500/20'
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: 'Creative Inspiration',
      description: 'Unlock unlimited creative potential by capturing and exploring the vivid imagery and innovative ideas that emerge from your dreams.',
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/20'
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Improved Dream Recall',
      description: 'Regular journaling significantly improves your ability to remember dreams, leading to richer and more detailed dream experiences.',
      gradient: 'from-green-500/20 to-teal-500/20',
      border: 'border-green-500/20'
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: 'Lucid Dream Training',
      description: 'Identify recurring dream signs and patterns that can trigger lucidity, helping you become conscious within your dreams.',
      gradient: 'from-yellow-500/20 to-amber-500/20',
      border: 'border-yellow-500/20'
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Personal Growth',
      description: 'Track your psychological and spiritual development over time, observing how your dreams evolve as you grow and change.',
      gradient: 'from-blue-500/20 to-indigo-500/20',
      border: 'border-blue-500/20'
    }
  ];

  const whyChooseUs = [
    {
      icon: <Brain className="h-12 w-12" />,
      title: 'AI-Powered Analysis',
      description: 'Advanced neural networks decode hidden meanings in your dreams with scientific accuracy.',
      color: 'text-indigo-400'
    },
    {
      icon: <Palette className="h-12 w-12" />,
      title: 'Visual Dream Creation',
      description: 'Transform your dreams into stunning artwork using state-of-the-art AI image generation.',
      color: 'text-purple-400'
    },
    {
      icon: <BookOpen className="h-12 w-12" />,
      title: 'Comprehensive Journaling',
      description: 'Intuitive tools for capturing, organizing, and reflecting on your dream experiences.',
      color: 'text-pink-400'
    },
    {
      icon: <Sparkles className="h-12 w-12" />,
      title: 'Lucid Dream Training',
      description: 'Guided techniques and tools to help you achieve consciousness within your dreams.',
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0D041B]">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-indigo-900/10 to-[#0D041B]" />
        
        {/* Interactive floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full mix-blend-screen"
              style={{
                width: Math.random() * 300 + 100 + 'px',
                height: Math.random() * 300 + 100 + 'px',
                background: `radial-gradient(circle, ${
                  Math.random() > 0.5 ? 'rgba(168, 85, 247, 0.1)' : 'rgba(99, 102, 241, 0.1)'
                }, transparent 70%)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 200 + mousePosition.x * 20],
                y: [0, (Math.random() - 0.5) * 200 + mousePosition.y * 20],
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.1, 1],
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

      {/* Hero Section with Spline Integration */}
      <motion.div 
        ref={heroRef}
        className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
        style={{ y: heroY }}
      >
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={controls}
            className="text-left lg:pr-8"
          >
            {/* Floating Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8 hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="h-5 w-5 text-indigo-300 mr-2 animate-pulse" />
              <span className="text-sm font-medium text-indigo-200">
                ✨ Discover Your Subconscious Universe
              </span>
            </motion.div>
            
            {/* Main Heading */}
            <motion.h1 
              className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 font-heading"
              style={{
                background: 'linear-gradient(90deg, #FFFFFF 0%, #E0EAFF 50%, #C7D2FE 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(168, 85, 247, 0.4)',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              OneirVision
            </motion.h1>
            
            {/* Subheading */}
            <motion.h2 
              className="text-2xl md:text-3xl text-gray-200 mb-6 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              AI-Powered Dream Interpretation & Visualization
            </motion.h2>
            
            {/* Description */}
            <motion.p 
              className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Unlock the hidden meaning of your dreams with powerful AI. Visualize them in stunning detail, 
              reflect on their deeper significance, and discover your inner universe like never before.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Link
                to={user ? '/dashboard' : '/auth'}
                className="group relative px-8 py-4 bg-gradient-to-r from-[#A855F7] to-[#6366F1] text-white font-semibold text-lg rounded-full hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 overflow-hidden"
              >
                <span className="relative z-10">
                  {user ? 'Enter Dream World' : 'Start Your Journey'}
                </span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              
              <button className="group px-8 py-4 bg-transparent border-2 border-white/20 text-white font-semibold text-lg rounded-full hover:bg-white/5 hover:border-white/40 transition-all duration-300 flex items-center justify-center space-x-3">
                <Play className="h-5 w-5" />
                <span>Watch Demo</span>
              </button>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
              className="flex items-center text-gray-400 text-sm"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="mr-2">Explore More</span>
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </motion.div>

          {/* Right Column - Spline 3D Scene */}
          <motion.div
            className="relative h-[600px] lg:h-[700px] w-full"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {/* Loading State */}
            {!splineLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400 mx-auto mb-4"></div>
                  <p className="text-gray-300">Loading 3D Experience...</p>
                </div>
              </div>
            )}
            
            {/* Spline 3D Scene */}
            <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-sm">
              <Spline
                scene="https://prod.spline.design/UHRqonUo1dsSkR59/scene.splinecode"
                onLoad={() => setSplineLoaded(true)}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            
            {/* Floating Elements around Spline */}
            <motion.div
              className="absolute -top-4 -right-4 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="h-6 w-6 text-purple-300" />
            </motion.div>
            
            <motion.div
              className="absolute -bottom-4 -left-4 p-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Brain className="h-6 w-6 text-blue-300" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Why Choose Dream Journaling Section */}
      <div className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
              Why Dream Journaling?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the transformative power of recording and analyzing your dreams with cutting-edge AI technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {journalingBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                className={`group relative bg-white/5 backdrop-blur-sm border ${benefit.border} rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300 border border-white/20`}>
                    {benefit.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose OneirVision Section */}
      <div className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
              Why Choose OneirVision?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the most advanced dream analysis platform with cutting-edge AI and intuitive design
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
                  <div className={`${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300 flex justify-center`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="relative z-10 py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-12">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-8">
                Ready to Explore Your Dreams?
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Join thousands of dreamers who have discovered the hidden meanings in their subconscious mind with OneirVision.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link
                  to={user ? '/analyze' : '/auth'}
                  className="group px-10 py-5 bg-gradient-to-r from-[#A855F7] to-[#6366F1] text-white font-semibold text-lg rounded-full hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3"
                >
                  <Zap className="h-6 w-6" />
                  <span>Start Analyzing Dreams</span>
                  <ArrowRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" />
                </Link>
                
                <Link
                  to="/journal"
                  className="group px-10 py-5 bg-transparent border-2 border-white/20 text-white font-semibold text-lg rounded-full hover:bg-white/5 hover:border-white/40 transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <BookOpen className="h-6 w-6" />
                  <span>Start Dream Journal</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;