import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Eye, 
  Lightbulb, 
  Target, 
  Clock, 
  Moon, 
  Star, 
  Zap, 
  BookOpen, 
  Play,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Timer,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Award,
  Compass
} from 'lucide-react';

interface Technique {
  id: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeRequired: string;
  steps: string[];
  icon: React.ReactNode;
}

interface Benefit {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface Fact {
  title: string;
  description: string;
  category: 'Scientific' | 'Historical' | 'Cultural' | 'Statistical';
  icon: React.ReactNode;
}

const LucidityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'benefits' | 'toolkit' | 'facts'>('overview');
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [dreamJournalDays, setDreamJournalDays] = useState(0);

  useEffect(() => {
    // Simulate dream journal tracking
    const interval = setInterval(() => {
      setDreamJournalDays(prev => prev + 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const benefits: Benefit[] = [
    {
      title: 'Enhanced Creativity',
      description: 'Lucid dreaming provides unlimited creative exploration, allowing artists, writers, and innovators to practice and experiment in a consequence-free environment.',
      icon: <Lightbulb className="h-8 w-8" />,
      color: 'from-yellow-400 to-orange-500'
    },
    {
      title: 'Overcome Nightmares',
      description: 'Take control of recurring nightmares by becoming lucid and transforming frightening scenarios into empowering experiences.',
      icon: <Shield className="h-8 w-8" />,
      color: 'from-green-400 to-teal-500'
    },
    {
      title: 'Skill Practice',
      description: 'Athletes and performers use lucid dreaming to mentally rehearse complex movements and techniques, improving real-world performance.',
      icon: <Target className="h-8 w-8" />,
      color: 'from-blue-400 to-indigo-500'
    },
    {
      title: 'Emotional Healing',
      description: 'Process trauma, confront fears, and work through emotional challenges in a safe, controlled dream environment.',
      icon: <Heart className="h-8 w-8" />,
      color: 'from-pink-400 to-rose-500'
    },
    {
      title: 'Spiritual Exploration',
      description: 'Many practitioners report profound spiritual experiences and deeper self-understanding through conscious dreaming.',
      icon: <Compass className="h-8 w-8" />,
      color: 'from-purple-400 to-violet-500'
    },
    {
      title: 'Problem Solving',
      description: 'Access your subconscious mind to find creative solutions to complex problems and gain new perspectives.',
      icon: <Brain className="h-8 w-8" />,
      color: 'from-indigo-400 to-purple-500'
    }
  ];

  const techniques: Technique[] = [
    {
      id: 'reality-checks',
      name: 'Reality Checks',
      description: 'Develop the habit of questioning reality throughout the day to trigger lucidity in dreams.',
      difficulty: 'Beginner',
      timeRequired: '2-4 weeks',
      icon: <Eye className="h-6 w-6" />,
      steps: [
        'Look at your hands and count your fingers',
        'Check digital clocks twice (time often changes in dreams)',
        'Read text, look away, then read again',
        'Ask yourself "Am I dreaming?" throughout the day',
        'Perform reality checks whenever something seems unusual'
      ]
    },
    {
      id: 'mild',
      name: 'MILD Technique',
      description: 'Mnemonic Induction of Lucid Dreams - use intention and memory to become lucid.',
      difficulty: 'Intermediate',
      timeRequired: '4-8 weeks',
      icon: <Brain className="h-6 w-6" />,
      steps: [
        'As you fall asleep, repeat "Next time I\'m dreaming, I will remember I\'m dreaming"',
        'Visualize yourself becoming lucid in a recent dream',
        'Set a strong intention to recognize dream signs',
        'Practice during afternoon naps for better results',
        'Combine with reality checks for maximum effectiveness'
      ]
    },
    {
      id: 'wake-back-to-bed',
      name: 'Wake-Back-to-Bed (WBTB)',
      description: 'Wake up early, stay awake briefly, then return to sleep to enter REM sleep consciously.',
      difficulty: 'Intermediate',
      timeRequired: '2-6 weeks',
      icon: <Clock className="h-6 w-6" />,
      steps: [
        'Sleep for 4-6 hours, then wake up',
        'Stay awake for 15-30 minutes',
        'Think about lucid dreaming and set intentions',
        'Return to sleep with the goal of becoming lucid',
        'Practice relaxation techniques as you fall back asleep'
      ]
    },
    {
      id: 'dream-journal',
      name: 'Dream Journaling',
      description: 'Record your dreams to improve dream recall and identify recurring dream signs.',
      difficulty: 'Beginner',
      timeRequired: 'Ongoing',
      icon: <BookOpen className="h-6 w-6" />,
      steps: [
        'Keep a journal and pen beside your bed',
        'Write down dreams immediately upon waking',
        'Record even small fragments or feelings',
        'Look for patterns and recurring themes',
        'Use dream signs as triggers for reality checks'
      ]
    },
    {
      id: 'meditation',
      name: 'Meditation & Mindfulness',
      description: 'Develop awareness and consciousness that carries over into your dreams.',
      difficulty: 'Beginner',
      timeRequired: '4-12 weeks',
      icon: <Star className="h-6 w-6" />,
      steps: [
        'Practice daily meditation for 10-20 minutes',
        'Focus on present moment awareness',
        'Observe thoughts without judgment',
        'Practice mindfulness throughout the day',
        'Use meditation before sleep to maintain consciousness'
      ]
    },
    {
      id: 'supplements',
      name: 'Natural Supplements',
      description: 'Certain supplements may enhance dream vividness and recall (consult healthcare provider).',
      difficulty: 'Advanced',
      timeRequired: 'Varies',
      icon: <Zap className="h-6 w-6" />,
      steps: [
        'Research Galantamine, Choline, and B6 supplements',
        'Consult with a healthcare professional first',
        'Start with low doses and monitor effects',
        'Combine with other techniques for best results',
        'Track your dream experiences and supplement timing'
      ]
    }
  ];

  const facts: Fact[] = [
    {
      title: 'Ancient Practice',
      description: 'Tibetan Buddhists have practiced "dream yoga" for over 1,000 years, using lucid dreaming as a spiritual practice to achieve enlightenment.',
      category: 'Historical',
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      title: 'Brain Activity Surge',
      description: 'During lucid dreams, the brain shows increased activity in the prefrontal cortex - the area responsible for self-awareness and critical thinking.',
      category: 'Scientific',
      icon: <Brain className="h-6 w-6" />
    },
    {
      title: 'Natural Phenomenon',
      description: '55% of people have experienced at least one lucid dream in their lifetime, and 23% experience lucid dreams once a month or more.',
      category: 'Statistical',
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      title: 'Time Dilation',
      description: 'Time perception in lucid dreams can be dramatically different - some dreamers report experiencing hours or even days within minutes of REM sleep.',
      category: 'Scientific',
      icon: <Timer className="h-6 w-6" />
    },
    {
      title: 'Healing Powers',
      description: 'Studies show that lucid dreaming can help reduce nightmare frequency by up to 80% in people with chronic nightmares.',
      category: 'Scientific',
      icon: <Heart className="h-6 w-6" />
    },
    {
      title: 'Cultural Significance',
      description: 'The Senoi tribe of Malaysia built their entire culture around dream sharing and lucid dreaming, believing dreams guide daily life decisions.',
      category: 'Cultural',
      icon: <Users className="h-6 w-6" />
    },
    {
      title: 'Athletic Enhancement',
      description: 'Olympic athletes use lucid dreaming to practice routines, with some reporting improved performance after dream training sessions.',
      category: 'Scientific',
      icon: <Award className="h-6 w-6" />
    },
    {
      title: 'Frequency Peak',
      description: 'Lucid dreams occur most frequently during the early morning hours (4-6 AM) when REM sleep is most intense and prolonged.',
      category: 'Scientific',
      icon: <Clock className="h-6 w-6" />
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-500/20';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'Advanced': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Scientific': return 'from-blue-400 to-indigo-500';
      case 'Historical': return 'from-amber-400 to-orange-500';
      case 'Cultural': return 'from-purple-400 to-pink-500';
      case 'Statistical': return 'from-green-400 to-teal-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#0D041B] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-indigo-900/10 to-[#0D041B]" />
        {[...Array(8)].map((_, i) => (
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
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            <motion.div
              className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8 hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="h-5 w-5 text-purple-300 mr-2 animate-pulse" />
              <span className="text-sm font-medium text-purple-200">
                ✨ Master Your Dream Reality
              </span>
            </motion.div>

            <motion.h1 
              className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 font-heading"
              style={{
                background: 'linear-gradient(90deg, #FFFFFF 0%, #E0EAFF 50%, #C7D2FE 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(168, 85, 247, 0.4)',
              }}
            >
              Lucid Dreaming
            </motion.h1>
            
            <motion.h2 
              className="text-2xl md:text-3xl lg:text-4xl text-gray-200 mb-8 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Conscious Control of Your Dream World
            </motion.h2>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Discover the ancient art and modern science of lucid dreaming. Learn to become conscious within your dreams and unlock unlimited creative potential.
            </motion.p>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {[
              { id: 'overview', label: 'Overview', icon: <Eye className="h-5 w-5" /> },
              { id: 'benefits', label: 'Benefits', icon: <TrendingUp className="h-5 w-5" /> },
              { id: 'toolkit', label: 'Toolkit', icon: <Target className="h-5 w-5" /> },
              { id: 'facts', label: 'Amazing Facts', icon: <Sparkles className="h-5 w-5" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Content Sections */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-12"
              >
                {/* What is Lucid Dreaming */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <Brain className="h-8 w-8 text-purple-400 mr-4" />
                    <h2 className="text-3xl font-bold text-white">What is Lucid Dreaming?</h2>
                  </div>
                  <p className="text-lg text-gray-300 leading-relaxed mb-6">
                    Lucid dreaming is the phenomenon of becoming aware that you are dreaming while still in the dream state. 
                    This awareness allows you to potentially control and direct your dream experience, opening up infinite 
                    possibilities for exploration, creativity, and personal growth.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl border border-purple-500/30">
                      <Eye className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Awareness</h3>
                      <p className="text-gray-300">Recognize you're in a dream state</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-xl border border-indigo-500/30">
                      <Target className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Control</h3>
                      <p className="text-gray-300">Direct your dream experience</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-xl border border-blue-500/30">
                      <Lightbulb className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Explore</h3>
                      <p className="text-gray-300">Unlimited creative possibilities</p>
                    </div>
                  </div>
                </div>

                {/* YouTube Video */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <Play className="h-8 w-8 text-red-400 mr-4" />
                    <h2 className="text-3xl font-bold text-white">Learn from the Experts</h2>
                  </div>
                  <div className="aspect-video rounded-xl overflow-hidden bg-gray-900/50 border border-white/20">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/YQjAIlFZWWc"
                      title="The Science of Lucid Dreaming"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                  <p className="text-gray-300 mt-4 text-center">
                    "The Science of Lucid Dreaming" - A comprehensive introduction to the research and techniques
                  </p>
                </div>

                {/* External Resources */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <BookOpen className="h-8 w-8 text-green-400 mr-4" />
                    <h2 className="text-3xl font-bold text-white">Learn More</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <a
                      href="https://en.wikipedia.org/wiki/Lucid_dream"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-6 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all group"
                    >
                      <ExternalLink className="h-8 w-8 text-blue-400 mr-4 group-hover:scale-110 transition-transform" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Wikipedia: Lucid Dreams</h3>
                        <p className="text-gray-300">Comprehensive scientific overview and research</p>
                      </div>
                    </a>
                    <a
                      href="https://en.wikipedia.org/wiki/Dream_yoga"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all group"
                    >
                      <ExternalLink className="h-8 w-8 text-purple-400 mr-4 group-hover:scale-110 transition-transform" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Dream Yoga</h3>
                        <p className="text-gray-300">Ancient Tibetan Buddhist practices</p>
                      </div>
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'benefits' && (
              <motion.div
                key="benefits"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                        {benefit.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">{benefit.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'toolkit' && (
              <motion.div
                key="toolkit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Progress Tracker */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <CheckCircle className="h-8 w-8 text-green-400 mr-4" />
                      <h2 className="text-3xl font-bold text-white">Your Progress</h2>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-400">{dreamJournalDays}</div>
                      <div className="text-sm text-gray-400">Days practicing</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl">
                      <BookOpen className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <div className="text-xl font-bold text-white">Dream Journal</div>
                      <div className="text-sm text-gray-300">Track your dreams daily</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl">
                      <Eye className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-xl font-bold text-white">Reality Checks</div>
                      <div className="text-sm text-gray-300">Build awareness habits</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                      <Star className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-xl font-bold text-white">Meditation</div>
                      <div className="text-sm text-gray-300">Enhance consciousness</div>
                    </div>
                  </div>
                </div>

                {/* Techniques Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {techniques.map((technique, index) => (
                    <motion.div
                      key={technique.id}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onClick={() => setSelectedTechnique(selectedTechnique === technique.id ? null : technique.id)}
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center mr-4 text-indigo-400">
                            {technique.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{technique.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(technique.difficulty)}`}>
                                {technique.difficulty}
                              </span>
                              <span className="text-sm text-gray-400">{technique.timeRequired}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${selectedTechnique === technique.id ? 'rotate-90' : ''}`} />
                      </div>
                      
                      <p className="text-gray-300 mb-4">{technique.description}</p>
                      
                      <AnimatePresence>
                        {selectedTechnique === technique.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-white/10 pt-4"
                          >
                            <h4 className="text-lg font-semibold text-white mb-3">Step-by-Step Guide:</h4>
                            <ol className="space-y-2">
                              {technique.steps.map((step, stepIndex) => (
                                <li key={stepIndex} className="flex items-start">
                                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-500/30 text-indigo-300 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                                    {stepIndex + 1}
                                  </span>
                                  <span className="text-gray-300">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'facts' && (
              <motion.div
                key="facts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {facts.map((fact, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${getCategoryColor(fact.category)} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                          {fact.icon}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(fact.category)} text-white`}>
                          {fact.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{fact.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{fact.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Call to Action */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Lucid Dreaming Journey?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Begin with dream journaling and reality checks. Track your progress and unlock the infinite potential of your dream world.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                  Start Dream Journal
                </button>
                <button className="px-8 py-4 bg-transparent border-2 border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 hover:border-white/40 transition-all duration-300">
                  Learn More Techniques
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Add missing Shield component
const Shield: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

// Add missing Heart component
const Heart: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

export default LucidityPage;