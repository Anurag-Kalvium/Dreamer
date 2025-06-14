import React from 'react';
import { motion } from 'framer-motion';
import { FiBarChart2, FiCalendar, FiImage, FiClock, FiMoon } from 'react-icons/fi';

// This component is now replaced by the new dashboard design
// Keeping it for backward compatibility but it's no longer used

const DashboardCards: React.FC = () => {
  return (
    <motion.div 
      className="text-center py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <p className="text-gray-400">
        Dashboard has been redesigned. Please check the new layout.
      </p>
    </motion.div>
  );
};

export default DashboardCards;