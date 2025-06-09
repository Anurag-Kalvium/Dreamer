import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StepProps {
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
  isLast?: boolean;
  delay?: number;
}

export const Step = ({
  number,
  title,
  description,
  icon,
  isLast = false,
  delay = 0,
}: StepProps) => {
  return (
    <motion.div 
      className="relative flex gap-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold z-10 border-4 border-gray-900">
          {number}
        </div>
        {!isLast && (
          <div className="h-full w-0.5 bg-gradient-to-b from-purple-500/30 to-pink-500/30 mt-2" />
        )}
      </div>
      <div className="flex-1 pb-16">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-2xl text-white font-bold">{title}</div>
          <div className="text-purple-400">
            {icon}
          </div>
        </div>
        <p className="text-gray-400">{description}</p>
      </div>
    </motion.div>
  );
};
