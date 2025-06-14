import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDreamContext } from '../contexts/DreamContext';
import { FiDownload, FiSave, FiRefreshCw, FiEye, FiHeart, FiStar, FiMoon, FiSun, FiCloud, FiZap } from 'react-icons/fi';
import type { DreamVisualization } from '../contexts/DreamContext';

const DreamAnalysisPage: React.FC = () => {
  const { 
    interpretation, 
    interpretationLoading, 
    interpretationError, 
    interpretDreamAsync, 
    addDreamEntryAsync,
    visualization,
    visualizationHistory,
    visualizationLoading,
    visualizationError,
    generateVisualizationAsync,
    downloadVisualization,
  } = useDreamContext();
  
  const [dreamDescription, setDreamDescription] = useState('');
  const [dreamDate, setDreamDate] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'interpretation' | 'visualization'>('interpretation');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState<'input' | 'analyzing' | 'results'>('input');
  const [showQuote, setShowQuote] = useState(false);

  const dreamExamples = [
    "I was flying over a city made of crystal, where each building reflected my deepest memories. The sky was painted in shades of purple and gold, and floating islands drifted like thoughts in the wind.",
    "I found myself underwater in an ancient temple, breathing as naturally as on land. Fish with human eyes guided me through corridors lined with glowing hieroglyphs that seemed to tell my life story.",
    "I walked through a forest where the trees whispered secrets in languages I'd never heard but somehow understood. The ground beneath me shifted like ocean waves, and every step revealed new paths.",
    "I was in a library with infinite shelves that stretched beyond the clouds. Each book contained a different version of my life, and I could step into any story by opening its pages.",
    "I stood in a garden where flowers bloomed in reverse, returning to seeds, while time flowed backward and I grew younger with each breath."
  ];
  
  const [currentExampleIndex, setCurrentExampleIndex] = useState(
    Math.floor(Math.random() * dreamExamples.length)
  );

  const moodOptions = [
    { value: 'peaceful', label: 'Peaceful', emoji: '🌙', color: 'from-blue-400 via-indigo-500 to-purple-600', bg: 'from-blue-900/20 to-indigo-900/20' },
    { value: 'adventurous', label: 'Adventurous', emoji: '⚡', color: 'from-yellow-400 via-orange-500 to-red-500', bg: 'from-yellow-900/20 to-orange-900/20' },
    { value: 'mysterious', label: 'Mysterious', emoji: '🔮', color: 'from-purple-400 via-pink-500 to-indigo-600', bg: 'from-purple-900/20 to-pink-900/20' },
    { value: 'scary', label: 'Scary', emoji: '👻', color: 'from-red-400 via-red-600 to-gray-800', bg: 'from-red-900/20 to-gray-900/20' },
    { value: 'happy', label: 'Happy', emoji: '☀️', color: 'from-green-400 via-blue-500 to-teal-500', bg: 'from-green-900/20 to-blue-900/20' },
    { value: 'sad', label: 'Sad', emoji: '☁️', color: 'from-gray-400 via-blue-400 to-indigo-500', bg: 'from-gray-900/20 to-blue-900/20' },
    { value: 'confused', label: 'Confused', emoji: '🌀', color: 'from-indigo-400 via-purple-500 to-pink-500', bg: 'from-indigo-900/20 to-purple-900/20' },
    { value: 'excited', label: 'Excited', emoji: '🎆', color: 'from-pink-400 via-red-500 to-orange-500', bg: 'from-pink-900/20 to-red-900/20' }
  ];

  const dreamQuotes = [
    "Dreams are the royal road to the unconscious. — Sigmund Freud",
    "All that we see or seem is but a dream within a dream. — Edgar Allan Poe",
    "Dreams are illustrations from the book your soul is writing about you. — Marsha Norman",
    "The future belongs to those who believe in the beauty of their dreams. — Eleanor Roosevelt",
    "Dreams are the seeds of change. Nothing ever grows without a seed. — Debby Boone"
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowQuote(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleMoodToggle = (mood: string) => {
    setSelectedMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };

  const getBackgroundGradient = () => {
    if (selectedMoods.length === 0) {
      return 'from-[#0D041B] via-[#1E0B36] to-[#2A0845]';
    }
    
    const primaryMood = selectedMoods[0];
    const moodOption = moodOptions.find(m => m.value === primaryMood);
    return moodOption?.bg || 'from-[#0D041B] via-[#1E0B36] to-[#2A0845]';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dreamDescription.trim()) return;
    
    setCurrentStep('analyzing');
    
    try {
      // First interpret the dream
      const interpretation = await interpretDreamAsync({
        description: dreamDescription,
        date: dreamDate || undefined,
        mood: selectedMoods.length > 0 ? selectedMoods : undefined
      });
      
      if (interpretation) {
        // If interpretation is successful, generate visualization
        const visualization = await generateVisualizationAsync(
          dreamDescription,
          'fantasy digital art, dreamlike, surreal, vibrant colors, highly detailed, cinematic lighting'
        );
        
        if (visualization) {
          setGeneratedImage(visualization.imageUrl);
        }
      }
      
      setCurrentStep('results');
    } catch (error) {
      console.error('Error analyzing dream:', error);
      setCurrentStep('input');
    }
  };

  const saveToJournal = async () => {
    if (!dreamDescription || !interpretation) return;
    
    setIsSaving(true);
    try {
      await addDreamEntryAsync({
        title: `Dream Analysis - ${new Date(dreamDate || Date.now()).toLocaleDateString()}`,
        date: dreamDate || new Date().toISOString(),
        description: dreamDescription,
        tags: selectedMoods,
        mood: selectedMoods.length > 0 ? selectedMoods[0] : 'peaceful',
        favorite: false,
        interpretation: interpretation.summary,
        visualization: visualization?.description || '',
        visualizationUrl: generatedImage || ''
      });
      
      // Reset form
      setDreamDescription('');
      setDreamDate('');
      setSelectedMoods([]);
      setGeneratedImage(null);
      setCurrentStep('input');
      setCurrentExampleIndex(Math.floor(Math.random() * dreamExamples.length));
      
      alert('Dream saved to your journal successfully!');
    } catch (error) {
      console.error('Error saving dream:', error);
      alert('Failed to save dream. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const resetAnalysis = () => {
    setCurrentStep('input');
    setActiveTab('interpretation');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} pt-20 pb-12 transition-all duration-1000`}>
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20" />
        
        {/* Mood-based particles */}
        {selectedMoods.map((mood, index) => {
          const moodOption = moodOptions.find(m => m.value === mood);
          return (
            <motion.div
              key={mood}
              className="absolute rounded-full mix-blend-screen"
              style={{
                width: '200px',
                height: '200px',
                background: `radial-gradient(circle, ${moodOption?.color.split(' ')[1] || 'rgba(168, 85, 247, 0.1)'}, transparent 70%)`,
                left: `${20 + index * 25}%`,
                top: `${20 + index * 15}%`,
              }}
              animate={{
                x: [0, 50, -30, 0],
                y: [0, -30, 40, 0],
                opacity: [0.3, 0.6, 0.4, 0.3],
                scale: [1, 1.2, 0.8, 1],
              }}
              transition={{
                duration: 8 + index * 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          );
        })}

        {/* Floating quote */}
        <AnimatePresence>
          {showQuote && currentStep === 'input' && (
            <motion.div
              className="absolute top-32 right-8 max-w-sm p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
              initial={{ opacity: 0, x: 100, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <p className="text-sm text-gray-300 italic">
                {dreamQuotes[Math.floor(Math.random() * dreamQuotes.length)]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              className="mr-4 p-4 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <FiEye className="h-10 w-10 text-indigo-300" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              Dream Analysis
            </h1>
          </div>
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Unveil the hidden meanings within your subconscious mind
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {currentStep === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              {/* Dream Input Form */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <motion.h2 
                  className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  What did you dream last night?
                </motion.h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Dream Description */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-lg font-medium text-gray-200 mb-4">
                      Describe Your Dream
                    </label>
                    <div className="relative">
                      <textarea
                        rows={8}
                        className="w-full p-6 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all resize-none text-lg leading-relaxed"
                        placeholder={`Share every detail you remember...\n\nExample: ${dreamExamples[currentExampleIndex]}`}
                        value={dreamDescription}
                        onChange={(e) => setDreamDescription(e.target.value)}
                        onFocus={() => setCurrentExampleIndex(Math.floor(Math.random() * dreamExamples.length))}
                        required
                      />
                      <div className="absolute bottom-4 right-4 text-sm text-gray-500">
                        {dreamDescription.length} characters
                      </div>
                    </div>
                  </motion.div>

                  {/* Mood Selection */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-lg font-medium text-gray-200 mb-4">
                      How did your dream feel?
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {moodOptions.map((mood) => (
                        <motion.button
                          key={mood.value}
                          type="button"
                          onClick={() => handleMoodToggle(mood.value)}
                          className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                            selectedMoods.includes(mood.value)
                              ? `border-white/30 bg-gradient-to-r ${mood.color} bg-opacity-20 shadow-lg`
                              : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-2">{mood.emoji}</div>
                            <div className="text-sm font-medium text-white">{mood.label}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Date Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div>
                      <label className="block text-lg font-medium text-gray-200 mb-4">
                        When did you dream this?
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full p-4 bg-white/5 border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                        value={dreamDate}
                        onChange={(e) => setDreamDate(e.target.value)}
                      />
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    className="text-center pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.button
                      type="submit"
                      className="px-12 py-4 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white text-lg font-semibold rounded-2xl hover:shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 relative overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={interpretationLoading || visualizationLoading}
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        <FiZap className="h-6 w-6" />
                        {interpretationLoading || visualizationLoading 
                          ? 'Analyzing Your Dream...' 
                          : 'Analyze My Dream'}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </motion.button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          )}

          {currentStep === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
                <motion.div
                  className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <FiEye className="h-12 w-12 text-white" />
                </motion.div>
                
                <h2 className="text-3xl font-bold text-white mb-4">
                  Analyzing Your Dream
                </h2>
                <p className="text-gray-300 text-lg mb-8">
                  Our AI is diving deep into your subconscious, interpreting symbols and creating a visual representation...
                </p>
                
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-center justify-center gap-3 text-indigo-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                    <span>Interpreting dream symbols...</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center justify-center gap-3 text-purple-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <span>Generating visual representation...</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center justify-center gap-3 text-pink-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                    <span>Preparing insights...</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Tab Navigation */}
              <div className="flex justify-center">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex">
                  <button
                    onClick={() => setActiveTab('interpretation')}
                    className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === 'interpretation'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Dream Interpretation
                  </button>
                  <button
                    onClick={() => setActiveTab('visualization')}
                    className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === 'visualization'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Visual Impression
                  </button>
                </div>
              </div>

              {/* Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'interpretation' ? (
                  <motion.div
                    key="interpretation"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                  >
                    {interpretationError && (
                      <div className="mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl">
                        <p className="text-red-400 text-center">{interpretationError}</p>
                      </div>
                    )}
                    
                    {interpretation ? (
                      <div className="space-y-8">
                        {/* Main Interpretation */}
                        <motion.div 
                          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                            Your Dream's Story
                          </h3>
                          <div className="prose prose-lg prose-invert max-w-none">
                            <p className="text-gray-200 leading-relaxed text-lg text-center">
                              {interpretation.summary}
                            </p>
                          </div>
                        </motion.div>
                        
                        {/* Symbols */}
                        <motion.div 
                          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-pink-300 to-indigo-300 bg-clip-text text-transparent">
                            Hidden Symbols
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {interpretation.symbols.map((symbol, index) => (
                              <motion.div 
                                key={index}
                                className="p-6 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                              >
                                <h4 className="font-bold text-xl text-indigo-300 mb-3">{symbol.symbol}</h4>
                                <p className="text-gray-300">{symbol.meaning}</p>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                        
                        {/* Insights Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <motion.div 
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <h3 className="text-xl font-bold text-center mb-4 text-blue-300">
                              Emotional Insights
                            </h3>
                            <p className="text-gray-300 leading-relaxed">{interpretation.emotionalInsights}</p>
                          </motion.div>
                          
                          <motion.div 
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                          >
                            <h3 className="text-xl font-bold text-center mb-4 text-green-300">
                              Guidance
                            </h3>
                            <p className="text-gray-300 leading-relaxed">{interpretation.actionableAdvice}</p>
                          </motion.div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔮</div>
                        <h3 className="text-2xl font-medium text-white mb-2">No Interpretation Available</h3>
                        <p className="text-gray-400">
                          Something went wrong during analysis. Please try again.
                        </p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="visualization"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                  >
                    {visualizationLoading ? (
                      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
                        <motion.div
                          className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <FiEye className="h-8 w-8 text-white" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white mb-4">Creating Your Vision</h3>
                        <p className="text-gray-300">Transforming your dream into visual art...</p>
                      </div>
                    ) : visualizationError ? (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-8 text-center">
                        <p className="text-red-400 mb-4">Error: {visualizationError}</p>
                        <button 
                          onClick={() => generateVisualizationAsync(dreamDescription)}
                          className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-white rounded-xl transition-colors"
                        >
                          Try Again
                        </button>
                      </div>
                    ) : generatedImage ? (
                      <motion.div 
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <div className="p-8 text-center">
                          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                            Visual Impression of Your Dream
                          </h3>
                          
                          <div className="relative group">
                            <img 
                              src={generatedImage} 
                              alt="Generated dream visualization" 
                              className="w-full max-w-2xl mx-auto rounded-2xl shadow-2xl border-2 border-white/10"
                              onError={(e) => {
                                console.error('Failed to load image:', generatedImage);
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://source.unsplash.com/800x600/?dream,abstract';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                          </div>
                          
                          <div className="mt-8 flex flex-wrap gap-4 justify-center">
                            <motion.button
                              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => downloadVisualization(generatedImage, `dream-${new Date().toISOString().slice(0, 10)}`)}
                            >
                              <FiDownload className="w-5 h-5" />
                              Download
                            </motion.button>
                            
                            <motion.button
                              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={saveToJournal}
                              disabled={isSaving}
                            >
                              <FiSave className="w-5 h-5" />
                              {isSaving ? 'Saving...' : 'Save to Journal'}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
                        <div className="text-6xl mb-6">🎨</div>
                        <h3 className="text-2xl font-medium text-white mb-4">No Visualization Yet</h3>
                        <p className="text-gray-400 mb-6">
                          Generate a dream visualization by analyzing a dream first.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <motion.div 
                className="flex justify-center gap-4 pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  onClick={resetAnalysis}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiRefreshCw className="w-5 h-5" />
                  Analyze Another Dream
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DreamAnalysisPage;