import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDreamContext, DreamEntry, NewDreamEntry } from '../contexts/DreamContext';
import { format } from 'date-fns';

const JournalPage: React.FC = () => {
  const { dreamJournal, journalLoading, journalError, fetchDreamJournal, addDreamEntryAsync, updateDreamEntryAsync, deleteDreamEntryAsync } = useDreamContext();
  
  // State for new dream form
  const [showNewDreamForm, setShowNewDreamForm] = useState(false);
  const [newDream, setNewDream] = useState<NewDreamEntry>({ 
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    tags: [],
    mood: '',
    favorite: false,
    interpretation: '',
    visualization: '',
    visualizationUrl: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [expandedDream, setExpandedDream] = useState<string | null>(null);
  
  // Filter states
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Refresh dream journal when component mounts
  useEffect(() => {
    fetchDreamJournal();
  }, [fetchDreamJournal]);

  // Get all unique tags from dreams
  const allTags = Array.from(new Set(dreamJournal.flatMap(dream => dream.tags || [])));

  // Get all unique months from dreams
  const allMonths = Array.from(new Set(dreamJournal
    .map(dream => dream.date?.substring(0, 7))
    .filter(Boolean)
  )).sort().reverse();
  
  // Filter and search dreams
  const filteredDreams = dreamJournal.filter(dream => {
    // Filter by tag if a tag is selected
    if (selectedTag && !(dream.tags || []).includes(selectedTag)) {
      return false;
    }
    
    // Filter by month if a month is selected
    if (selectedMonth && dream.date) {
      const dreamMonth = dream.date.substring(0, 7);
      if (dreamMonth !== selectedMonth) {
        return false;
      }
    }
    
    // Search by title or description
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = dream.title?.toLowerCase().includes(query);
      const matchesDescription = dream.description.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription) {
        return false;
      }
    }
    
    return true;
  });
  
  // Handle adding a new tag to the form
  const handleAddTag = () => {
    if (tagInput.trim() && !newDream.tags.includes(tagInput.trim())) {
      setNewDream(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  // Handle removing a tag from the form
  const handleRemoveTag = (tagToRemove: string) => {
    setNewDream(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDream(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!newDream.title.trim()) {
      setFormError('Please enter a title for your dream');
      return;
    }
    
    if (!newDream.description.trim()) {
      setFormError('Please enter a description of your dream');
      return;
    }
    
    try {
      console.log('Submitting new dream:', newDream);
      
      // Ensure date is in the correct format
      const formattedDream = {
        ...newDream,
        date: new Date(newDream.date).toISOString().split('T')[0],
        // Add the required properties based on our updated DreamEntry interface
        favorite: false,
        visualizationUrl: '',
        // Ensure all required fields are present
        interpretation: '',
        visualization: ''
      };
      
      // Add the new dream entry
      const savedDream = await addDreamEntryAsync(formattedDream);
      console.log('Dream saved successfully:', savedDream);
      
      // No need to refresh the journal as addDreamEntryAsync already updates the state and localStorage
      // The line below is removed because it could potentially overwrite our new entry
      // await fetchDreamJournal();
      
      // Reset form
      setNewDream({
        title: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        tags: [],
        mood: '',
        favorite: false,
        interpretation: '',
        visualization: '',
        visualizationUrl: ''
      });
      
      // Close the form modal
      setShowNewDreamForm(false);
      
      // Show a success message
      alert('Dream saved successfully!');
    } catch (error) {
      setFormError('Failed to save dream entry. Please try again.');
      console.error('Error saving dream:', error);
    }
  };
  
  // Handle deleting a dream
  const handleDeleteDream = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this dream?')) {
      try {
        await deleteDreamEntryAsync(id);
      } catch (error) {
        console.error('Error deleting dream:', error);
      }
    }
  };

  // Helper function to get emoji for mood
  const getMoodEmoji = (mood: string) => {
    const moodEmojis: Record<string, string> = {
      'Peaceful': '😌',
      'Anxious': '😰',
      'Exciting': '🤩',
      'Confusing': '😕',
      'Scary': '😱',
      'Joyful': '😊',
      'Sad': '😢',
      'Curious': '🤔'
    };
    return moodEmojis[mood] || '✨';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-vivid-blue to-teal-400 mb-4"
          >
            Dream Journal
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-300 text-lg max-w-2xl mx-auto"
          >
            Document and explore your dream journey
          </motion.p>
        </div>
        
        {/* Search and Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glassmorphism p-5 rounded-xl mb-8 border border-white/10 backdrop-blur-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-dark-bg/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-vivid-blue focus:border-transparent transition-all"
                placeholder="Search dreams..."
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Tag filter */}
              <div className="relative">
                <select
                  className="bg-dark-bg/30 border border-gray-700 rounded-lg py-2.5 pl-4 pr-10 text-white appearance-none focus:ring-2 focus:ring-vivid-blue focus:border-transparent transition-all text-sm"
                  value={selectedTag || ''}
                  onChange={(e) => setSelectedTag(e.target.value || null)}
                >
                  <option value="">All Tags</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              
              {/* Month filter */}
              <div className="relative">
                <select
                  className="bg-dark-bg/30 border border-gray-700 rounded-lg py-2.5 pl-4 pr-10 text-white appearance-none focus:ring-2 focus:ring-vivid-blue focus:border-transparent transition-all text-sm"
                  value={selectedMonth || ''}
                  onChange={(e) => setSelectedMonth(e.target.value || null)}
                >
                  <option value="">All Time</option>
                  {allMonths.map(month => {
                    const date = new Date(month + '-01');
                    const monthName = date.toLocaleString('default', { month: 'short' });
                    const year = date.getFullYear();
                    return (
                      <option key={month} value={month}>{monthName} {year}</option>
                    );
                  })}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowNewDreamForm(true)}
                className="flex items-center px-4 py-2.5 bg-gradient-to-r from-vivid-blue to-teal-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-vivid-blue/20 transition-all text-sm md:text-base whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Dream
              </motion.button>
            </div>
          </div>
        </motion.div>
        </div>
        
        {/* New Dream Form Modal */}
        {showNewDreamForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-bg border border-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-6">Record New Dream</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {formError && (
                  <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
                    <p className="text-red-400">{formError}</p>
                  </div>
                )}
                
                <div>
                  <label htmlFor="title" className="block text-white font-medium mb-2">Dream Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newDream.title}
                    onChange={handleInputChange}
                    className="w-full bg-dark-bg/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-vivid-blue focus:border-transparent transition-all"
                    placeholder="Give your dream a title"
                  />
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-white font-medium mb-2">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={newDream.date}
                    onChange={handleInputChange}
                    className="w-full bg-dark-bg/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-vivid-blue focus:border-transparent transition-all"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-white font-medium mb-2">Dream Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newDream.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full bg-dark-bg/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-vivid-blue focus:border-transparent transition-all"
                    placeholder="Describe your dream in detail..."
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="mood" className="block text-white font-medium mb-2">Dream Mood</label>
                  <select
                    id="mood"
                    name="mood"
                    value={newDream.mood}
                    onChange={handleInputChange}
                    className="w-full bg-dark-bg/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-vivid-blue focus:border-transparent transition-all"
                  >
                    <option value="">-- Select mood --</option>
                    <option value="Peaceful">Peaceful</option>
                    <option value="Anxious">Anxious</option>
                    <option value="Exciting">Exciting</option>
                    <option value="Confusing">Confusing</option>
                    <option value="Scary">Scary</option>
                    <option value="Joyful">Joyful</option>
                    <option value="Sad">Sad</option>
                    <option value="Curious">Curious</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Tags</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 bg-dark-bg/50 border border-gray-700 rounded-l-lg p-3 text-white focus:ring-2 focus:ring-vivid-blue focus:border-transparent transition-all"
                      placeholder="Add tags (e.g., flying, water, family)"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 bg-gray-700 text-white rounded-r-lg hover:bg-gray-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newDream.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 bg-deep-purple/30 text-white text-sm rounded-full flex items-center"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-gray-400 hover:text-white"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewDreamForm(false)}
                    className="px-4 py-2 border border-gray-600 text-white rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-vivid-blue to-deep-purple text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    Save Dream
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Dream Entries Grid */}
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDreams.map((dream) => (
              <motion.div
                key={dream.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ 
                  type: 'spring',
                  damping: 25,
                  stiffness: 300,
                  duration: 0.3,
                  delay: filteredDreams.indexOf(dream) * 0.03 
                }}
                className="group bg-dark-bg/30 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5 hover:border-vivid-blue/40 transition-all duration-300 hover:shadow-lg hover:shadow-vivid-blue/5 flex flex-col h-full"
              >
                {/* Dream Header */}
                <div className="p-5 pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white mb-1 truncate" title={dream.title || 'Untitled Dream'}>
                        {dream.title || 'Untitled Dream'}
                      </h3>
                      <div className="flex items-center text-xs text-gray-400 space-x-2">
                        <span>{format(new Date(dream.date), 'MMM d, yyyy')}</span>
                        {dream.mood && (
                          <span className="flex items-center">
                            <span className="mx-1">•</span>
                            <span className="text-vivid-blue">{getMoodEmoji(dream.mood)}</span>
                            <span className="ml-1">{dream.mood}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateDreamEntryAsync({
                            ...dream,
                            favorite: !dream.favorite
                          });
                        }}
                        className="text-gray-400 hover:text-yellow-400 transition-colors p-1.5 hover:bg-yellow-400/10 rounded-full"
                        title={dream.favorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5" 
                          viewBox="0 0 20 20" 
                          fill={dream.favorite ? 'currentColor' : 'none'} 
                          stroke="currentColor"
                          strokeWidth={1.5}
                          color={dream.favorite ? '#FBBF24' : 'currentColor'}
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Dream Preview */}
                <div className="px-5 pb-4 flex-1">
                  <p className="text-gray-300 text-sm mb-4 line-clamp-4 leading-relaxed">
                    {dream.description || 'No description provided.'}
                  </p>
                  
                  {dream.tags && dream.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {dream.tags.slice(0, 3).map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="text-xs px-2.5 py-1 rounded-full bg-vivid-blue/10 text-vivid-blue hover:bg-vivid-blue/20 transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTag(tag);
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                      {dream.tags.length > 3 && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-gray-700/50 text-gray-400">
                          +{dream.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {dream.visualizationUrl && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-white/5 group-hover:border-vivid-blue/20 transition-colors">
                      <img 
                        src={dream.visualizationUrl} 
                        alt={`Visualization for ${dream.title || 'dream'}`}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}
                </div>
                
                {/* Dream Actions */}
                <div className="px-5 py-3 bg-dark-bg/50 border-t border-white/5 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to visualization
                        // This would be implemented based on your routing setup
                      }}
                      className="text-gray-400 hover:text-vivid-blue transition-colors p-1.5 hover:bg-vivid-blue/10 rounded-full"
                      title="Visualize"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Copy dream text to clipboard
                        navigator.clipboard.writeText(dream.description || '');
                        // Show a toast notification here if you have one
                      }}
                      className="text-gray-400 hover:text-teal-400 transition-colors p-1.5 hover:bg-teal-400/10 rounded-full"
                      title="Copy to clipboard"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewDream({
                          ...dream,
                          tags: [...(dream.tags || [])],
                          date: new Date(dream.date).toISOString().split('T')[0]
                        });
                        setShowNewDreamForm(true);
                      }}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to delete this dream?')) {
                          handleDeleteDream(dream.id as number);
                        }
                      }}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-full transition-colors"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
        
        {/* Conditional Rendering */}
        <>
          {/* Empty State */}
          {!journalLoading && filteredDreams.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dark-bg/30 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-vivid-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No dreams found</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                {searchQuery || selectedTag || selectedMonth 
                  ? 'Try adjusting your search or filters.' 
                  : 'Start by adding your first dream entry.'}
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowNewDreamForm(true)}
                className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-vivid-blue to-teal-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-vivid-blue/20 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Your First Dream
              </motion.button>
            </div>
          )}
          
          {/* Loading State */}
          {journalLoading && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-vivid-blue border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Loading your dreams...</p>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default JournalPage;
