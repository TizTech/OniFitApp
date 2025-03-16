import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-secondary-dark opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary"></div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-primary"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.05,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            <span className="text-primary">AI-Powered</span> Fitness <br /> Tailored For You
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Personalized meal plans, workout routines, and progress tracking powered by artificial intelligence.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup" className="btn btn-primary text-lg">
              Start 7-Day Free Trial
            </Link>
            <a href="#features" className="btn btn-secondary text-lg">
              Learn More
            </a>
          </div>
          
          <div className="mt-12">
            <p className="text-gray-400 mb-4">Trusted by fitness enthusiasts</p>
            <div className="flex justify-center space-x-8">
              {/* Placeholder logos */}
              <div className="h-8 w-24 bg-gray-700 rounded-md opacity-50"></div>
              <div className="h-8 w-24 bg-gray-700 rounded-md opacity-50"></div>
              <div className="h-8 w-24 bg-gray-700 rounded-md opacity-50"></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </div>
  );
};

export default Hero; 