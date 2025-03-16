import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Components for each section
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Testimonials from '../components/landing/Testimonials';
import CallToAction from '../components/landing/CallToAction';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section id="features" className="section bg-secondary">
        <Features />
      </section>

      {/* Parallax Section */}
      <div className="parallax h-80" style={{ backgroundImage: 'url(https://via.placeholder.com/1920x1080/0a0a0a/00ff00?text=Transform+Your+Fitness)' }}>
        <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Transform Your Fitness Journey</h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Powered by AI, personalized for you.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Testimonials Section */}
      <section id="testimonials" className="section bg-secondary-light">
        <Testimonials />
      </section>

      {/* Call to Action */}
      <section className="section bg-secondary">
        <CallToAction />
      </section>
    </div>
  );
};

export default LandingPage; 