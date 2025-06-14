import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDreamContext } from '../contexts/DreamContext';
import { FiDownload, FiClock } from 'react-icons/fi';
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

  const dreamExamples = [
    "I was flying over a city made of crystal, and I could see my reflection in every building. The sky was purple and filled with floating islands.",
    "I was underwater in an ancient temple, breathing normally. Fish with human faces were guiding me to a glowing artifact.",
    "I was in a forest where the trees had eyes and whispered secrets. The ground beneath me shifted like waves on an ocean.",
  ];
  
  const [currentExampleIndex, setCurrentExampleIndex] = useState(
    Math.floor(Math.random() * dreamExamples.length)
  );

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
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-gray-900 pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-vivid-blue to-teal-400 mb-4">
            Dream Analysis
          </h1>
          <p className="text-light-gray text-lg max-w-3xl mx-auto">
            Describe your dream and let our AI analyze and visualize it for you
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Dream Input */}
          <div className="lg:col-span-1">
            <div className="glassmorphism rounded-2xl p-6 border border-white/10 h-full">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="dreamDescription" className="block text-white font-medium mb-2">
                    Dream Description
                  </label>
                  <textarea
                    id="dreamDescription"
                    rows={8}
                    className="w-full bg-dark-bg/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-vivid-blue focus:border-transparent transition-all"
                    placeholder={`Describe your dream in detail...\n\nExample: ${dreamExamples[currentExampleIndex]}`}
                    value={dreamDescription}
                    onChange={(e) => setDreamDescription(e.target.value)}
                    onFocus={() => setCurrentExampleIndex(Math.floor(Math.random() * dreamExamples.length))}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="dreamDate" className="block text-white font-medium mb-2">
                      Date/Time (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      id="dreamDate"
                      className="w-full bg-dark-bg/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-vivid-blue focus:border-transparent transition-all"
                      value={dreamDate}
                      onChange={(e) => setDreamDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="mood" className="block text-white font-medium mb-2">
                      Mood/Emotion Tags
                    </label>
                    <select
                      id="mood"
                      multiple
                      className="w-full bg-dark-bg/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-vivid-blue focus:border-transparent transition-all"
                      value={selectedMoods}
                      onChange={handleMoodChange}
                    >
                      <option value="happy">Happy</option>
                      <option value="sad">Sad</option>
                      <option value="anxious">Anxious</option>
                      <option value="peaceful">Peaceful</option>
                      <option value="confused">Confused</option>
                      <option value="scared">Scared</option>
                      <option value="excited">Excited</option>
                    </select>
                    <p className="text-xs text-light-gray mt-1">Hold Ctrl/Cmd to select multiple</p>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="w-full py-3 px-6 bg-gradient-to-r from-vivid-blue to-deep-purple text-white font-medium rounded-lg hover:shadow-lg hover:shadow-deep-purple/20 transition-all duration-300 mt-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={interpretationLoading || visualizationLoading}
                >
                  {interpretationLoading || visualizationLoading 
                    ? 'Analyzing...' 
                    : 'Analyze My Dream'}
                </motion.button>
              </form>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            <div className="glassmorphism rounded-2xl p-6 border border-white/10 h-full">
              <div className="flex border-b border-gray-700 mb-6">
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === 'interpretation' 
                      ? 'text-vivid-blue border-b-2 border-vivid-blue' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('interpretation')}
                >
                  Interpretation
                </button>
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === 'visualization' 
                      ? 'text-vivid-blue border-b-2 border-vivid-blue' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('visualization')}
                >
                  Visualization
                </button>
              </div>

              {activeTab === 'interpretation' ? (
                <div className="space-y-6">
                  {interpretationError && (
                    <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg mb-6">
                      <p className="text-red-400">{interpretationError}</p>
                    </div>
                  )}
                  
                  {interpretation ? (
                    <motion.div 
                      className="space-y-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="p-6 bg-dark-bg/50 rounded-xl border border-gray-700">
                        <h3 className="text-xl font-semibold text-white mb-3">Dream Summary</h3>
                        <p className="text-light-gray">{interpretation.summary}</p>
                      </div>
                      
                      <div className="p-6 bg-dark-bg/50 rounded-xl border border-gray-700">
                        <h3 className="text-xl font-semibold text-white mb-3">Key Symbols</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {interpretation.symbols.map((symbol, index) => (
                            <div key={index} className="p-3 bg-dark-bg/70 rounded-lg border border-gray-800">
                              <h4 className="font-medium text-accent-pink">{symbol.symbol}</h4>
                              <p className="text-light-gray text-sm">{symbol.meaning}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-6 bg-dark-bg/50 rounded-xl border border-gray-700">
                        <h3 className="text-xl font-semibold text-white mb-3">AI Interpretation</h3>
                        <div className="text-light-gray whitespace-pre-line">{interpretation.psychologicalAnalysis}</div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-dark-bg/50 rounded-xl border border-gray-700">
                          <h3 className="text-xl font-semibold text-white mb-3">Emotional Insights</h3>
                          <p className="text-light-gray">{interpretation.emotionalInsights}</p>
                        </div>
                        
                        <div className="p-6 bg-dark-bg/50 rounded-xl border border-gray-700">
                          <h3 className="text-xl font-semibold text-white mb-3">Actionable Advice</h3>
                          <p className="text-light-gray">{interpretation.actionableAdvice}</p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-5xl mb-4">🔮</div>
                      <h3 className="text-xl font-medium text-white mb-2">No Dream Analyzed Yet</h3>
                      <p className="text-gray-400">
                        Describe your dream and click "Analyze My Dream" to see the interpretation.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full">
                  {/* Current Visualization */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Current Visualization</h3>
                    {visualizationLoading ? (
                      <div className="flex flex-col items-center justify-center py-12 bg-dark-bg/30 rounded-xl border border-gray-700">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vivid-blue mb-4"></div>
                        <p className="text-light-gray">Generating your dream visualization...</p>
                        <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
                      </div>
                    ) : visualizationError ? (
                      <div className="p-6 bg-red-900/20 border border-red-800 rounded-xl">
                        <p className="text-red-400">Error: {visualizationError}</p>
                        <button 
                          onClick={() => generateVisualizationAsync(dreamDescription)}
                          className="mt-3 px-4 py-2 bg-red-900/50 hover:bg-red-800/50 text-white rounded-lg transition-colors"
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
                          className="w-full h-auto rounded-xl shadow-2xl border-2 border-white/10"
                          onError={(e) => {
                            console.error('Failed to load image:', generatedImage);
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://source.unsplash.com/random/800x600/?dream,abstract';
                          }}
                        />
                        <div className="mt-6 flex flex-wrap gap-3 justify-center">
                          <motion.button
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-vivid-blue to-deep-purple text-white font-medium rounded-lg hover:shadow-lg hover:shadow-deep-purple/20 transition-all"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => downloadVisualization(generatedImage, `dream-${new Date().toISOString().slice(0, 10)}`)}
                          >
                            <FiDownload className="w-5 h-5" aria-hidden="true" />
                            Download
                          </motion.button>
                          <motion.button
                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={saveToJournal}
                            disabled={isSaving}
                          >
                            {isSaving ? 'Saving...' : 'Save to Journal'}
                          </motion.button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-center py-12 bg-dark-bg/30 rounded-xl border border-gray-700">
                        <div className="text-5xl mb-4">🎨</div>
                        <h3 className="text-xl font-medium text-white mb-2">No Visualization Yet</h3>
                        <p className="text-gray-400 mb-4">
                          Generate a dream visualization by analyzing a dream first.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Visualization History */}
                  {visualizationHistory.length > 0 && (
                    <div className="mt-12">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <FiClock className="w-5 h-5 text-vivid-blue" aria-hidden="true" />
                        Recent Visualizations
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {visualizationHistory.map((item: DreamVisualization) => (
                          <motion.div 
                            key={item.id}
                            className="group relative overflow-hidden rounded-lg border border-gray-700 hover:border-vivid-blue/50 transition-colors"
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
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                              <p className="text-xs text-white truncate px-1">{item.title}</p>
                              <div className="flex gap-2 mt-2">
                                <button 
                                  onClick={() => setGeneratedImage(item.imageUrl)}
                                  className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded flex-1"
                                >
                                  View
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    downloadVisualization(item.imageUrl, `dream-${item.id}`);
                                  }}
                                  className="text-xs bg-vivid-blue/80 hover:bg-vivid-blue text-white p-1 rounded"
                                  title="Download"
                                >
                                  <FiDownload className="w-3.5 h-3.5 inline" aria-hidden="true" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <p className="text-gray-400 mb-6">
                        Analyze a dream to generate a visualization.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamAnalysisPage;
