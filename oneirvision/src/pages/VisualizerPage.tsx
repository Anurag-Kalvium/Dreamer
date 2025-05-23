import React, { useState, useEffect } from 'react';
import { useDreamContext, DreamVisualization } from '../contexts/DreamContext';

const VisualizerPage: React.FC = () => {
  const { dreamJournal, visualization, visualizationLoading, visualizationError, generateVisualizationAsync, updateDreamEntryAsync } = useDreamContext();
  
  // Store generated visualizations
  const [visualizations, setVisualizations] = useState<DreamVisualization[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Selected dream and style for generating new visualizations
  const [selectedDreamId, setSelectedDreamId] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('Surreal');

  // Check for URL parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dreamId = params.get('dreamId');
    const style = params.get('style');
    
    if (dreamId && style) {
      // Auto-select the dream and style from URL parameters
      setSelectedDreamId(dreamId);
      setSelectedStyle(style);
      
      // Auto-generate visualization if parameters are provided
      generateVisualizationAsync(dreamId, style);
    }
  }, [generateVisualizationAsync]);

  // Update visualizations when a new one is generated
  useEffect(() => {
    if (visualization) {
      // Add the new visualization to the beginning of the array
      setVisualizations(prev => [visualization, ...prev]);
      setCurrentIndex(0); // Show the new visualization
    }
  }, [visualization]);

  const nextVisualization = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % visualizations.length);
  };

  const prevVisualization = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? visualizations.length - 1 : prevIndex - 1
    );
  };
  
  // Handle generating a new visualization
  const handleGenerateVisualization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDreamId) return;
    
    await generateVisualizationAsync(selectedDreamId, selectedStyle);
  };

  return (
    <div className="pt-20 min-h-screen bg-dark-bg">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Dream Visualizer</h1>
          <p className="text-light-gray text-lg max-w-3xl mx-auto">
            Transform your interpreted dreams into stunning visual representations.
          </p>
        </div>

        {/* Visualization Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="glassmorphism rounded-2xl p-6 border border-white/10 overflow-hidden">
            {visualizationLoading ? (
              <div className="relative aspect-video rounded-xl overflow-hidden flex items-center justify-center bg-dark-bg/80">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border-t-4 border-vivid-blue border-solid rounded-full animate-spin mb-4"></div>
                  <p className="text-light-gray">Generating your visualization...</p>
                </div>
              </div>
            ) : visualizations.length > 0 ? (
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <img 
                  src={visualizations[currentIndex].imageUrl} 
                  alt={visualizations[currentIndex].title}
                  className="w-full h-full object-cover"
                />
              
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-xl font-bold text-white mb-2">{visualizations[currentIndex].title}</h3>
                  <p className="text-light-gray mb-4">{visualizations[currentIndex].description}</p>
                  
                  {/* Navigation buttons */}
                  {visualizations.length > 1 && (
                    <div className="flex space-x-3">
                      <button 
                        onClick={prevVisualization}
                        className="p-2 bg-dark-bg/50 rounded-full hover:bg-dark-bg/80 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button 
                        onClick={nextVisualization}
                        className="p-2 bg-dark-bg/50 rounded-full hover:bg-dark-bg/80 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="aspect-video rounded-xl overflow-hidden flex items-center justify-center bg-dark-bg/50">
                <div className="text-center p-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-xl font-bold text-white mb-2">No Visualizations Yet</h3>
                  <p className="text-light-gray mb-6">Generate your first dream visualization using the form below.</p>
                </div>
              </div>
            )}
            
            {/* Save to Journal button */}
            {visualizations.length > 0 && !visualizationLoading && (
              <div className="mt-4 flex justify-end">
                <button
                  className="flex items-center px-4 py-2 bg-dark-bg/50 text-white rounded-lg hover:bg-dark-bg/80 transition-colors"
                  onClick={() => {
                    const selectedDream = dreamJournal.find(dream => dream.id.toString() === selectedDreamId);
                    if (selectedDream) {
                      const updatedDream = {
                        ...selectedDream,
                        visualizationUrl: visualizations[currentIndex].imageUrl
                      };
                      updateDreamEntryAsync(updatedDream)
                        .then(() => {
                          alert('Visualization saved to your dream journal!');
                        })
                        .catch(err => {
                          console.error('Error saving visualization:', err);
                          alert('Failed to save visualization. Please try again.');
                        });
                    } else {
                      alert('Please select a dream from your journal first.');
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Save to Journal
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Generate New Visualization Section */}
        <div className="mt-20 max-w-3xl mx-auto glassmorphism rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Generate New Visualization</h2>
          
          <form onSubmit={handleGenerateVisualization} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Select a Dream to Visualize</label>
              <select 
                className="w-full bg-dark-bg/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-vivid-blue focus:border-transparent transition-all"
                value={selectedDreamId}
                onChange={(e) => setSelectedDreamId(e.target.value)}
                required
              >
                <option value="">-- Select from your dream journal --</option>
                {dreamJournal.map(dream => (
                  <option key={dream.id} value={dream.id}>
                    {dream.title} ({new Date(dream.date).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Visualization Style</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Surreal', 'Realistic', 'Abstract', 'Anime'].map((style) => (
                  <div key={style} className="relative">
                    <input 
                      type="radio" 
                      id={style} 
                      name="style" 
                      value={style}
                      checked={selectedStyle === style}
                      onChange={() => setSelectedStyle(style)}
                      className="peer absolute opacity-0" 
                    />
                    <label 
                      htmlFor={style}
                      className="block p-3 text-center border border-gray-700 rounded-lg cursor-pointer text-light-gray peer-checked:border-accent-pink peer-checked:text-white peer-checked:bg-dark-bg/50 hover:bg-dark-bg/30 transition-all"
                    >
                      {style}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-vivid-blue to-deep-purple text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
              disabled={visualizationLoading || !selectedDreamId}
            >
              {visualizationLoading ? 'Generating...' : 'Generate Visualization'}
            </button>
            
            {visualizationError && (
              <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg mt-4">
                <p className="text-red-400">{visualizationError}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default VisualizerPage;
