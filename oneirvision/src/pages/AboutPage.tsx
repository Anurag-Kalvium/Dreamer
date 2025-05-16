import React from 'react';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 bg-dark-bg">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">About OneirVision</h1>
          <p className="text-light-gray text-lg max-w-3xl mx-auto">
            An AI-powered platform that decodes your dreams into meaningful insights and visualizes them.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 my-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glassmorphism p-6 rounded-xl"
          >
            <h2 className="text-2xl font-bold mb-4 text-white">What is OneirVision?</h2>
            <p className="text-light-gray mb-4">
              OneirVision is an innovative platform that blends psychology, machine learning, and art to help you explore your subconscious like never before.
            </p>
            <p className="text-light-gray">
              Our platform interprets your dreams using advanced AI algorithms, providing meaningful insights into your subconscious mind, and transforms these interpretations into stunning visual representations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="glassmorphism p-6 rounded-xl"
          >
            <h2 className="text-2xl font-bold mb-4 text-white">Mission & Vision</h2>
            <p className="text-light-gray mb-4">
              Our mission is to provide a deeper understanding of the human mind through dream analysis, making the subconscious accessible and meaningful to everyone.
            </p>
            <p className="text-light-gray">
              We envision a world where people can harness the power of their dreams to gain personal insights, enhance creativity, and improve mental well-being.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="glassmorphism p-8 rounded-xl my-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-white text-center">Our Features</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-vivid-blue to-deep-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Dream Interpreter</h3>
              <p className="text-light-gray">AI-powered analysis of your dreams with psychological insights and meaning categories</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-deep-purple to-accent-pink rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Dream Visualizer</h3>
              <p className="text-light-gray">Transform your interpreted dreams into stunning AI-generated visuals</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-accent-pink to-vivid-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Dream Journal</h3>
              <p className="text-light-gray">Track, analyze, and discover patterns in your dreams over time</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="glassmorphism p-8 rounded-xl my-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-white text-center">Tech Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'React', icon: '⚛️' },
              { name: 'Tailwind CSS', icon: '🎨' },
              { name: 'Framer Motion', icon: '✨' },
              { name: 'Spline 3D', icon: '🔮' },
              { name: 'AI & NLP', icon: '🧠' },
              { name: 'Stable Diffusion', icon: '🖼️' },
              { name: 'TypeScript', icon: '📝' },
              { name: 'Node.js', icon: '🚀' }
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                className="bg-dark-bg/50 p-4 rounded-lg border border-gray-800 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <span className="text-2xl mb-2 block">{tech.icon}</span>
                <h3 className="font-medium text-white">{tech.name}</h3>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="glassmorphism p-6 rounded-xl my-12 border border-white/10 max-w-3xl mx-auto"
        >
          <h2 className="text-xl font-bold mb-4 text-white">Ethical Note</h2>
          <p className="text-light-gray">
            OneirVision is designed for personal exploration and entertainment purposes only. The interpretations and visualizations provided should not be considered medical advice or a substitute for professional psychological consultation. Dream analysis is a subjective field, and our AI-generated insights are meant to inspire reflection rather than provide definitive explanations.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
