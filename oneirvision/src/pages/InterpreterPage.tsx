import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDreamContext } from '../contexts/DreamContext';

const InterpreterPage: React.FC = () => {
  const { interpretation, interpretationLoading, interpretationError, interpretDreamAsync, addDreamEntryAsync } = useDreamContext();
  
  const [dreamDescription, setDreamDescription] = useState('');
  // Add more dream examples for the placeholder
  const dreamExamples = [
    "I was flying over a city made of crystal, and I could see my reflection in every building. The sky was purple and filled with floating islands.",
    "I was underwater in an ancient temple, breathing normally. Fish with human faces were guiding me to a glowing artifact.",
    "I was in a forest where the trees had eyes and whispered secrets. The ground beneath me shifted like waves on an ocean.",
    "I was running from shadows that kept changing shape. Every time I looked back, they resembled someone I knew.",
    "I was in a house with infinite rooms. Each door I opened led to a memory from my childhood, but slightly altered."
  ];
  const [currentExampleIndex, setCurrentExampleIndex] = useState(Math.floor(Math.random() * dreamExamples.length));
  const [dreamDate, setDreamDate] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  
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
    
    await interpretDreamAsync({
      description: dreamDescription,
      date: dreamDate || undefined,
      mood: selectedMoods.length > 0 ? selectedMoods : undefined
    });
  };
  return (
    <div className="pt-20 min-h-screen bg-dark-bg">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Dream Interpreter</h1>
          <p className="text-light-gray text-lg max-w-3xl mx-auto">
            Decode your dreams into meaningful insights with our AI-powered dream analysis tool.
          </p>
        </motion.div>

        <motion.div
          className="glassmorphism rounded-2xl p-8 border border-white/10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="dreamDescription" className="block text-white font-medium mb-2">
                Dream Description
              </label>
              <textarea
                id="dreamDescription"
                rows={6}
                className="w-full bg-dark-bg/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-vivid-blue focus:border-transparent transition-all"
                placeholder={`Describe your dream in as much detail as possible...
Example: ${dreamExamples[currentExampleIndex]}`}
                value={dreamDescription}
                onChange={(e) => setDreamDescription(e.target.value)}
                onFocus={() => setCurrentExampleIndex(Math.floor(Math.random() * dreamExamples.length))}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              className="w-full py-3 px-6 bg-gradient-to-r from-vivid-blue to-deep-purple text-white font-medium rounded-lg hover:shadow-lg hover:shadow-deep-purple/20 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={interpretationLoading}
            >
              {interpretationLoading ? 'Interpreting...' : 'Interpret My Dream'}
            </motion.button>
          </form>

          {/* Interpretation results */}
          <div className="mt-10">
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
                <div className="p-6 bg-gradient-to-br from-dark-bg/70 to-dark-bg/40 rounded-xl border border-gray-700 backdrop-blur-sm">
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-vivid-blue to-accent-pink mb-4">
                    Dream Interpretation
                  </h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {interpretation.summary}
                    </p>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-dark-bg/70 to-dark-bg/40 rounded-xl border border-gray-700 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-accent-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Dream Symbols & Meanings
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    These symbols were identified in your dream. Hover over each symbol to learn its meaning.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {interpretation.symbols && interpretation.symbols.length > 0 ? (
                      interpretation.symbols.map((symbol, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group relative inline-block"
                        >
                          <div className="px-3 py-1.5 rounded-full border border-gray-700 bg-dark-bg/60 hover:bg-gradient-to-r hover:from-accent-pink/20 hover:to-vivid-blue/20 hover:border-accent-pink/30 transition-all cursor-help flex items-center">
                            <span className="text-sm font-medium text-accent-pink">{symbol.symbol}</span>
                            <svg className="w-4 h-4 ml-1 text-gray-400 group-hover:text-accent-pink transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="absolute z-20 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 px-3 py-2 bg-gray-900 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            <div className="text-sm font-medium text-white">{symbol.symbol}</div>
                            <div className="text-xs text-gray-300 mt-1">{symbol.meaning}</div>
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-gray-400 text-sm">No key symbols identified in this dream</div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-center mt-6">
                  <motion.button
                    className="px-6 py-3 bg-gradient-to-r from-deep-purple to-accent-pink text-white font-medium rounded-full hover:shadow-lg flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (dreamDescription && interpretation) {
                        // Save to journal
                        // Save the interpreted dream to journal
                        addDreamEntryAsync({
                          title: `Dream on ${new Date().toLocaleDateString()}`,
                          date: dreamDate || new Date().toISOString(),
                          description: dreamDescription,
                          tags: selectedMoods,
                          mood: selectedMoods.length > 0 ? selectedMoods[0] : 'neutral',
                          favorite: false,
                          interpretation: interpretation.summary,
                          visualization: '',
                          visualizationUrl: ''
                        }).then(() => {
                          // Show success notification
                          alert('Dream saved to your journal successfully!');
                          // Navigate to journal page
                          window.location.href = '/journal';
                        }).catch(err => {
                          console.error('Error saving to journal:', err);
                          alert('Failed to save dream to journal. Please try again.');
                        });
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save to Journal
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <div className="p-6 border border-dashed border-gray-700 rounded-xl text-center">
                <p className="text-light-gray">
                  Your dream interpretation will appear here after submission.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <motion.div 
              className="glassmorphism p-6 rounded-xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-vivid-blue to-deep-purple rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold text-white mb-2">Describe Your Dream</h3>
              <p className="text-light-gray">Enter the details of your dream, including emotions, people, places, and events.</p>
            </motion.div>

            <motion.div 
              className="glassmorphism p-6 rounded-xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-deep-purple to-accent-pink rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Analysis</h3>
              <p className="text-light-gray">Our AI processes your dream using psychological frameworks and pattern recognition.</p>
            </motion.div>

            <motion.div 
              className="glassmorphism p-6 rounded-xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-accent-pink to-vivid-blue rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold text-white mb-2">Get Insights</h3>
              <p className="text-light-gray">Receive detailed interpretation, psychological insights, and meaning categories.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterpreterPage;
