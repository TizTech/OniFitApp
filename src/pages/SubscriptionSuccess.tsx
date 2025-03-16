import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function SubscriptionSuccess() {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        // If not authenticated, redirect to home
        navigate('/');
        return;
      }
      
      // Get user profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('first_name')
        .eq('id', data.session.user.id)
        .single();
      
      if (profileData?.first_name) {
        setUserName(profileData.first_name);
      }
    };
    
    checkAuth();
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-primary/20 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <svg className="h-12 w-12 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Subscription Successful!</h1>
        
        <p className="text-xl text-gray-300 mb-8">
          {userName ? `Thank you, ${userName}!` : 'Thank you!'} Your subscription has been activated and you now have access to premium features.
        </p>
        
        <div className="bg-secondary-light p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">What's Next?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div>
              <div className="text-primary font-bold text-lg mb-2">1. Complete Your Profile</div>
              <p className="text-gray-400">Add your fitness goals, current stats, and preferences to get personalized recommendations.</p>
            </div>
            
            <div>
              <div className="text-primary font-bold text-lg mb-2">2. Generate Your Plan</div>
              <p className="text-gray-400">Use our AI to create a custom workout plan tailored to your specific needs.</p>
            </div>
            
            <div>
              <div className="text-primary font-bold text-lg mb-2">3. Start Your Journey</div>
              <p className="text-gray-400">Begin tracking your workouts and watch your progress over time.</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
          
          <Link to="/profile" className="btn btn-secondary">
            Complete Your Profile
          </Link>
        </div>
      </div>
    </div>
  );
} 