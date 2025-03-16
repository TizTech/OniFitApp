import { motion } from 'framer-motion';
import LoginComponent from '../components/auth/Login';

export default function Login() {
  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <LoginComponent />
        </motion.div>
      </div>
    </div>
  );
} 