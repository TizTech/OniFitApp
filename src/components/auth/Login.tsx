import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, resetPassword, supabase } from '../../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      console.log('Attempting to sign in with:', { email });
      
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      const { data, error } = await signIn(email, password);
      
      console.log('Sign in response:', { data, error });
      
      if (error) {
        throw error;
      }
      
      if (!data.user || !data.session) {
        throw new Error('Authentication failed. Please try again.');
      }
      
      console.log('User authenticated successfully:', data.user.id);
      
      // Check if user has an active subscription
      const userId = data.user.id;
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['active', 'trialing'])
        .single();
      
      console.log('Subscription check:', { subscriptionData, subscriptionError });
      
      if (subscriptionError || !subscriptionData) {
        // No active subscription, redirect to subscription page
        console.log('No active subscription, redirecting to subscription page');
        navigate('/subscription');
      } else {
        // Has active subscription, redirect to dashboard
        console.log('Active subscription found, redirecting to dashboard');
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (!email) {
        throw new Error('Email is required');
      }
      
      console.log('Attempting to reset password for:', email);
      const { error } = await resetPassword(email);
      
      if (error) {
        throw error;
      }
      
      setResetSent(true);
      console.log('Password reset email sent');
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (resetMode) {
    return (
      <div className="max-w-md mx-auto p-6 bg-secondary-light rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-md text-red-200">
            {error}
          </div>
        )}
        
        {resetSent ? (
          <div className="text-center">
            <p className="mb-4">
              If an account exists with this email, we've sent you instructions to reset your password.
            </p>
            <button
              onClick={() => setResetMode(false)}
              className="text-primary hover:underline"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="mb-6">
              <label htmlFor="resetEmail" className="block mb-1 text-sm font-medium">
                Email
              </label>
              <input
                id="resetEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-secondary border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full btn btn-primary mb-4"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </button>
            
            <p className="text-center">
              <button
                type="button"
                onClick={() => setResetMode(false)}
                className="text-primary hover:underline"
              >
                Back to Login
              </button>
            </p>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-secondary-light rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-md text-red-200">
          {error}
        </div>
      )}
      
      <form onSubmit={handleLogin}>
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
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <button
              type="button"
              onClick={() => setResetMode(true)}
              className="text-xs text-primary hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-secondary border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Logging In...' : 'Log In'}
        </button>
      </form>
      
      <p className="mt-4 text-center text-sm">
        Don't have an account?{' '}
        <a href="/signup" className="text-primary hover:underline">
          Sign Up
        </a>
      </p>
    </div>
  );
} 