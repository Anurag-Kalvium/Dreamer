import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { ArrowRight, Sparkles, Brain, Eye, BookOpen, Star, Zap, Heart, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a]">
      {/* Animated Background with ReactBits-style gradients */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a]" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={controls}
                className="text-left"
              >
                {/* Badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
                >
                  <Sparkles className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-sm font-medium text-gray-300">
                    Discover Your Subconscious
                  </span>
                </motion.div>
                
                {/* Main Heading - ReactBits style */}
                <motion.h1 
                  className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 50%, #9ca3af 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  OneirVision
                </motion.h1>
                
                {/* Subheading */}
                <motion.h2 
                  className="text-xl md:text-2xl text-gray-400 mb-8 font-normal leading-relaxed max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  AI-powered dream interpretation and visualization platform that unlocks the hidden meanings in your subconscious mind.
                </motion.h2>
                
                {/* CTA Buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <Link
                    to={user ? '/dashboard' : '/auth'}
                    className="group relative px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>{user ? 'Go to Dashboard' : 'Start Exploring'}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                  
                  <Link
                    to="/analyze"
                    className="px-6 py-3 bg-transparent border border-gray-700 text-gray-300 font-medium rounded-lg hover:border-gray-600 hover:bg-white/5 transition-all duration-200"
                  >
                    Try Demo
                  </Link>
                </motion.div>

                {/* Stats */}
                <motion.div 
                  className="flex items-center space-x-8 text-sm text-gray-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>AI-Powered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Dream Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span>Instant Results</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Content - 3D Component Placeholder */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="relative h-[500px] lg:h-[600px] flex items-center justify-center"
              >
                {/* Placeholder for 3D component */}
                <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-gray-400 text-sm">3D Dream Visualization</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
                Unlock Your Dream World
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Advanced AI technology meets dream psychology to provide deep insights into your subconscious mind.
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Brain className="h-6 w-6" />,
                  title: 'AI Dream Analysis',
                  description: 'Advanced natural language processing analyzes your dreams to extract meaningful patterns and symbols.',
                  gradient: 'from-blue-500/20 to-cyan-500/20',
                  border: 'border-blue-500/20'
                },
                {
                  icon: <Eye className="h-6 w-6" />,
                  title: 'Visual Generation',
                  description: 'Transform your dreams into stunning visual representations using state-of-the-art AI image generation.',
                  gradient: 'from-purple-500/20 to-pink-500/20',
                  border: 'border-purple-500/20'
                },
                {
                  icon: <BookOpen className="h-6 w-6" />,
                  title: 'Dream Journal',
                  description: 'Keep track of your dreams over time and discover recurring themes and personal growth patterns.',
                  gradient: 'from-green-500/20 to-emerald-500/20',
                  border: 'border-green-500/20'
                },
                {
                  icon: <Heart className="h-6 w-6" />,
                  title: 'Emotional Insights',
                  description: 'Understand the emotional undertones of your dreams and how they relate to your waking life.',
                  gradient: 'from-red-500/20 to-rose-500/20',
                  border: 'border-red-500/20'
                },
                {
                  icon: <Target className="h-6 w-6" />,
                  title: 'Personalized Reports',
                  description: 'Receive detailed, personalized interpretations tailored to your unique dream patterns and psychology.',
                  gradient: 'from-orange-500/20 to-yellow-500/20',
                  border: 'border-orange-500/20'
                },
                {
                  icon: <Zap className="h-6 w-6" />,
                  title: 'Instant Processing',
                  description: 'Get immediate insights and visualizations powered by cutting-edge AI technology.',
                  gradient: 'from-indigo-500/20 to-blue-500/20',
                  border: 'border-indigo-500/20'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className={`group relative p-6 bg-white/5 backdrop-blur-sm border ${feature.border} rounded-xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} mb-4 text-white`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
                  How It Works
                </h2>
                <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                  Our advanced AI system processes your dream descriptions through multiple layers of analysis to provide comprehensive insights.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      step: '01',
                      title: 'Describe Your Dream',
                      description: 'Share your dream experience in natural language - as detailed or brief as you like.'
                    },
                    {
                      step: '02',
                      title: 'AI Analysis',
                      description: 'Our AI processes symbols, emotions, and themes using advanced natural language understanding.'
                    },
                    {
                      step: '03',
                      title: 'Get Insights',
                      description: 'Receive detailed interpretations, visual representations, and personalized recommendations.'
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                        <p className="text-gray-400">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right Content - 3D Component Placeholder */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative h-[400px] lg:h-[500px] flex items-center justify-center"
              >
                {/* Placeholder for 3D component */}
                <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-gray-400 text-sm">3D Process Visualization</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-12"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
                Ready to Explore Your Dreams?
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
                Join thousands of users who have discovered deeper insights into their subconscious minds through AI-powered dream analysis.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to={user ? '/dashboard' : '/auth'}
                  className="group relative px-8 py-4 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>{user ? 'Go to Dashboard' : 'Get Started Free'}</span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                
                <Link
                  to="/analyze"
                  className="px-8 py-4 bg-transparent border border-gray-700 text-gray-300 font-medium rounded-lg hover:border-gray-600 hover:bg-white/5 transition-all duration-200"
                >
                  Try Demo
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;