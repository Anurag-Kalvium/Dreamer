import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
  gradientFrom?: string;
  gradientTo?: string;
}

export const FeatureCard = ({
  icon,
  title,
  description,
  delay = 0,
  gradientFrom = 'from-purple-500',
  gradientTo = 'to-pink-500',
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay }}
      className="group relative h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1"
    >
      <div 
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradientFrom}/5 ${gradientTo}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />
    </motion.div>
  );
};
