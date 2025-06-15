import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useDreamContext } from '../contexts/DreamContext';
import { 
  User, 
  Mail, 
  Calendar, 
  Camera, 
  Save, 
  Bell, 
  Shield, 
  Palette, 
  Moon,
  BarChart3,
  Clock,
  Check,
  X,
  Upload
} from 'lucide-react';

const ProfileSettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { dreamJournal } = useDreamContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.picture || ''
  });

  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: {
      dreamReminders: true,
      weeklyInsights: true,
      newFeatures: false
    },
    privacy: {
      profileVisible: false,
      shareAnalytics: true,
      dataCollection: true
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  // Calculate user statistics
  const userStats = {
    totalDays: Math.floor((Date.now() - new Date(user?.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24)),
    dreamsRecorded: dreamJournal.length,
    lastLogin: new Date().toLocaleDateString(),
    joinDate: new Date(user?.createdAt || Date.now()).toLocaleDateString()
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSettingChange = (category: string, setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          avatar: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would update the user data here
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerification = async () => {
    setIsLoading(true);
    try {
      // Simulate sending verification email
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmailVerificationSent(true);
      setMessage({ type: 'success', text: 'Verification email sent!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send verification email.' });
    } finally {
      setIsLoading(false);
    }
  };

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

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="max-w-4xl mx-auto w-full">
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
                <User className="h-8 w-8 text-indigo-300" />
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                Profile Settings
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Customize your OneirVision experience and manage your account
            </p>
          </motion.div>

          {/* Message Display */}
          {message && (
            <motion.div
              className={`mb-6 p-4 rounded-xl border ${
                message.type === 'success' 
                  ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center gap-2">
                {message.type === 'success' ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                {message.text}
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <motion.div 
              className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center mb-8">
                <User className="h-6 w-6 text-indigo-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Profile Information</h2>
              </div>

              <div className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                      {formData.avatar ? (
                        <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        formData.name?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{formData.name}</h3>
                    <p className="text-gray-400">{formData.email}</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                    >
                      <Upload className="h-4 w-4" />
                      Change Avatar
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        placeholder="Enter your email"
                      />
                      {!emailVerificationSent && (
                        <button
                          onClick={handleEmailVerification}
                          disabled={isLoading}
                          className="px-4 py-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-xl transition-colors text-sm"
                        >
                          Verify
                        </button>
                      )}
                    </div>
                    {emailVerificationSent && (
                      <p className="text-sm text-green-400 mt-1">✓ Verification email sent</p>
                    )}
                  </div>
                </div>

                {/* Account Information */}
                <div className="pt-6 border-t border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Calendar className="h-5 w-5 text-indigo-400 mr-2" />
                    Account Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Member since:</span>
                      <span className="text-white">{userStats.joinDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last login:</span>
                      <span className="text-white">{userStats.lastLogin}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Statistics & Settings */}
            <div className="space-y-6">
              {/* Usage Statistics */}
              <motion.div 
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center mb-6">
                  <BarChart3 className="h-6 w-6 text-purple-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Usage Stats</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-indigo-400 mr-2" />
                      <span className="text-gray-300">Days Active</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{userStats.totalDays}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Moon className="h-5 w-5 text-purple-400 mr-2" />
                      <span className="text-gray-300">Dreams Recorded</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{userStats.dreamsRecorded}</span>
                  </div>
                </div>
              </motion.div>

              {/* Theme Settings */}
              <motion.div 
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center mb-6">
                  <Palette className="h-6 w-6 text-pink-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Theme</h3>
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Dark Mode</span>
                    <input
                      type="checkbox"
                      checked={settings.theme === 'dark'}
                      onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.checked ? 'dark' : 'light' }))}
                      className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </label>
                </div>
              </motion.div>

              {/* Notification Settings */}
              <motion.div 
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="flex items-center mb-6">
                  <Bell className="h-6 w-6 text-yellow-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Notifications</h3>
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Dream Reminders</span>
                    <input
                      type="checkbox"
                      checked={settings.notifications.dreamReminders}
                      onChange={(e) => handleSettingChange('notifications', 'dreamReminders', e.target.checked)}
                      className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Weekly Insights</span>
                    <input
                      type="checkbox"
                      checked={settings.notifications.weeklyInsights}
                      onChange={(e) => handleSettingChange('notifications', 'weeklyInsights', e.target.checked)}
                      className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">New Features</span>
                    <input
                      type="checkbox"
                      checked={settings.notifications.newFeatures}
                      onChange={(e) => handleSettingChange('notifications', 'newFeatures', e.target.checked)}
                      className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </label>
                </div>
              </motion.div>

              {/* Privacy Settings */}
              <motion.div 
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="flex items-center mb-6">
                  <Shield className="h-6 w-6 text-green-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Privacy</h3>
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Public Profile</span>
                    <input
                      type="checkbox"
                      checked={settings.privacy.profileVisible}
                      onChange={(e) => handleSettingChange('privacy', 'profileVisible', e.target.checked)}
                      className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Share Analytics</span>
                    <input
                      type="checkbox"
                      checked={settings.privacy.shareAnalytics}
                      onChange={(e) => handleSettingChange('privacy', 'shareAnalytics', e.target.checked)}
                      className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Data Collection</span>
                    <input
                      type="checkbox"
                      checked={settings.privacy.dataCollection}
                      onChange={(e) => handleSettingChange('privacy', 'dataCollection', e.target.checked)}
                      className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </label>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Save Button */}
          <motion.div 
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <button
              onClick={handleSaveChanges}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save Changes
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;