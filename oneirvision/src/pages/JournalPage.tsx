import React, { useState, useEffect } from 'react';
import { useDreamContext, DreamEntry } from '../contexts/DreamContext';

const JournalPage: React.FC = () => {
  const { dreamJournal, journalLoading, journalError, fetchDreamJournal, addDreamEntryAsync, updateDreamEntryAsync, deleteDreamEntryAsync } = useDreamContext();

  // Filter states
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  
  // New dream entry form state
  const [showNewDreamForm, setShowNewDreamForm] = useState(false);
  const [newDream, setNewDream] = useState<Omit<DreamEntry, 'id'>>({ 
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    tags: [],
    mood: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  
  // Refresh dream journal when component mounts
  useEffect(() => {
    fetchDreamJournal();
  }, [fetchDreamJournal]);

  // Get all unique tags from dreams
  const allTags = Array.from(new Set(dreamJournal.flatMap(dream => dream.tags)));

  // Get all unique months from dreams
  const allMonths = Array.from(new Set(dreamJournal.map(dream => dream.date.substring(0, 7))));
  
  // Filter dreams based on selected filters
  const filteredDreams = dreamJournal.filter(dream => {
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
      // Ensure date is in the correct format
      const formattedDream = {
        ...newDream,
        date: new Date(newDream.date).toISOString().split('T')[0],
        // Add the required properties based on our updated DreamEntry interface
        favorite: false,
        visualizationUrl: ''
      };
      
      await addDreamEntryAsync(formattedDream);
      
      // Refresh the journal to show the new entry
      await fetchDreamJournal();
      
      // Reset form
      setNewDream({
        title: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        tags: [],
        mood: ''
      });
      
      // Close the form modal
      setShowNewDreamForm(false);
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

  return (
    <div className="pt-20 min-h-screen bg-dark-bg">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Dream Journal</h1>
          <p className="text-light-gray text-lg max-w-3xl mx-auto">
            Record and track your dreams to discover patterns and insights over time.
          </p>
        </div>
        
        {/* Filters and Add Dream Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-3">
            {/* Tag filter */}
            <div className="relative">
              <select
                className="bg-dark-bg/50 border border-gray-700 rounded-lg py-2 pl-4 pr-10 text-white appearance-none focus:ring-2 focus:ring-vivid-blue focus:border-transparent transition-all"
                value={selectedTag || ''}
                onChange={(e) => setSelectedTag(e.target.value || null)}
              >
                <option value="">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            
            {/* Month filter */}
            <div className="relative">
              <select
                className="bg-dark-bg/50 border border-gray-700 rounded-lg py-2 pl-4 pr-10 text-white appearance-none focus:ring-2 focus:ring-vivid-blue focus:border-transparent transition-all"
                value={selectedMonth || ''}
                onChange={(e) => setSelectedMonth(e.target.value || null)}
              >
                <option value="">All Months</option>
                {allMonths.map(month => {
                  const date = new Date(month + '-01');
                  const monthName = date.toLocaleString('default', { month: 'long' });
                  const year = date.getFullYear();
                  return (
                    <option key={month} value={month}>{monthName} {year}</option>
                  );
                })}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowNewDreamForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-vivid-blue to-deep-purple text-white rounded-lg hover:shadow-lg transition-all"
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Dream
            </span>
          </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredDreams.map((dream, index) => (
            <div
              key={dream.id}
              className="dream-card glassmorphism rounded-xl p-5 border border-white/10"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{dream.title}</h3>
                  <p className="text-light-gray text-sm">{new Date(dream.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      const updatedDream = {
                        ...dream,
                        favorite: !dream.favorite
                      };
                      updateDreamEntryAsync(updatedDream);
                    }}
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={dream.favorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" color={dream.favorite ? "#FBBF24" : "currentColor"}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteDream(dream.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <p className="text-white mb-4 line-clamp-3">{dream.description}</p>
              
              {dream.mood && (
                <div className="mb-4">
                  <span className="px-3 py-1 bg-deep-purple/30 text-white text-sm rounded-full">
                    Mood: {dream.mood}
                  </span>
                </div>
              )}
              
              {dream.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {dream.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-800 text-light-gray text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              {dream.visualizationUrl && (
                <div className="mt-4 rounded-lg overflow-hidden">
                  <img 
                    src={dream.visualizationUrl} 
                    alt={`Visualization for ${dream.title}`}
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
