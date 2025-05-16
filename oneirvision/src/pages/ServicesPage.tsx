import React from 'react';
import { motion } from 'framer-motion';

const ServicesPage: React.FC = () => {
  const services = [
    {
      title: "3D Visualization",
      description: "Immersive 3D models and environments that bring your ideas to life.",
      icon: "🌐"
    },
    {
      title: "Interactive Web Design",
      description: "Engaging and responsive websites that captivate your audience.",
      icon: "🖥️"
    },
    {
      title: "AR/VR Experiences",
      description: "Cutting-edge augmented and virtual reality solutions for next-level engagement.",
      icon: "👁️"
    },
    {
      title: "UI/UX Design",
      description: "User-centered design that ensures intuitive and seamless experiences.",
      icon: "✨"
    },
    {
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications built for performance.",
      icon: "📱"
    },
    {
      title: "Custom Software Solutions",
      description: "Tailored software that solves your unique business challenges.",
      icon: "⚙️"
    }
  ];

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Our Services</h1>
        <p className="text-light-gray text-lg max-w-3xl mx-auto">
          Innovative solutions to transform your digital presence
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 my-12">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="glassmorphism p-6 rounded-xl flex flex-col h-full"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-vivid-blue to-deep-purple rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">{service.icon}</span>
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white">{service.title}</h2>
            <p className="text-light-gray flex-grow">{service.description}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 text-vivid-blue hover:text-white flex items-center gap-2 transition-colors duration-300"
            >
              Learn more
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="glassmorphism p-8 rounded-xl my-12 text-center"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Need a custom solution?</h2>
        <p className="text-light-gray mb-6 max-w-2xl mx-auto">
          We specialize in bringing unique ideas to life. Tell us about your project and let's create something amazing together.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-vivid-blue to-deep-purple text-white font-medium rounded-full hover:shadow-lg hover:shadow-deep-purple/20 transition-all duration-300"
        >
          Get in Touch
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ServicesPage;
