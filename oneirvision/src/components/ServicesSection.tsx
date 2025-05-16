import React from 'react';
import { motion } from 'framer-motion';

const ServicesSection: React.FC = () => {
  const services = [
    {
      title: 'Web Development',
      description: 'Creating stunning, responsive websites with modern frameworks and bleeding-edge technology.',
      icon: '💻',
      color: 'from-vivid-blue to-deep-purple'
    },
    {
      title: '3D Experience Design',
      description: 'Immersive 3D experiences that captivate users and provide unique interactive interfaces.',
      icon: '🔮',
      color: 'from-deep-purple to-accent-pink'
    },
    {
      title: 'Mobile Applications',
      description: 'Native and cross-platform mobile apps with seamless performance and beautiful UI.',
      icon: '📱',
      color: 'from-accent-pink to-vivid-blue'
    },
    {
      title: 'AR/VR Solutions',
      description: 'Augmented and virtual reality experiences that blend digital and physical worlds.',
      icon: '🥽',
      color: 'from-vivid-blue to-accent-pink'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <section id="services" className="py-20 px-4 bg-dark-bg relative">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-deep-purple/10 filter blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-accent-pink/10 filter blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Our Services</h2>
          <p className="text-light-gray max-w-2xl mx-auto">Transforming ideas into exceptional digital experiences through our specialized services.</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {services.map((service, index) => (
            <motion.div 
              key={index}
              className="glassmorphism rounded-2xl p-6 border border-white/10 h-full flex flex-col transition-all duration-300 hover:transform hover:-translate-y-2"
              variants={itemVariants}
            >
              <div className={`w-14 h-14 rounded-xl mb-5 flex items-center justify-center text-2xl bg-gradient-to-br ${service.color}`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{service.title}</h3>
              <p className="text-light-gray flex-grow">{service.description}</p>
              <motion.button 
                className="mt-5 text-sm font-medium text-white flex items-center group"
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                Learn more
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
