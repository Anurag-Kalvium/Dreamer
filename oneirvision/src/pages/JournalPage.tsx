import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDreamContext, DreamEntry, NewDreamEntry } from '../contexts/DreamContext';
import { format } from 'date-fns';
import { FiPlus, FiSearch, FiFilter, FiEdit3, FiTrash2, FiCalendar, FiTag, FiStar, FiMoon, FiSun, FiCloud, FiHeart, FiZap, FiEye } from 'react-icons/fi';

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
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Filter dreams based on search and filters
  const filteredDreams = dreamJournal
    .filter(dream => {
      if (searchQuery && 
          !dream.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !dream.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedTag && !dream.tags?.includes(selectedTag)) return false;
      if (selectedMood && dream.mood !== selectedMood) return false;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  // Get unique tags and moods for filters
  const allTags = Array.from(new Set(dreamJournal.flatMap(dream => dream.tags || [])));
  const allMoods = Array.from(new Set(dreamJournal.map(dream => dream.mood).filter(Boolean)));

  // Dream statistics
  const dreamStats = {
    total: dreamJournal.length,
    thisMonth: dreamJournal.filter(dream => {
      const dreamDate = new Date(dream.date);
      const now = new Date();
      return dreamDate.getMonth() === now.getMonth() && dreamDate.getFullYear() === now.getFullYear();
    }).length,
    mostCommonMood: allMoods.reduce((a, b, _, arr) => 
      arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b, allMoods[0]
    ) || 'None'
  };

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
      'Peaceful': '🌙',
      'Anxious': '⚡',
      'Exciting': '🌟',
      'Confusing': '🌀',
      'Scary': '🌑',
      'Joyful': '☀️',
      'Sad': '🌧️',
      'Curious': '🔮'
    };
    return moodEmojis[mood] || '✨';
  };

  const getMoodColor = (mood: string) => {
    const moodColors: Record<string, string> = {
      'Peaceful': 'from-blue-400/20 to-indigo-500/20 border-blue-400/30',
      'Anxious': 'from-yellow-400/20 to-orange-500/20 border-yellow-400/30',
      'Exciting': 'from-pink-400/20 to-purple-500/20 border-pink-400/30',
      'Confusing': 'from-gray-400/20 to-slate-500/20 border-gray-400/30',
      'Scary': 'from-red-400/20 to-red-600/20 border-red-400/30',
      'Joyful': 'from-yellow-300/20 to-amber-400/20 border-yellow-300/30',
      'Sad': 'from-blue-500/20 to-blue-700/20 border-blue-500/30',
      'Curious': 'from-purple-400/20 to-violet-500/20 border-purple-400/30'
    };
    return moodColors[mood] || 'from-indigo-400/20 to-purple-500/20 border-indigo-400/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D041B] via-[#2A0845] to-[#1E0B36] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-screen filter blur-xl opacity-30"
            style={{
              width: Math.random() * 300 + 100 + 'px',
              height: Math.random() * 300 + 100 + 'px',
              background: `radial-gradient(circle, ${
                i % 3 === 0 ? '#8EC5FC' : i % 3 === 1 ? '#E0C3FC' : '#A4508B'
              }, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 400],
              y: [0, (Math.random() - 0.5) * 400],
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      </div>

      <div className="relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            <div className="relative inline-block mb-6">
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <FiMoon className="relative text-6xl text-indigo-300 mx-auto" />
            </div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent"
              style={{
                fontFamily: "'Playfair Display', serif",
                textShadow: '0 0 30px rgba(168, 85, 247, 0.3)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Dream Journal
            </motion.h1>
            
            <motion.p 
              className="text-xl text-indigo-200/80 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Where thoughts take shape
            </motion.p>
          </motion.div>

          {/* Stats Panel */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {[
              { label: 'Total Dreams', value: dreamStats.total, icon: FiMoon, color: 'from-blue-400 to-indigo-500' },
              { label: 'This Month', value: dreamStats.thisMonth, icon: FiCalendar, color: 'from-purple-400 to-pink-500' },
              { label: 'Common Mood', value: dreamStats.mostCommonMood, icon: FiHeart, color: 'from-pink-400 to-rose-500' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="relative group"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-200/70 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Controls Panel */}
          <motion.div 
            className="relative mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
                  {/* Search */}
                  <div className="relative flex-1 min-w-0">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-300 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search your dreams..."
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-transparent transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Filter Toggle */}
                  <motion.button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-indigo-200 hover:bg-white/10 hover:border-white/20 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiFilter className="w-5 h-5" />
                    <span>Filters</span>
                  </motion.button>
                </div>

                {/* New Dream Button */}
                <motion.button
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
                  className="relative group px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center gap-2">
                    <FiPlus className="w-5 h-5" />
                    <span>Write New Dream</span>
                  </div>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                </motion.button>
              </div>

              {/* Expanded Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 border-t border-white/10 mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Tag Filter */}
                        <div>
                          <label className="block text-sm font-medium text-indigo-200 mb-2">Filter by Tag</label>
                          <select
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                            value={selectedTag || ''}
                            onChange={(e) => setSelectedTag(e.target.value || null)}
                          >
                            <option value="">All Tags</option>
                            {allTags.map((tag) => (
                              <option key={tag} value={tag}>{tag}</option>
                            ))}
                          </select>
                        </div>

                        {/* Mood Filter */}
                        <div>
                          <label className="block text-sm font-medium text-indigo-200 mb-2">Filter by Mood</label>
                          <select
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                            value={selectedMood || ''}
                            onChange={(e) => setSelectedMood(e.target.value || null)}
                          >
                            <option value="">All Moods</option>
                            {allMoods.map((mood) => (
                              <option key={mood} value={mood}>{getMoodEmoji(mood)} {mood}</option>
                            ))}
                          </select>
                        </div>

                        {/* Sort Order */}
                        <div>
                          <label className="block text-sm font-medium text-indigo-200 mb-2">Sort Order</label>
                          <select
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                          >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Dream Cards */}
          {journalLoading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div
                className="w-16 h-16 border-4 border-indigo-400/30 border-t-indigo-400 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : filteredDreams.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div className="relative inline-block mb-8">
                <motion.div
                  className="absolute -inset-8 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-2xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <FiMoon className="relative text-8xl text-indigo-300" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">No dreams found</h3>
              <p className="text-indigo-200/70 mb-8 max-w-md mx-auto">
                {searchQuery || selectedTag || selectedMood 
                  ? 'Try adjusting your search or filters to find your dreams.' 
                  : 'Begin your journey by capturing your first dream.'}
              </p>
              <motion.button
                onClick={() => setShowNewDreamForm(true)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiPlus className="w-5 h-5" />
                <span>Write Your First Dream</span>
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              {filteredDreams.map((dream, index) => (
                <motion.div
                  key={dream.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group relative"
                  whileHover={{ y: -5 }}
                >
                  {/* Card Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                  
                  {/* Main Card */}
                  <div className={`relative bg-gradient-to-br ${getMoodColor(dream.mood)} backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-3xl">{getMoodEmoji(dream.mood)}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-white truncate">{dream.title}</h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-sm text-indigo-200/70 flex items-center gap-1">
                                <FiCalendar className="w-4 h-4" />
                                {format(new Date(dream.date), 'MMM d, yyyy')}
                              </span>
                              {dream.mood && (
                                <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-gradient-to-r ${getMoodColor(dream.mood)} rounded-full border`}>
                                  {dream.mood}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-indigo-100/80 mb-4 line-clamp-3 leading-relaxed">
                          {dream.description}
                        </p>

                        {/* Tags */}
                        {dream.tags && dream.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {dream.tags.map((tag, idx) => (
                              <motion.span 
                                key={idx} 
                                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-white/10 text-indigo-200 rounded-full border border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTag(tag);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FiTag className="w-3 h-3" />
                                {tag}
                              </motion.span>
                            ))}
                          </div>
                        )}

                        {/* Visualization Preview */}
                        {dream.visualizationUrl && (
                          <div className="mb-4">
                            <img 
                              src={dream.visualizationUrl} 
                              alt="Dream visualization"
                              className="w-full h-32 object-cover rounded-lg border border-white/20"
                            />
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-4">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditDream(dream);
                          }}
                          className="p-2 bg-white/10 hover:bg-white/20 text-indigo-200 hover:text-white rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Edit Dream"
                        >
                          <FiEdit3 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDream(dream.id as number);
                          }}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete Dream"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Dream Quote Widget */}
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-2xl">
                <FiStar className="text-2xl text-yellow-300 mx-auto mb-3" />
                <p className="text-lg text-indigo-100/90 italic mb-2">
                  "Dreams are the touchstones of our characters."
                </p>
                <p className="text-sm text-indigo-200/60">— Henry David Thoreau</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add/Edit Dream Modal */}
      <AnimatePresence>
        {showNewDreamForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowNewDreamForm(false);
              setEditingDream(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-3xl blur-2xl" />
              
              {/* Modal Content */}
              <div className="relative bg-[#0D041B]/95 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-white">
                    {editingDream ? 'Edit Dream' : 'Capture New Dream'}
                  </h2>
                  <motion.button
                    onClick={() => {
                      setShowNewDreamForm(false);
                      setEditingDream(null);
                    }}
                    className="p-2 text-indigo-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiPlus className="w-6 h-6 transform rotate-45" />
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {formError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl"
                    >
                      {formError}
                    </motion.div>
                  )}

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-200 mb-2">Dream Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={newDream.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-transparent transition-all"
                      placeholder="Give your dream a title..."
                      required
                    />
                  </div>

                  {/* Date and Mood */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-indigo-200 mb-2">Date *</label>
                      <input
                        type="date"
                        name="date"
                        value={newDream.date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-indigo-200 mb-2">Mood</label>
                      <select
                        name="mood"
                        value={newDream.mood}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-transparent transition-all"
                      >
                        <option value="">Select a mood</option>
                        <option value="Peaceful">🌙 Peaceful</option>
                        <option value="Anxious">⚡ Anxious</option>
                        <option value="Exciting">🌟 Exciting</option>
                        <option value="Confusing">🌀 Confusing</option>
                        <option value="Scary">🌑 Scary</option>
                        <option value="Joyful">☀️ Joyful</option>
                        <option value="Sad">🌧️ Sad</option>
                        <option value="Curious">🔮 Curious</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-200 mb-2">Dream Description *</label>
                    <textarea
                      name="description"
                      value={newDream.description}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-transparent transition-all resize-none"
                      placeholder="Describe your dream in detail..."
                      required
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-200 mb-2">Tags</label>
                    <div className="flex gap-2 mb-3">
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
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-transparent transition-all"
                      />
                      <motion.button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-lg hover:bg-indigo-500/30 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Add
                      </motion.button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newDream.tags?.map((tag, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-200 rounded-full text-sm border border-indigo-400/30"
                        >
                          {tag}
                          <motion.button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-indigo-300 hover:text-white transition-colors"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                          >
                            ×
                          </motion.button>
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Visualization URL */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-200 mb-2">Visualization URL (Optional)</label>
                    <input
                      type="url"
                      name="visualizationUrl"
                      value={newDream.visualizationUrl || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-transparent transition-all"
                      placeholder="https://example.com/visualization"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 pt-6">
                    <motion.button
                      type="button"
                      onClick={() => {
                        setShowNewDreamForm(false);
                        setEditingDream(null);
                      }}
                      className="px-6 py-3 text-indigo-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {editingDream ? 'Update Dream' : 'Save Dream'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JournalPage;