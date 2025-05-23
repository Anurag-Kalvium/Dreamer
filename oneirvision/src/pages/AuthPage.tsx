import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import LoginButton from '../components/LoginButton';
import { Navigate, useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If user is already authenticated, redirect to interpreter page
  if (isAuthenticated) {
    return <Navigate to="/interpreter" />;
  }

  return (
    <div className="min-h-screen pt-20 bg-dark-bg flex items-center justify-center">
      <motion.div
        className="max-w-md w-full p-8 glassmorphism rounded-2xl border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-4">Welcome to OneirVision</h1>
          <p className="text-light-gray">
            Unlock the secrets of your dreams with AI-powered interpretation and visualization.
          </p>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-dark-bg/50 rounded-xl border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">Sign in to continue</h2>
            <p className="text-light-gray mb-6">
              Sign in with your Google account to start your dream journey and access all features.
            </p>
            
            <div className="flex justify-center">
              <LoginButton />
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={() => navigate('/')}
              className="text-light-gray hover:text-white transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
