import React, { useState } from 'react';
import { motion } from 'framer-motion';

const VisualizerPage: React.FC = () => {
  // Sample dream visualizations (in a real app, these would come from an API)
  const [visualizations] = useState([
    {
      id: 1,
      title: 'Forest Labyrinth',
      description: 'A mysterious forest with paths that shift and change',
      imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 2,
      title: 'Ocean Depths',
      description: 'Exploring the unknown depths with strange luminescent creatures',
      imageUrl: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
    },
    {
      id: 3,
      title: 'Floating Islands',
      description: 'Islands suspended in a colorful sky with impossible architecture',
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextVisualization = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % visualizations.length);
  };

  const prevVisualization = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? visualizations.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="pt-20 min-h-screen bg-dark-bg">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Dream Visualizer</h1>
          <p className="text-light-gray text-lg max-w-3xl mx-auto">
            Transform your interpreted dreams into stunning visual representations using AI.
          </p>
        </motion.div>

        {/* Visualization Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <motion.div 
            className="glassmorphism rounded-2xl p-6 border border-white/10 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <img 
                src={visualizations[currentIndex].imageUrl} 
                alt={visualizations[currentIndex].title}
                className="w-full h-full object-cover"
              />
              
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-2xl font-bold text-white mb-2">{visualizations[currentIndex].title}</h3>
                <p className="text-light-gray">{visualizations[currentIndex].description}</p>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-6">
              <motion.button
                onClick={prevVisualization}
                className="p-3 rounded-full bg-dark-bg/50 border border-white/10 text-white hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              
              <div className="flex space-x-2">
                {visualizations.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-accent-pink' : 'bg-white/30'}`}
                    aria-label={`Go to visualization ${index + 1}`}
                  />
                ))}
              </div>
              
              <motion.button
                onClick={nextVisualization}
                className="p-3 rounded-full bg-dark-bg/50 border border-white/10 text-white hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </motion.div>

          {/* Download and Share buttons */}
          <div className="flex justify-center mt-6 space-x-4">
            <motion.button
              className="py-2 px-4 bg-dark-bg/50 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </motion.button>
            
            <motion.button
              className="py-2 px-4 bg-dark-bg/50 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </motion.button>
            
            <motion.button
              className="py-2 px-4 bg-dark-bg/50 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Save to Journal
            </motion.button>
          </div>
        </div>

        {/* Generate New Visualization Section */}
        <motion.div
          className="mt-20 max-w-3xl mx-auto glassmorphism rounded-2xl p-8 border border-white/10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Generate New Visualization</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Select a Dream to Visualize</label>
              <select className="w-full bg-dark-bg/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-vivid-blue focus:border-transparent transition-all">
                <option value="">-- Select from your dream journal --</option>
                <option value="1">Flying over mountains (May 15, 2025)</option>
                <option value="2">Underwater city exploration (May 10, 2025)</option>
                <option value="3">Meeting my future self (May 5, 2025)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Visualization Style</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Surreal', 'Realistic', 'Abstract', 'Anime'].map((style) => (
                  <div key={style} className="relative">
                    <input type="radio" id={style} name="style" className="peer absolute opacity-0" />
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
            
            <motion.button
              className="w-full py-3 px-6 bg-gradient-to-r from-vivid-blue to-deep-purple text-white font-medium rounded-lg hover:shadow-lg hover:shadow-deep-purple/20 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Generate Visualization
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VisualizerPage;
