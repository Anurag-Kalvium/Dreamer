import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDreamContext, DreamEntry, NewDreamEntry } from '../contexts/DreamContext';
import { format } from 'date-fns';

const JournalPage: React.FC = () => {
  const { 
    dreamJournal, 
    journalLoading, 
    addDreamEntryAsync, 
    updateDreamEntryAsync, 
    deleteDreamEntryAsync 
  } = useDreamContext();

  // Form state
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
  const [editingDream, setEditingDream] = useState<DreamEntry | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Fetch dreams on mount
  useEffect(() => {
    // fetchDreamJournal is called automatically by the context
  }, []);

  // Filter dreams based on search and filters
  const filteredDreams = dreamJournal.filter(dream => {
    if (searchQuery && 
        !dream.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !dream.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedTag && !dream.tags?.includes(selectedTag)) return false;
    if (selectedMonth && !dream.date.startsWith(selectedMonth)) return false;
    return true;
  });

  // Get unique tags and months for filters
  const allTags = Array.from(new Set(dreamJournal.flatMap(dream => dream.tags || [])));
  const allMonths = Array.from(new Set(
    dreamJournal.map(dream => dream.date?.substring(0, 7)).filter(Boolean)
  )).sort().reverse();

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDream(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !newDream.tags?.includes(tagInput.trim())) {
      setNewDream(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewDream(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newDream.title.trim() || !newDream.description.trim()) {
      setFormError('Please fill in all required fields');
      return;
    }

    try {
      if (editingDream) {
        await updateDreamEntryAsync({ ...newDream, id: editingDream.id } as DreamEntry);
      } else {
        await addDreamEntryAsync(newDream);
      }
      setShowNewDreamForm(false);
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
      setEditingDream(null);
    } catch (error) {
      setFormError('Failed to save dream. Please try again.');
      console.error('Error saving dream:', error);
    }
  };

  const handleEditDream = (dream: DreamEntry) => {
    setNewDream({ ...dream });
    setEditingDream(dream);
    setShowNewDreamForm(true);
  };

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <p className="text-gray-400 max-w-xl mx-auto">
            Record, reflect, and visualize your dreams.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="glassmorphism p-5 rounded-xl mb-8 border border-white/10 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Search dreams..."
              className="flex-1 px-4 py-2 rounded-lg bg-dark-bg/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-vivid-blue"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="px-4 py-2 rounded-lg bg-dark-bg/50 border border-gray-700 text-white"
              value={selectedTag || ''}
              onChange={(e) => setSelectedTag(e.target.value || null)}
            >
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            <select
              className="px-4 py-2 rounded-lg bg-dark-bg/50 border border-gray-700 text-white"
              value={selectedMonth || ''}
              onChange={(e) => setSelectedMonth(e.target.value || null)}
            >
              <option value="">All Months</option>
              {allMonths.map((month) => (
                <option key={month} value={month}>
                  {new Date(month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
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
              setEditingDream(null);
              setShowNewDreamForm(true);
            }}
            className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-vivid-blue to-teal-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-vivid-blue/20 transition-all"
          >
            + Add New Dream
          </button>
        </div>

        {/* Dream List */}
        {journalLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vivid-blue"></div>
          </div>
        ) : filteredDreams.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌙</div>
            <h3 className="text-xl font-semibold text-white mb-2">No dreams found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || selectedTag || selectedMonth 
                ? 'Try adjusting your search or filters.' 
                : 'Start by adding your first dream entry.'}
            </p>
            <button
              onClick={() => setShowNewDreamForm(true)}
              className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-vivid-blue to-teal-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-vivid-blue/20 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Your First Dream
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredDreams.map((dream) => (
              <motion.div
                key={dream.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-dark-bg/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-vivid-blue/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getMoodEmoji(dream.mood)}</span>
                      <h3 className="text-xl font-semibold text-white">{dream.title}</h3>
                      <span className="text-sm text-gray-400">
                        {format(new Date(dream.date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4">{dream.description}</p>
                    {dream.tags && dream.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {dream.tags.map((tag, idx) => (
                          <span 
                            key={idx} 
                            className="px-3 py-1 text-xs font-medium bg-vivid-blue/10 text-vivid-blue rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTag(tag);
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditDream(dream);
                      }}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDream(dream.id as number);
                      }}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-full transition-colors"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add/Edit Dream Modal */}
        <AnimatePresence>
          {showNewDreamForm && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-dark-bg rounded-xl p-6 w-full max-w-2xl border border-gray-800 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {editingDream ? 'Edit Dream' : 'Add New Dream'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowNewDreamForm(false);
                      setEditingDream(null);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {formError && (
                    <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                      {formError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={newDream.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-dark-bg/70 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-vivid-blue"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Date *</label>
                      <input
                        type="date"
                        name="date"
                        value={newDream.date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-dark-bg/70 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-vivid-blue"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Mood</label>
                      <select
                        name="mood"
                        value={newDream.mood}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-dark-bg/70 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-vivid-blue"
                      >
                        <option value="">Select a mood</option>
                        <option value="Peaceful">😌 Peaceful</option>
                        <option value="Anxious">😰 Anxious</option>
                        <option value="Exciting">🤩 Exciting</option>
                        <option value="Confusing">😕 Confusing</option>
                        <option value="Scary">😱 Scary</option>
                        <option value="Joyful">😊 Joyful</option>
                        <option value="Sad">😢 Sad</option>
                        <option value="Curious">🤔 Curious</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description *</label>
                    <textarea
                      name="description"
                      value={newDream.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg bg-dark-bg/70 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-vivid-blue"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Tags</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="Add a tag and press Enter"
                        className="flex-1 px-4 py-2 rounded-lg bg-dark-bg/70 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-vivid-blue"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-vivid-blue/20 text-vivid-blue rounded-lg hover:bg-vivid-blue/30 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newDream.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-vivid-blue/10 text-vivid-blue rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-vivid-blue/70 hover:text-vivid-blue"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Visualization URL</label>
                    <input
                      type="url"
                      name="visualizationUrl"
                      value={newDream.visualizationUrl || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-dark-bg/70 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-vivid-blue"
                      placeholder="https://example.com/visualization"
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewDreamForm(false);
                        setEditingDream(null);
                      }}
                      className="px-6 py-2.5 text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-vivid-blue to-teal-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-vivid-blue/20 transition-all"
                    >
                      {editingDream ? 'Update Dream' : 'Save Dream'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default JournalPage;