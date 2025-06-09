import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import LoginButton from '../components/LoginButton';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';

// Create typed icon components
const FiMail = FiIcons.FiMail as React.ComponentType<{ className?: string }>;
const FiLock = FiIcons.FiLock as React.ComponentType<{ className?: string }>;
const FiUser = FiIcons.FiUser as React.ComponentType<{ className?: string }>;
const FiArrowRight = FiIcons.FiArrowRight as React.ComponentType<{ className?: string }>;
const FiHome = FiIcons.FiHome as React.ComponentType<{ className?: string }>;

const AuthPage: React.FC = () => {
  const { isAuthenticated, login, signup, error: authError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(searchParams.get('tab') === 'register' ? 'register' : 'login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const error = formError || authError || '';

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');
    
    try {
      if (activeTab === 'login') {
        try {
          await login(formData.email, formData.password);
          navigate('/dashboard');
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to sign in. Please try again.';
          setFormError(message);
          throw err; // Re-throw to be caught by the outer catch
        }
      } else {
        try {
          await signup(formData.email, formData.password, formData.name);
          navigate('/dashboard');
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to create account. Please try again.';
          setFormError(message);
          throw err; // Re-throw to be caught by the outer catch
        }
      }
    } catch (err) {
      // Error is already handled in the inner try-catch
      console.error('Authentication error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-dark-bg to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-deep-purple/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-vivid-blue/20 rounded-full filter blur-3xl"></div>
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-gradient-to-br from-dark-secondary/80 to-gray-900/80 backdrop-blur-sm rounded-3xl border border-gray-800/50 shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            <button
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'login'
                  ? 'text-white border-b-2 border-vivid-blue'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'register'
                  ? 'text-white border-b-2 border-teal-400'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('register')}
            >
              Create Account
            </button>
          </div>

          <div className="p-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-gray-400">
                  {activeTab === 'login'
                    ? 'Sign in to continue to your dream journal.'
                    : 'Start your dream journey with us today.'}
                </p>
              </div>

              {error && (
                <motion.div 
                  className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {activeTab === 'register' && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-vivid-blue/50 focus:border-vivid-blue outline-none text-white placeholder-gray-500 transition-all"
                      placeholder="Full Name"
                      required={activeTab === 'register'}
                    />
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-vivid-blue/50 focus:border-vivid-blue outline-none text-white placeholder-gray-500 transition-all"
                    placeholder="Email address"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-vivid-blue/50 focus:border-vivid-blue outline-none text-white placeholder-gray-500 transition-all"
                    placeholder="Password"
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all ${
                    isLoading
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-vivid-blue to-teal-500 hover:shadow-lg hover:shadow-vivid-blue/30 transform hover:-translate-y-0.5'
                  }`}
                >
                  {isLoading ? (
                    'Processing...'
                  ) : (
                    <span className="flex items-center justify-center">
                      {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                      <FiArrowRight className="ml-2" />
                    </span>
                  )}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <LoginButton />
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <FiHome className="mr-2" />
                  Back to Home
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
