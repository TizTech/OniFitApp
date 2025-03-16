import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center bg-secondary">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-9xl font-bold text-primary mb-4">404</div>
          <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/" className="btn btn-primary">
              Return to Home
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">
              Go to Dashboard
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-16"
        >
          <div className="text-gray-400">
            Need help? <a href="mailto:info@tizzle.org" className="text-primary hover:text-primary-light">Contact Support</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound; 