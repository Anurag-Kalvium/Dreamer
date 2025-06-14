import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDreamContext } from '../contexts/DreamContext';
import { Sparkles, Brain, Eye, Palette, Zap, Heart, BookOpen, Save, Clock, Download, Star } from 'lucide-react';
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
  const audioRef = useRef<HTMLAudioElement>(null);

  const dreamExamples = [
    "I was flying over a city made of crystal, and I could see my reflection in every building. The sky was purple and filled with floating islands.",
    "I was underwater in an ancient temple, breathing normally. Fish with human faces were guiding me to a glowing artifact.",
    "I was in a forest where the trees had eyes and whispered secrets. The ground beneath me shifted like waves on an ocean.",
  ];
  
  const [currentExampleIndex, setCurrentExampleIndex] = useState(
    Math.floor(Math.random() * dreamExamples.length)
  );

  const moodOptions = [
    { value: 'peaceful', label: 'Peaceful' },
    { value: 'adventurous', label: 'Adventurous' },
    { value: 'mysterious', label: 'Mysterious' },
    { value: 'scary', label: 'Scary' },
    { value: 'happy', label: 'Happy' },
    { value: 'sad', label: 'Sad' },
    { value: 'confused', label: 'Confused' },
    { value: 'excited', label: 'Excited' }
  ];

  // Auto-play ambient sound on component mount
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.3; // Set volume to 30%
      audio.loop = true;
      
      // Try to play the audio
      const playAudio = async () => {
        try {
          await audio.play();
        } catch (error) {
          console.log('Auto-play prevented by browser policy');
        }
      };
      
      playAudio();
    }

    // Cleanup function to pause audio when component unmounts
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  const handleMoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selectedValues: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setSelectedMoods(selectedValues);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dreamDescription.trim()) return;
    
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
          dreamDescription, // Use the actual dream description
          'fantasy digital art, dreamlike, surreal, vibrant colors, highly detailed'
        );
        
        if (visualization) {
          setGeneratedImage(visualization.imageUrl);
        }
      }
    } catch (error) {
      console.error('Error analyzing dream:', error);
    }
  };

  const saveToJournal = async () => {
    if (!dreamDescription || !interpretation) return;
    
    setIsSaving(true);
    try {
      await addDreamEntryAsync({
        title: `Dream on ${new Date(dreamDate || Date.now()).toLocaleDateString()}`,
        date: dreamDate || new Date().toISOString(),
        description: dreamDescription,
        tags: selectedMoods,
        mood: selectedMoods.length > 0 ? selectedMoods[0] : 'neutral',
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
      setCurrentExampleIndex(Math.floor(Math.random() * dreamExamples.length));
      
      alert('Dream saved to your journal successfully!');
    } catch (error) {
      console.error('Error saving dream:', error);
      alert('Failed to save dream. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0D041B]">
      {/* Hidden audio element for ambient sound */}
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/space-ambient.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Animated Background - matching homepage */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-indigo-900/10 to-[#0D041B]" />
        
        {/* Animated elements - matching homepage */}
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
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header - matching homepage style */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
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
                AI-Powered Dream Analysis
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
              Dream Lab
            </motion.h1>
            
            {/* Subheading */}
            <motion.h2 
              className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-8 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Decode Your Dreams with Advanced AI
            </motion.h2>
            
            {/* Description */}
            <motion.p 
              className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Transform your dreams into meaningful insights and stunning visualizations with our cutting-edge AI technology
            </motion.p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Dream Input */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="bg-gray-900/40 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl hover:bg-gray-900/60 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center mr-4">
                    <Brain className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">Describe Your Dream</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="dreamDescription" className="block text-white font-medium mb-3">
                      Dream Description
                    </label>
                    <textarea
                      id="dreamDescription"
                      rows={8}
                      className="w-full bg-gray-800/50 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all resize-none"
                      placeholder={`Describe your dream in vivid detail...\n\nExample: ${dreamExamples[currentExampleIndex]}`}
                      value={dreamDescription}
                      onChange={(e) => setDreamDescription(e.target.value)}
                      onFocus={() => setCurrentExampleIndex(Math.floor(Math.random() * dreamExamples.length))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="dreamDate" className="block text-white font-medium mb-3">
                        Date/Time (Optional)
                      </label>
                      <input
                        type="datetime-local"
                        id="dreamDate"
                        className="w-full bg-gray-800/50 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                        value={dreamDate}
                        onChange={(e) => setDreamDate(e.target.value)}
                      />
                    </div>

                    <div>
                      <label htmlFor="mood" className="block text-white font-medium mb-3">
                        Mood/Emotion Tags
                      </label>
                      <select
                        id="mood"
                        multiple
                        className="w-full bg-gray-800/50 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                        value={selectedMoods}
                        onChange={handleMoodChange}
                      >
                        {moodOptions.map(mood => (
                          <option key={mood.value} value={mood.value}>
                            {mood.label}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-400 mt-2">Hold Ctrl/Cmd to select multiple</p>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={interpretationLoading || visualizationLoading}
                  >
                    {interpretationLoading || visualizationLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5" />
                        <span>Analyze My Dream</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Right Column - Results */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="bg-gray-900/40 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl hover:bg-gray-900/60 transition-all duration-300 h-full">
                {/* Tab Navigation */}
                <div className="flex border-b border-white/20 mb-8">
                  <button
                    className={`py-3 px-6 font-medium rounded-t-lg transition-all flex items-center space-x-2 ${
                      activeTab === 'interpretation' 
                        ? 'text-white bg-white/20 border-b-2 border-indigo-400' 
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setActiveTab('interpretation')}
                  >
                    <Brain className="h-5 w-5" />
                    <span>AI Interpretation</span>
                  </button>
                  <button
                    className={`py-3 px-6 font-medium rounded-t-lg transition-all flex items-center space-x-2 ${
                      activeTab === 'visualization' 
                        ? 'text-white bg-white/20 border-b-2 border-indigo-400' 
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setActiveTab('visualization')}
                  >
                    <Palette className="h-5 w-5" />
                    <span>Dream Visualization</span>
                  </button>
                </div>

                {activeTab === 'interpretation' ? (
                  <div className="space-y-6">
                    {interpretationError && (
                      <motion.div 
                        className="p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <p>{interpretationError}</p>
                      </motion.div>
                    )}
                    
                    {interpretation ? (
                      <motion.div 
                        className="space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {/* Dream Summary */}
                        <div className="p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30">
                          <div className="flex items-center mb-4">
                            <Eye className="h-6 w-6 text-indigo-400 mr-3" />
                            <h3 className="text-xl font-semibold text-white">Dream Summary</h3>
                          </div>
                          <p className="text-gray-200 leading-relaxed">{interpretation.summary}</p>
                        </div>
                        
                        {/* Key Symbols */}
                        <div className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                          <div className="flex items-center mb-4">
                            <Star className="h-6 w-6 text-purple-400 mr-3" />
                            <h3 className="text-xl font-semibold text-white">Key Symbols</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {interpretation.symbols.map((symbol, index) => (
                              <motion.div 
                                key={index} 
                                className="p-4 bg-gray-800/60 rounded-lg border border-white/20 hover:bg-gray-800/80 transition-all"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <h4 className="font-medium text-purple-300 mb-2">{symbol.symbol}</h4>
                                <p className="text-gray-300 text-sm">{symbol.meaning}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Insights Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-6 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl border border-green-500/30">
                            <div className="flex items-center mb-4">
                              <Heart className="h-6 w-6 text-green-400 mr-3" />
                              <h3 className="text-xl font-semibold text-white">Emotional Insights</h3>
                            </div>
                            <p className="text-gray-200">{interpretation.emotionalInsights}</p>
                          </div>
                          
                          <div className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
                            <div className="flex items-center mb-4">
                              <BookOpen className="h-6 w-6 text-yellow-400 mr-3" />
                              <h3 className="text-xl font-semibold text-white">Actionable Advice</h3>
                            </div>
                            <p className="text-gray-200">{interpretation.actionableAdvice}</p>
                          </div>
                        </div>

                        {/* Save to Journal Button */}
                        <div className="flex justify-center pt-4">
                          <motion.button
                            onClick={saveToJournal}
                            disabled={isSaving}
                            className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center space-x-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Save className="h-5 w-5" />
                            <span>{isSaving ? 'Saving...' : 'Save to Journal'}</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="mb-6 p-6 bg-gray-800/40 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                          <Brain className="h-12 w-12 text-indigo-300" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-2">Ready to Analyze</h3>
                        <p className="text-gray-400">
                          Describe your dream and click "Analyze My Dream" to unlock its hidden meanings.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full">
                    {/* Current Visualization */}
                    <div className="mb-8">
                      <div className="flex items-center mb-6">
                        <Palette className="h-6 w-6 text-purple-400 mr-3" />
                        <h3 className="text-2xl font-semibold text-white">Dream Visualization</h3>
                      </div>
                      
                      {visualizationLoading ? (
                        <div className="flex flex-col items-center justify-center py-16 bg-gray-800/40 rounded-xl border border-white/20">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400 mb-4"></div>
                          <p className="text-gray-200 mb-2">Generating your dream visualization...</p>
                          <p className="text-sm text-gray-400">This may take a moment</p>
                        </div>
                      ) : visualizationError ? (
                        <div className="p-6 bg-red-500/20 border border-red-500/40 rounded-xl">
                          <p className="text-red-400 mb-4">Error: {visualizationError}</p>
                          <button 
                            onClick={() => generateVisualizationAsync(dreamDescription)}
                            className="px-4 py-2 bg-red-500/30 hover:bg-red-500/40 text-red-300 rounded-lg transition-colors"
                          >
                            Try Again
                          </button>
                        </div>
                      ) : generatedImage ? (
                        <motion.div 
                          className="relative w-full max-w-2xl mx-auto"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <img 
                            src={generatedImage} 
                            alt="Generated dream visualization" 
                            className="w-full h-auto rounded-xl shadow-2xl border-2 border-white/20"
                            onError={(e) => {
                              console.error('Failed to load image:', generatedImage);
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://source.unsplash.com/random/800x600/?dream,abstract';
                            }}
                          />
                          <div className="mt-6 flex flex-wrap gap-3 justify-center">
                            <motion.button
                              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => downloadVisualization(generatedImage, `dream-${new Date().toISOString().slice(0, 10)}`)}
                            >
                              <Download className="w-5 h-5" />
                              Download
                            </motion.button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="text-center py-16 bg-gray-800/40 rounded-xl border border-white/20">
                          <div className="mb-6 p-6 bg-gray-800/40 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                            <Palette className="h-12 w-12 text-purple-300" />
                          </div>
                          <h3 className="text-2xl font-semibold text-white mb-2">No Visualization Yet</h3>
                          <p className="text-gray-400 mb-4">
                            Generate a dream visualization by analyzing a dream first.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Visualization History */}
                    {visualizationHistory.length > 0 && (
                      <div className="mt-12">
                        <div className="flex items-center mb-6">
                          <Clock className="h-6 w-6 text-indigo-400 mr-3" />
                          <h3 className="text-xl font-semibold text-white">Recent Visualizations</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {visualizationHistory.map((item: DreamVisualization) => (
                            <motion.div 
                              key={item.id}
                              className="group relative overflow-hidden rounded-lg border border-white/20 hover:border-indigo-400/50 transition-all"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <img 
                                src={item.imageUrl} 
                                alt={item.title}
                                className="w-full h-32 object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://source.unsplash.com/random/300x200/?dream,abstract';
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                <p className="text-xs text-white truncate mb-2">{item.title}</p>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => setGeneratedImage(item.imageUrl)}
                                    className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded flex-1"
                                  >
                                    View
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      downloadVisualization(item.imageUrl, `dream-${item.id}`);
                                    }}
                                    className="text-xs bg-indigo-500/80 hover:bg-indigo-500 text-white p-1 rounded"
                                    title="Download"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamAnalysisPage;