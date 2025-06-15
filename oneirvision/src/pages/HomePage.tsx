import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Brain, 
  Eye, 
  BookOpen, 
  Zap, 
  Moon, 
  Stars,
  Palette,
  TrendingUp,
  Users,
  Award,
  ChevronDown,
  Play,
  Download,
  Share2,
  Heart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import StarField from '../components/StarField';
import ParallaxSection from '../components/ParallaxSection';

const HomePage = () => {
  const { user } = useAuth();
  const controls = useAnimation();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const starsY = useTransform(scrollYProgress, [0, 1], [0, -100]);

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

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'AI Dream Analysis',
      description: 'Advanced neural networks decode the hidden meanings in your dreams with 95% accuracy.',
      gradient: 'from-indigo-500 to-purple-600',
      stats: '10M+ Dreams Analyzed'
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: 'Visual Dream Creation',
      description: 'Transform your dreams into stunning artwork using state-of-the-art AI image generation.',
      gradient: 'from-purple-500 to-pink-600',
      stats: '500K+ Images Generated'
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Pattern Recognition',
      description: 'Discover recurring themes and symbols in your dreams to unlock deeper insights.',
      gradient: 'from-pink-500 to-red-600',
      stats: '85% Pattern Accuracy'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Dream Community',
      description: 'Connect with fellow dreamers and share your most fascinating dream experiences.',
      gradient: 'from-green-500 to-teal-600',
      stats: '100K+ Active Users'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Psychology Student',
      content: 'OneirVision helped me understand my recurring dreams about flying. The AI analysis was incredibly insightful!',
      avatar: '👩‍🎓',
      rating: 5
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Artist',
      content: 'The dream visualizations are breathtaking. I use them as inspiration for my artwork.',
      avatar: '🎨',
      rating: 5
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Sleep Researcher',
      content: 'As a professional, I\'m impressed by the accuracy of the dream interpretation algorithms.',
      avatar: '👩‍⚕️',
      rating: 5
    }
  ];

  const stats = [
    { number: '2M+', label: 'Dreams Interpreted' },
    { number: '500K+', label: 'Active Users' },
    { number: '95%', label: 'Accuracy Rate' },
    { number: '24/7', label: 'AI Availability' }
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0D041B]">
      {/* 3D Animated Star Field Background */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{ y: starsY }}
      >
        <StarField count={3000} />
      </motion.div>

      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-indigo-900/10 to-[#0D041B]" />
        
        {/* Interactive floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
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

      {/* Hero Section */}
      <motion.div 
        ref={heroRef}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-24"
        style={{ y: heroY }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={controls}
          className="text-center max-w-6xl mx-auto w-full"
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
          
          {/* Main Heading with Gradient Animation */}
          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 font-heading relative"
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
          
          {/* Animated Subheading */}
          <motion.h2 
            className="text-2xl md:text-3xl lg:text-4xl text-gray-200 mb-8 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            AI-Powered Dream Interpretation & Visualization Platform
          </motion.h2>
          
          {/* Enhanced Description */}
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Unlock the hidden meaning of your dreams with powerful AI. Visualize them in stunning detail, 
            reflect on their deeper significance, and discover your inner universe like never before.
          </motion.p>
          
          {/* Enhanced CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link
              to={user ? '/dashboard' : '/auth'}
              className="group relative px-10 py-5 bg-gradient-to-r from-[#A855F7] to-[#6366F1] text-white font-semibold text-lg rounded-full hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 overflow-hidden"
            >
              <span className="relative z-10">
                {user ? 'Enter Dream World' : 'Start Your Journey'}
              </span>
              <ArrowRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            
            <button className="group px-10 py-5 bg-transparent border-2 border-white/20 text-white font-semibold text-lg rounded-full hover:bg-white/5 hover:border-white/40 transition-all duration-300 flex items-center justify-center space-x-3">
              <Play className="h-6 w-6" />
              <span>Watch Demo</span>
            </button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="flex flex-col items-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-gray-400 text-sm mb-2">Explore More</span>
            <ChevronDown className="h-6 w-6 text-gray-400" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Stats Section with Parallax */}
      <ParallaxSection speed={0.3} className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </ParallaxSection>

      {/* Enhanced Features Section */}
      <ParallaxSection speed={0.4} className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of dream analysis with our cutting-edge AI technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full">
                      {feature.stats}
                    </span>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Testimonials Section */}
      <ParallaxSection speed={0.2} className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
              What Dreamers Say
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of users who have unlocked the secrets of their dreams
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-6">
                  <div className="text-4xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Stars key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Call to Action Section */}
      <ParallaxSection speed={0.1} className="relative z-10 py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-8">
              Ready to Explore Your Dreams?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join millions of dreamers who have discovered the hidden meanings in their subconscious mind.
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
              
              <button className="group px-10 py-5 bg-transparent border-2 border-white/20 text-white font-semibold text-lg rounded-full hover:bg-white/5 hover:border-white/40 transition-all duration-300 flex items-center justify-center space-x-3">
                <Download className="h-6 w-6" />
                <span>Download App</span>
              </button>
            </div>
          </motion.div>
        </div>
      </ParallaxSection>
    </div>
  );
};

export default HomePage;