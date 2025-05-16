import React from 'react';
import { motion } from 'framer-motion';

const ProjectsPage: React.FC = () => {
  const projects = [
    {
      title: "NeuroDream Interface",
      category: "AR/VR",
      description: "An immersive virtual reality experience that translates brain activity into interactive dreamscapes.",
      image: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
    },
    {
      title: "Quantum Visualizer",
      category: "3D Visualization",
      description: "A powerful tool for scientists to visualize complex quantum mechanics principles through interactive 3D models.",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
    },
    {
      title: "Harmonic UI Framework",
      category: "UI/UX Design",
      description: "A comprehensive design system that adapts to user behavior for creating harmonious digital experiences.",
      image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1780&q=80"
    },
    {
      title: "EchoSpace",
      category: "Interactive Web",
      description: "A revolutionary web platform that creates personalized audio environments based on user interaction.",
      image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1736&q=80"
    },
    {
      title: "Nebula Analytics",
      category: "Custom Software",
      description: "An intuitive data visualization platform that transforms complex datasets into meaningful insights.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
    },
    {
      title: "Prism Mobile",
      category: "Mobile App",
      description: "A cross-platform mobile application that uses AR to enhance real-world photography with dynamic effects.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
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
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Our Projects</h1>
        <p className="text-light-gray text-lg max-w-3xl mx-auto">
          Explore our portfolio of innovative digital experiences
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 my-12">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="glassmorphism overflow-hidden rounded-xl flex flex-col h-full"
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
              />
              <div className="absolute top-3 right-3 bg-deep-purple/80 text-white text-xs px-2 py-1 rounded-full">
                {project.category}
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-3 text-white">{project.title}</h2>
              <p className="text-light-gray text-sm flex-grow">{project.description}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-4 py-2 border border-vivid-blue text-vivid-blue hover:bg-vivid-blue hover:text-white rounded-lg transition-colors duration-300 text-sm"
              >
                View Details
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
