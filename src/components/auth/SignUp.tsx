import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, updateProfile, supabase } from '../../lib/supabase';

type Step = 'account' | 'profile' | 'success';

export default function SignUp() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('account');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Account information
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Profile information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('beginner');
  
  // User ID for profile creation
  const [userId, setUserId] = useState<string | null>(null);

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Validate passwords match
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      console.log('Attempting to sign up with:', { email });
      
      // Create the user account
      const { data, error } = await signUp(email, password, { 
        first_name: firstName, 
        last_name: lastName 
      });
      
      console.log('Sign up response:', { data, error });
      
      if (error) {
        throw error;
      }
      
      if (!data.user) {
        throw new Error('Failed to create account');
      }
      
      console.log('User created successfully:', data.user.id);
      
      // Store the user ID for profile creation
      setUserId(data.user.id);
      
      // Move to profile step
      setCurrentStep('profile');
    } catch (err: any) {
      console.error('Account creation error:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (!userId) {
        throw new Error('User ID is missing. Please try signing up again.');
      }
      
      console.log('Creating user profile for:', { userId, firstName, lastName });
      
      // Create the user profile
      const { error } = await updateProfile(userId, {
        first_name: firstName,
        last_name: lastName,
        fitness_goal: fitnessGoal,
        fitness_level: fitnessLevel,
      });
      
      console.log('Profile update response:', { error });
      
      if (error) {
        throw error;
      }
      
      console.log('Profile created successfully');
      
      // Move to success step
      setCurrentStep('success');
    } catch (err: any) {
      console.error('Profile creation error:', err);
      setError(err.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const renderAccountStep = () => (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center">Create Your Account</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-md text-red-200">
          {error}
        </div>
      )}
      
      <form onSubmit={handleAccountSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-secondary border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1 text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-secondary border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 bg-secondary border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Continue'}
        </button>
      </form>
      
      <p className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <a href="/login" className="text-primary hover:underline">
          Log In
        </a>
      </p>
    </>
  );

  const renderProfileStep = () => (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center">Your Fitness Profile</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-md text-red-200">
          {error}
        </div>
      )}
      
      <form onSubmit={handleProfileSubmit}>
        <div className="mb-4">
          <label htmlFor="firstName" className="block mb-1 text-sm font-medium">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3 py-2 bg-secondary border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="lastName" className="block mb-1 text-sm font-medium">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3 py-2 bg-secondary border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="fitnessGoal" className="block mb-1 text-sm font-medium">
            Fitness Goal
          </label>
          <input
            id="fitnessGoal"
            type="text"
            value={fitnessGoal}
            onChange={(e) => setFitnessGoal(e.target.value)}
            placeholder="e.g., Lose weight, Build muscle, Improve endurance"
            className="w-full px-3 py-2 bg-secondary border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="fitnessLevel" className="block mb-1 text-sm font-medium">
            Fitness Level
          </label>
          <select
            id="fitnessLevel"
            value={fitnessLevel}
            onChange={(e) => setFitnessLevel(e.target.value)}
            className="w-full px-3 py-2 bg-secondary border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            required
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Creating Profile...' : 'Complete Sign Up'}
        </button>
      </form>
    </>
  );

  const renderSuccessStep = () => (
    <div className="text-center">
      <div className="mb-6 flex justify-center">
        <svg
          className="w-16 h-16 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Account Created!</h2>
      
      <p className="mb-6">
        Your account has been successfully created. You can now log in to access your account.
      </p>
      
      <button
        onClick={handleGoToLogin}
        className="btn btn-primary"
      >
        Go to Login
      </button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-secondary-light rounded-lg shadow-lg">
      {currentStep === 'account' && renderAccountStep()}
      {currentStep === 'profile' && renderProfileStep()}
      {currentStep === 'success' && renderSuccessStep()}
    </div>
  );
} 