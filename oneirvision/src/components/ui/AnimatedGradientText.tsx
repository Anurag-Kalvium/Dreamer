import { motion } from 'framer-motion';

interface AnimatedGradientTextProps {
  text: string;
  className?: string;
  from?: string;
  to?: string;
}

export const AnimatedGradientText = ({
  text,
  className = '',
  from = 'from-purple-400',
  to = 'to-pink-400',
}: AnimatedGradientTextProps) => {
  return (
    <span className={`relative`}>
      <motion.span
        className={`absolute inset-0 bg-gradient-to-r ${from} ${to} bg-clip-text text-transparent`}
        initial={{ opacity: 0.8, x: -5, y: -5 }}
        animate={{
          opacity: [0.8, 1, 0.8],
          x: [-5, 0, -5],
          y: [-5, 0, -5],
        }}
        transition={{
          duration: 4,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      >
        {text}
      </motion.span>
      <span className={`relative ${className}`}>
        {text}
      </span>
    </span>
  );
};
