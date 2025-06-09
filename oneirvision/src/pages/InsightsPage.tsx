import React from 'react';
import { motion } from 'framer-motion';

const InsightsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-gray-900 pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-vivid-blue to-teal-400">
            Dream Insights
          </h1>
          <p className="text-gray-400 mt-2">
            Discover patterns and insights from your dream journal
          </p>
        </motion.div>

        <div className="bg-dark-bg/50 rounded-xl p-8 border border-gray-700">
          <div className="text-center py-12">
            <div className="text-6xl mb-6">📊</div>
            <h2 className="text-2xl font-semibold text-white mb-4">Coming Soon</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We're working on bringing you detailed insights and analytics about your dreams. 
              Check back soon to discover patterns and trends in your dream journal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
