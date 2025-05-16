import React from 'react';
import { motion } from 'framer-motion';

const AboutSection: React.FC = () => {
  return (
    <motion.section 
      id="about"
      className="py-20 px-4 bg-dark-bg relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Background gradient */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-deep-purple/20 rounded-full filter blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-vivid-blue/20 rounded-full filter blur-3xl" />
      
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">About OneirVision</h2>
          <p className="text-light-gray max-w-2xl mx-auto">Bringing dreams to reality through innovative design and cutting-edge technology.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="glassmorphism p-6 rounded-2xl border border-white/10 h-full">
              <h3 className="text-2xl font-semibold mb-4 text-white">Our Vision</h3>
              <p className="text-light-gray mb-4">
                At OneirVision, we believe in translating dreams into tangible experiences. Our team of experts works tirelessly to push the boundaries of what's possible in the digital realm.
              </p>
              <p className="text-light-gray">
                We combine creativity with technical expertise to deliver solutions that not only meet but exceed expectations, creating immersive experiences that leave lasting impressions.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-deep-purple/30 to-accent-pink/30 p-1">
              <div className="w-full h-full rounded-xl overflow-hidden">
                <div className="w-full h-full bg-dark-bg/80 rounded-xl flex items-center justify-center">
                  <div className="text-center p-6">
                    <h4 className="text-xl font-semibold mb-3 text-white">Innovation Through Design</h4>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      {['Research', 'Strategy', 'Design', 'Develop', 'Deploy', 'Maintain'].map((item, index) => (
                        <div key={index} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                          <p className="text-white font-medium">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-pink/20 rounded-full filter blur-xl z-[-1]" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-vivid-blue/20 rounded-full filter blur-xl z-[-1]" />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
