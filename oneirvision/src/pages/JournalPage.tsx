import React, { useState } from 'react';
import { motion } from 'framer-motion';

const JournalPage: React.FC = () => {
  // Sample dream journal entries (in a real app, these would come from a database)
  const [dreams] = useState([
    {
      id: 1,
      title: 'Flying over mountains',
      date: '2025-05-15',
      description: 'I was flying over snow-capped mountains, feeling completely free and weightless.',
      tags: ['flying', 'freedom', 'nature', 'lucid'],
      interpretation: 'Represents desire for freedom and transcending current limitations.',
      mood: 'Peaceful',
    },
    {
      id: 2,
      title: 'Underwater city exploration',
      date: '2025-05-10',
      description: 'Discovered an ancient city beneath the ocean, with buildings made of crystal and strange sea creatures as inhabitants.',
      tags: ['water', 'exploration', 'discovery'],
      interpretation: 'Symbolizes exploring the depths of your unconscious mind and discovering hidden aspects of yourself.',
      mood: 'Curious',
    },
    {
      id: 3,
      title: 'Meeting my future self',
      date: '2025-05-05',
      description: 'Had a conversation with an older version of myself who gave me advice about life decisions.',
      tags: ['self-reflection', 'future', 'guidance', 'recurring'],
      interpretation: 'Represents inner wisdom and desire for guidance in current life choices.',
      mood: 'Contemplative',
    },
  ]);

  // Filter states
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Get all unique tags from dreams
  const allTags = Array.from(new Set(dreams.flatMap(dream => dream.tags)));

  // Filter dreams based on selected filters
  const filteredDreams = dreams.filter(dream => {
    // Filter by tag if a tag is selected
    if (selectedTag && !dream.tags.includes(selectedTag)) {
      return false;
    }
    
    // Filter by month if a month is selected
    if (selectedMonth) {
      const dreamMonth = dream.date.substring(0, 7); // Get YYYY-MM format
      if (dreamMonth !== selectedMonth) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="pt-20 min-h-screen bg-dark-bg">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Dream Journal</h1>
          <p className="text-light-gray text-lg max-w-3xl mx-auto">
            Track, analyze, and discover patterns in your dreams over time.
          </p>
        </motion.div>

        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-3">
            <select 
              className="bg-dark-bg/50 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-vivid-blue focus:border-transparent transition-all"
              value={selectedMonth || ''}
              onChange={(e) => setSelectedMonth(e.target.value || null)}
            >
              <option value="">All Months</option>
              <option value="2025-05">May 2025</option>
              <option value="2025-04">April 2025</option>
              <option value="2025-03">March 2025</option>
            </select>
            
            <select 
              className="bg-dark-bg/50 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-vivid-blue focus:border-transparent transition-all"
              value={selectedTag || ''}
              onChange={(e) => setSelectedTag(e.target.value || null)}
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
          
          <motion.button
            className="py-2 px-4 bg-gradient-to-r from-vivid-blue to-deep-purple text-white font-medium rounded-lg hover:shadow-lg hover:shadow-deep-purple/20 transition-all duration-300 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Dream
          </motion.button>
        </div>

        {/* Dream Journal Entries */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDreams.map((dream, index) => (
            <motion.div
              key={dream.id}
              className="glassmorphism rounded-xl p-6 border border-white/10 h-full flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">{dream.title}</h3>
                <span className="text-xs bg-dark-bg/50 text-light-gray px-2 py-1 rounded-full">{new Date(dream.date).toLocaleDateString()}</span>
              </div>
              
              <p className="text-light-gray mb-4 flex-grow">{dream.description}</p>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-white mb-2">Interpretation:</h4>
                <p className="text-sm text-light-gray">{dream.interpretation}</p>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {dream.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="text-xs bg-white/10 text-light-gray px-2 py-1 rounded-full hover:bg-white/20 cursor-pointer transition-colors"
                    onClick={() => setSelectedTag(tag)}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
                <span className="text-xs text-light-gray">Mood: {dream.mood}</span>
                
                <div className="flex space-x-2">
                  <button className="text-light-gray hover:text-white transition-colors" title="Visualize">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  
                  <button className="text-light-gray hover:text-white transition-colors" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  <button className="text-light-gray hover:text-white transition-colors" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dream Insights Section */}
        <motion.div
          className="mt-16 glassmorphism rounded-xl p-8 border border-white/10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Dream Insights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-bg/50 rounded-lg p-4 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-2">Most Common Themes</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-light-gray">Flying</span>
                  <div className="w-2/3 bg-gray-800 rounded-full h-2">
                    <div className="bg-gradient-to-r from-vivid-blue to-deep-purple h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-light-gray">Water</span>
                  <div className="w-2/3 bg-gray-800 rounded-full h-2">
                    <div className="bg-gradient-to-r from-vivid-blue to-deep-purple h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-light-gray">Future</span>
                  <div className="w-2/3 bg-gray-800 rounded-full h-2">
                    <div className="bg-gradient-to-r from-vivid-blue to-deep-purple h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-bg/50 rounded-lg p-4 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-2">Dream Mood Distribution</h3>
              <div className="flex justify-center items-center h-32">
                <div className="w-32 h-32 rounded-full border-8 border-deep-purple relative">
                  <div className="absolute inset-0 border-t-8 border-r-8 border-vivid-blue rounded-full" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}></div>
                  <div className="absolute inset-0 border-b-8 border-l-8 border-accent-pink rounded-full" style={{ clipPath: 'polygon(0 50%, 0 100%, 50% 100%)' }}></div>
                </div>
              </div>
              <div className="flex justify-center space-x-4 mt-4 text-xs">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-deep-purple rounded-full mr-1"></span>
                  <span className="text-light-gray">Peaceful</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-vivid-blue rounded-full mr-1"></span>
                  <span className="text-light-gray">Curious</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-accent-pink rounded-full mr-1"></span>
                  <span className="text-light-gray">Anxious</span>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-bg/50 rounded-lg p-4 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-2">Dream Frequency</h3>
              <div className="space-y-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="flex items-center">
                    <span className="text-xs text-light-gray w-8">{day}</span>
                    <div className="flex-1 h-6 flex items-center">
                      {Array.from({ length: Math.floor(Math.random() * 5) + 1 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="w-6 h-6 rounded-sm m-0.5" 
                          style={{ 
                            backgroundColor: `rgba(${138 + (index * 10)}, ${43 + (index * 5)}, ${226 - (index * 10)}, ${0.3 + (i * 0.15)})` 
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-light-gray mt-2 text-center">Each block represents one recorded dream</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JournalPage;
