import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../lib/supabase';

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    fitnessGoal: '',
    dietaryPreferences: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous errors
    setError(null);
    
    if (step === 1) {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords don't match");
        return;
      }
      
      // Validate password length
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      
      setStep(2);
    } else if (step === 2) {
      // Final step - register the user with Supabase
      setLoading(true);
      
      try {
        // Extract first and last name from the full name
        const nameParts = formData.name.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Register the user with Supabase
        const { data, error } = await signUp(
          formData.email, 
          formData.password, 
          { 
            first_name: firstName, 
            last_name: lastName
          }
        );
        
        if (error) {
          throw error;
        }
        
        // Show success message and redirect to login
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err: any) {
        console.error('Signup error:', err);
        setError(err.message || 'Failed to create account. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // State for success message
  const [success, setSuccess] = useState(false);

  // If registration was successful, show success message
  if (success) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto bg-secondary-light rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="bg-primary/20 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <svg className="h-12 w-12 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold mb-4">Account Created Successfully!</h2>
              <p className="text-gray-300 mb-6">
                Please check your email to verify your account. You will be redirected to the login page in a few seconds.
              </p>
              
              <Link to="/login" className="btn btn-primary">
                Go to Login
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto bg-secondary-light rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white">
                {step === 1 && 'Create Your Account'}
                {step === 2 && 'Your Fitness Profile'}
              </h1>
              <p className="text-gray-400 mt-2">
                {step === 1 && 'Join OniFit to start your fitness journey'}
                {step === 2 && 'Help us personalize your experience'}
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-md text-red-200">
                {error}
              </div>
            )}

            {/* Progress Steps */}
            <div className="flex justify-between mb-8">
              {[1, 2].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      i <= step ? 'bg-primary text-secondary' : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {i < step ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      i
                    )}
                  </div>
                  <span
                    className={`text-xs mt-1 ${
                      i <= step ? 'text-primary' : 'text-gray-500'
                    }`}
                  >
                    {i === 1 && 'Account'}
                    {i === 2 && 'Profile'}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Account Information */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-md bg-secondary border border-gray-700 text-white focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-md bg-secondary border border-gray-700 text-white focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-300 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-md bg-secondary border border-gray-700 text-white focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-md bg-secondary border border-gray-700 text-white focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Fitness Profile */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4">
                    <label htmlFor="fitnessGoal" className="block text-gray-300 mb-2">
                      What is your primary fitness goal?
                    </label>
                    <select
                      id="fitnessGoal"
                      name="fitnessGoal"
                      value={formData.fitnessGoal}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-md bg-secondary border border-gray-700 text-white focus:outline-none focus:border-primary"
                      required
                    >
                      <option value="">Select a goal</option>
                      <option value="weight-loss">Weight Loss</option>
                      <option value="muscle-gain">Muscle Gain</option>
                      <option value="endurance">Improve Endurance</option>
                      <option value="overall-health">Overall Health</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="dietaryPreferences" className="block text-gray-300 mb-2">
                      Any dietary preferences?
                    </label>
                    <select
                      id="dietaryPreferences"
                      name="dietaryPreferences"
                      value={formData.dietaryPreferences}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-md bg-secondary border border-gray-700 text-white focus:outline-none focus:border-primary"
                      required
                    >
                      <option value="">Select preference</option>
                      <option value="no-restrictions">No Restrictions</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="keto">Keto</option>
                      <option value="paleo">Paleo</option>
                    </select>
                  </div>
                </motion.div>
              )}

              <div className="flex justify-between">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep((prev) => prev - 1)}
                    className="btn btn-secondary"
                    disabled={loading}
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className={`btn btn-primary ${step < 2 ? 'ml-auto' : 'flex-1'}`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    step === 2 ? 'Create Account' : 'Continue'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Log In
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp; 