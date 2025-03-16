import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="bg-gradient-to-r from-secondary-light to-secondary-dark rounded-2xl overflow-hidden">
        <div className="relative py-16 px-8 md:px-16">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                className="absolute rounded-full bg-primary"
                style={{
                  width: Math.random() * 300 + 100,
                  height: Math.random() * 300 + 100,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: 0.05,
                }}
                animate={{
                  y: [0, Math.random() * 50 - 25],
                  x: [0, Math.random() * 50 - 25],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-8 md:mb-0 md:mr-8 md:max-w-xl"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Ready to Transform Your <span className="text-primary">Fitness Journey</span>?
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                Start your 7-day free trial today and experience the power of AI-driven personalized fitness.
                No credit card required.
              </p>
              <ul className="space-y-2 mb-8">
                {['Personalized Meal Plans', 'Custom Workout Routines', 'Progress Tracking', 'AI Recommendations'].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center text-gray-300"
                  >
                    <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-secondary-dark p-8 rounded-xl border border-gray-800 w-full md:w-auto"
            >
              <h3 className="text-2xl font-bold mb-4 text-white text-center">
                Start Your Free Trial
              </h3>
              <p className="text-gray-400 mb-6 text-center">
                Join thousands of satisfied users
              </p>
              <Link
                to="/signup"
                className="btn btn-primary w-full text-center block mb-4"
              >
                Start 7-Day Free Trial
              </Link>
              <p className="text-gray-500 text-sm text-center">
                No credit card required. Cancel anytime.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction; 