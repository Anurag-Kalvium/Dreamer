import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDreamContext } from '../contexts/DreamContext';
import { FiPlus, FiEdit3, FiTrash2, FiSearch, FiFilter, FiCalendar, FiHeart, FiMoon, FiSun, FiCloud, FiZap } from 'react-icons/fi';
import type { DreamEntry } from '../contexts/DreamContext';

const JournalPage: React.FC = () => {
  const { 
    dreamJournal, 
    journalLoading, 
    journalError, 
    addDreamEntryAsync, 
    updateDreamEntryAsync, 
    deleteDreamEntryAsync,
    fetchDreamJournal 
  } = useDreamContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDream, setEditingDream] = useState<DreamEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mood: 'peaceful',
    tags: [] as string[],
    date: new Date().toISOString().slice(0, 16)
  });

  const moodOptions = [
    { value: 'peaceful', label: 'Peaceful', emoji: '🌙', color: 'from-blue-400 to-indigo-500' },
    { value: 'adventurous', label: 'Adventurous', emoji: '⚡', color: 'from-yellow-400 to-orange-500' },
    { value: 'mysterious', label: 'Mysterious', emoji: '🔮', color: 'from-purple-400 to-pink-500' },
    { value: 'scary', label: 'Scary', emoji: '👻', color: 'from-red-400 to-red-600' },
    { value: 'happy', label: 'Happy', emoji: '☀️', color: 'from-green-400 to-blue-500' },
    { value: 'sad', label: 'Sad', emoji: '☁️', color: 'from-gray-400 to-blue-400' },
    { value: 'confused', label: 'Confused', emoji: '🌀', color: 'from-indigo-400 to-purple-500' },
    { value: 'excited', label: 'Excited', emoji: '🎆', color: 'from-pink-400 to-red-500' }
  ];

  useEffect(() => {
    fetchDreamJournal();
  }, [fetchDreamJournal]);

  const filteredDreams = dreamJournal
    .filter(dream => {
      const matchesSearch = dream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dream.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMood = !selectedMood || dream.mood === selectedMood;
      return matchesSearch && matchesMood;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingDream) {
        await updateDreamEntryAsync({
          ...editingDream,
          ...formData,
          tags: formData.tags
        });
      } else {
        await addDreamEntryAsync({
          ...formData,
          tags: formData.tags,
          favorite: false,
          interpretation: '',
          visualization: '',
          visualizationUrl: ''
        });
      }
      
      setIsModalOpen(false);
      setEditingDream(null);
      setFormData({
        title: '',
        description: '',
        mood: 'peaceful',
        tags: [],
        date: new Date().toISOString().slice(0, 16)
      });
    } catch (error) {
      console.error('Error saving dream:', error);
    }
  };

  const handleEdit = (dream: DreamEntry) => {
    setEditingDream(dream);
    setFormData({
      title: dream.title,
      description: dream.description,
      mood: dream.mood,
      tags: dream.tags || [],
      date: new Date(dream.date).toISOString().slice(0, 16)
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this dream?')) {
      await deleteDreamEntryAsync(id);
    }
  };

  const toggleFavorite = async (dream: DreamEntry) => {
    await updateDreamEntryAsync({
      ...dream,
      favorite: !dream.favorite
    });
  };

  const getMoodIcon = (mood: string) => {
    const moodOption = moodOptions.find(m => m.value === mood);
    return moodOption?.emoji || '🌙';
  };

  const getMoodColor = (mood: string) => {
    const moodOption = moodOptions.find(m => m.value === mood);
    return moodOption?.color || 'from-blue-400 to-indigo-500';
  };

  if (journalLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0D041B] to-[#1E0B36] pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your dreams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D041B] to-[#1E0B36] pt-20 pb-12">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-indigo-900/10 to-[#0D041B]" />
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-screen"
            style={{
              width: Math.random() * 300 + 100 + 'px',
              height: Math.random() * 300 + 100 + 'px',
              background: `radial-gradient(circle, ${
                Math.random() > 0.5 ? 'rgba(168, 85, 247, 0.1)' : 'rgba(99, 102, 241, 0.1)'
              }, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 100],
              y: [0, (Math.random() - 0.5) * 100],
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              className="mr-4 p-3 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <FiMoon className="h-8 w-8 text-indigo-300" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              Dream Journal
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Where thoughts take shape and memories find meaning
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div 
          className="mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search your dreams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3 items-center">
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              >
                <option value="">All Moods</option>
                {moodOptions.map(mood => (
                  <option key={mood.value} value={mood.value}>
                    {mood.emoji} {mood.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {/* New Dream Button */}
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlus className="h-5 w-5" />
              Write New Dream
            </motion.button>
          </div>
        </motion.div>

        {/* Error State */}
        {journalError && (
          <motion.div 
            className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {journalError}
          </motion.div>
        )}

        {/* Dreams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredDreams.map((dream, index) => (
              <motion.div
                key={dream.id}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${getMoodColor(dream.mood)} bg-opacity-20`}>
                      <span className="text-lg">{getMoodIcon(dream.mood)}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white line-clamp-1">
                        {dream.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {new Date(dream.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleFavorite(dream)}
                    className={`p-2 rounded-full transition-colors ${
                      dream.favorite 
                        ? 'text-red-400 hover:text-red-300' 
                        : 'text-gray-400 hover:text-red-400'
                    }`}
                  >
                    <FiHeart className={`h-5 w-5 ${dream.favorite ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {dream.description}
                </p>

                {/* Tags */}
                {dream.tags && dream.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dream.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 text-xs bg-white/10 text-gray-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {dream.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-white/10 text-gray-300 rounded-full">
                        +{dream.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(dream)}
                    className="flex-1 px-3 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FiEdit3 className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dream.id)}
                    className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FiTrash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredDreams.length === 0 && !journalLoading && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-6 p-6 bg-white/5 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
              <FiMoon className="h-12 w-12 text-indigo-300" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">No dreams found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || selectedMood 
                ? 'Try adjusting your search or filters' 
                : 'Start capturing your dreams and unlock their hidden meanings'}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
            >
              Write Your First Dream
            </button>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="w-full max-w-2xl bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingDream ? 'Edit Dream' : 'Capture a New Dream'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Dream Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    placeholder="Give your dream a title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Dream Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                    placeholder="Describe your dream in detail..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Mood
                    </label>
                    <select
                      value={formData.mood}
                      onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    >
                      {moodOptions.map(mood => (
                        <option key={mood.value} value={mood.value}>
                          {mood.emoji} {mood.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                  >
                    {editingDream ? 'Update Dream' : 'Save Dream'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JournalPage;