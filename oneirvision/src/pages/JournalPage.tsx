import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDreamContext } from '../contexts/DreamContext';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Heart, 
  Moon, 
  Calendar, 
  Sparkles, 
  Filter,
  SortAsc,
  SortDesc,
  BookOpen,
  Star,
  Clock,
  Tag
} from 'lucide-react';
import SpeechToText from '../components/SpeechToText';
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
    date: new Date().toISOString().slice(0, 16),
    isLucid: false
  });

  const moodOptions = [
    { value: 'peaceful', label: 'Peaceful', emoji: '🌙', color: 'from-blue-400 to-indigo-500' },
    { value: 'adventurous', label: 'Adventurous', emoji: '⚡', color: 'from-yellow-400 to-orange-500' },
    { value: 'mysterious', label: 'Mysterious', emoji: '🔮', color: 'from-purple-400 to-pink-500' },
    { value: 'scary', label: 'Scary', emoji: '👻', color: 'from-red-400 to-red-600' },
    { value: 'happy', label: 'Happy', emoji: '☀️', color: 'from-green-400 to-blue-500' },
    { value: 'sad', label: 'Sad', emoji: '☁️', color: 'from-gray-400 to-blue-400' },
    { value: 'confused', label: 'Confused', emoji: '🌀', color: 'from-indigo-400 to-purple-500' },
    { value: 'excited', label: 'Excited', emoji: '🎆', color: 'from-pink-400 to-red-500' },
    { value: 'lucid', label: 'Lucid', emoji: '✨', color: 'from-yellow-400 to-amber-500' }
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
      const dreamData = {
        ...formData,
        tags: formData.tags,
        mood: formData.isLucid ? 'lucid' : formData.mood
      };

      if (editingDream) {
        await updateDreamEntryAsync({
          ...editingDream,
          ...dreamData
        });
      } else {
        await addDreamEntryAsync({
          ...dreamData,
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
        date: new Date().toISOString().slice(0, 16),
        isLucid: false
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
      mood: dream.mood === 'lucid' ? 'peaceful' : dream.mood,
      tags: dream.tags || [],
      date: new Date(dream.date).toISOString().slice(0, 16),
      isLucid: dream.mood === 'lucid' || 
               dream.description.toLowerCase().includes('lucid') ||
               dream.description.toLowerCase().includes('aware') ||
               dream.description.toLowerCase().includes('control')
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

  const handleSpeechToTextUpdate = (text: string) => {
    setFormData(prev => ({
      ...prev,
      description: text
    }));
  };

  const isLucidDream = (dream: DreamEntry) => {
    return dream.mood === 'lucid' || 
           dream.description.toLowerCase().includes('lucid') ||
           dream.description.toLowerCase().includes('aware') ||
           dream.description.toLowerCase().includes('control');
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
      <div className="min-h-screen bg-[#0D041B] relative overflow-hidden">
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

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-400 mx-auto mb-6"></div>
            <h3 className="text-2xl font-semibold text-white mb-2">Loading Dreams</h3>
            <p className="text-gray-300">Gathering your dream memories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D041B] relative overflow-hidden">
      {/* Animated Background - matching homepage */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-indigo-900/10 to-[#0D041B]" />
        
        {/* Animated elements - matching homepage */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full mix-blend-screen"
              style={{
                width: Math.random() * 400 + 100 + 'px',
                height: Math.random() * 400 + 100 + 'px',
                background: `radial-gradient(circle, ${
                  Math.random() > 0.5 ? 'rgba(168, 85, 247, 0.1)' : 'rgba(99, 102, 241, 0.1)'
                }, transparent 70%)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 200],
                y: [0, (Math.random() - 0.5) * 200],
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
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header - matching homepage style */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            {/* Floating Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8 hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <BookOpen className="h-5 w-5 text-indigo-300 mr-2 animate-pulse" />
              <span className="text-sm font-medium text-indigo-200">
                📖 Your Personal Dream Archive
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 font-heading"
              style={{
                background: 'linear-gradient(90deg, #FFFFFF 0%, #E0EAFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 20px rgba(168, 85, 247, 0.3)',
              }}
            >
              Dream Journal
            </motion.h1>
            
            {/* Subheading */}
            <motion.h2 
              className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-8 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Where Dreams Become Memories
            </motion.h2>
            
            {/* Description */}
            <motion.p 
              className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Capture, explore, and reflect on your dream experiences. Build patterns, track lucid dreams, and unlock the wisdom of your subconscious mind.
            </motion.p>
          </motion.div>

          {/* Controls Section */}
          <motion.div 
            className="mb-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl hover:bg-white/10 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search your dreams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    value={selectedMood}
                    onChange={(e) => setSelectedMood(e.target.value)}
                    className="pl-10 pr-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">All Moods</option>
                    {moodOptions.map(mood => (
                      <option key={mood.value} value={mood.value} className="bg-gray-800">
                        {mood.emoji} {mood.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
                  className="flex items-center gap-2 px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  title={`Sort by ${sortBy === 'newest' ? 'oldest' : 'newest'} first`}
                >
                  {sortBy === 'newest' ? <SortDesc className="h-5 w-5" /> : <SortAsc className="h-5 w-5" />}
                  <span className="hidden sm:inline">
                    {sortBy === 'newest' ? 'Newest' : 'Oldest'}
                  </span>
                </button>
              </div>

              {/* New Dream Button */}
              <motion.button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="h-5 w-5" />
                <span>New Dream</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Error State */}
          {journalError && (
            <motion.div 
              className="mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400">⚠</span>
                </div>
                <div>
                  <h3 className="font-semibold">Error Loading Dreams</h3>
                  <p className="text-sm text-red-300">{journalError}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Dreams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <AnimatePresence>
              {filteredDreams.map((dream, index) => (
                <motion.div
                  key={dream.id}
                  className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  {/* Lucid Dream Indicator */}
                  {isLucidDream(dream) && (
                    <div className="absolute top-4 right-4">
                      <motion.div
                        className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-medium border border-yellow-500/30"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="h-4 w-4" />
                        Lucid
                      </motion.div>
                    </div>
                  )}

                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${getMoodColor(dream.mood)} bg-opacity-20 backdrop-blur-sm`}>
                        <span className="text-2xl">{getMoodIcon(dream.mood)}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white line-clamp-1 mb-2">
                          {dream.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="h-4 w-4" />
                          {new Date(dream.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleFavorite(dream)}
                      className={`p-2 rounded-full transition-colors ${
                        dream.favorite 
                          ? 'text-red-400 hover:text-red-300 bg-red-500/20' 
                          : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${dream.favorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {dream.description}
                  </p>

                  {/* Tags */}
                  {dream.tags && dream.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {dream.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-white/10 text-gray-300 rounded-full border border-white/10"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                      {dream.tags.length > 3 && (
                        <span className="px-3 py-1 text-xs bg-white/10 text-gray-300 rounded-full border border-white/10">
                          +{dream.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleEdit(dream)}
                      className="flex-1 px-4 py-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dream.id)}
                      className="flex-1 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <Trash2 className="h-4 w-4" />
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
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-8 p-8 bg-white/5 rounded-full w-32 h-32 mx-auto flex items-center justify-center backdrop-blur-sm border border-white/10">
                <Moon className="h-16 w-16 text-indigo-300" />
              </div>
              <h3 className="text-3xl font-semibold text-white mb-4">
                {searchTerm || selectedMood ? 'No dreams found' : 'Your dream journal awaits'}
              </h3>
              <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
                {searchTerm || selectedMood 
                  ? 'Try adjusting your search or filters to find more dreams' 
                  : 'Start capturing your dreams and unlock the hidden patterns of your subconscious mind'}
              </p>
              <motion.button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center gap-3 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="h-5 w-5" />
                {searchTerm || selectedMood ? 'Add New Dream' : 'Write Your First Dream'}
              </motion.button>
            </motion.div>
          )}
        </div>
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
              className="w-full max-w-3xl bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm">
                    <BookOpen className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">
                    {editingDream ? 'Edit Dream' : 'Capture a New Dream'}
                  </h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Dream Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    placeholder="Give your dream a memorable title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Dream Description
                  </label>
                  <div className="relative">
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={8}
                      className="w-full px-4 py-4 pr-16 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                      placeholder="Describe your dream in vivid detail..."
                      required
                    />
                    {/* Speech-to-Text Component */}
                    <div className="absolute top-4 right-4">
                      <SpeechToText 
                        onTextUpdate={handleSpeechToTextUpdate}
                        className="relative"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Mood & Emotion
                    </label>
                    <select
                      value={formData.mood}
                      onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    >
                      {moodOptions.filter(mood => mood.value !== 'lucid').map(mood => (
                        <option key={mood.value} value={mood.value} className="bg-gray-800">
                          {mood.emoji} {mood.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>
                </div>

                {/* Lucid Dream Toggle */}
                <div className="flex items-center justify-between p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <div className="flex items-center gap-4">
                    <Sparkles className="h-8 w-8 text-yellow-400" />
                    <div>
                      <h3 className="text-white font-semibold text-lg">Lucid Dream</h3>
                      <p className="text-gray-400">Were you aware you were dreaming?</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isLucid}
                      onChange={(e) => setFormData({ ...formData, isLucid: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-yellow-500"></div>
                  </label>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
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