import React from 'react';
import { motion } from 'framer-motion';

const InterpreterPage: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-dark-bg">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Dream Interpreter</h1>
          <p className="text-light-gray text-lg max-w-3xl mx-auto">
            Decode your dreams into meaningful insights with our AI-powered dream analysis tool.
          </p>
        </motion.div>

        <motion.div
          className="glassmorphism rounded-2xl p-8 border border-white/10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form className="space-y-6">
            <div>
              <label htmlFor="dreamDescription" className="block text-white font-medium mb-2">
                Dream Description
              </label>
              <textarea
                id="dreamDescription"
                rows={6}
                className="w-full bg-dark-bg/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-vivid-blue focus:border-transparent transition-all"
                placeholder="Describe your dream in as much detail as possible..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="dreamDate" className="block text-white font-medium mb-2">
                  Date/Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  id="dreamDate"
                  className="w-full bg-dark-bg/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-vivid-blue focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="mood" className="block text-white font-medium mb-2">
                  Mood/Emotion Tags
                </label>
                <select
                  id="mood"
                  multiple
                  className="w-full bg-dark-bg/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-vivid-blue focus:border-transparent transition-all"
                >
                  <option value="happy">Happy</option>
                  <option value="sad">Sad</option>
                  <option value="anxious">Anxious</option>
                  <option value="peaceful">Peaceful</option>
                  <option value="confused">Confused</option>
                  <option value="scared">Scared</option>
                  <option value="excited">Excited</option>
                </select>
                <p className="text-xs text-light-gray mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>
            </div>

            <motion.button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-vivid-blue to-deep-purple text-white font-medium rounded-lg hover:shadow-lg hover:shadow-deep-purple/20 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Interpret My Dream
            </motion.button>
          </form>

          {/* Placeholder for interpretation results */}
          <div className="mt-10 p-6 border border-dashed border-gray-700 rounded-xl text-center">
            <p className="text-light-gray">
              Your dream interpretation will appear here after submission.
            </p>
          </div>
        </motion.div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <motion.div 
              className="glassmorphism p-6 rounded-xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-vivid-blue to-deep-purple rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold text-white mb-2">Describe Your Dream</h3>
              <p className="text-light-gray">Enter the details of your dream, including emotions, people, places, and events.</p>
            </motion.div>

            <motion.div 
              className="glassmorphism p-6 rounded-xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-deep-purple to-accent-pink rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Analysis</h3>
              <p className="text-light-gray">Our AI processes your dream using psychological frameworks and pattern recognition.</p>
            </motion.div>

            <motion.div 
              className="glassmorphism p-6 rounded-xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-accent-pink to-vivid-blue rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold text-white mb-2">Get Insights</h3>
              <p className="text-light-gray">Receive detailed interpretation, psychological insights, and meaning categories.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterpreterPage;
