import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PlanSelection from '../components/subscription/PlanSelection';
import PaymentForm from '../components/subscription/PaymentForm';

type SubscriptionPlan = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[] | null;
  is_active: boolean;
};

export default function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = () => {
    // In a real app, you would update the user's subscription status
    // and redirect them to a success page or dashboard
    navigate('/subscription/success');
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-secondary-light p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="mb-6">You need to be logged in to subscribe to a plan.</p>
          <div className="flex space-x-4 justify-center">
            <a href="/login" className="btn btn-primary">
              Log In
            </a>
            <a href="/signup" className="btn btn-secondary">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {showPaymentForm && selectedPlan ? (
        <PaymentForm
          plan={selectedPlan}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      ) : (
        <>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Upgrade Your Fitness Journey</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose the plan that fits your goals and unlock premium features to accelerate your fitness progress.
            </p>
          </div>
          
          <PlanSelection
            onSelectPlan={handleSelectPlan}
            selectedPlanId={selectedPlan?.id}
          />
          
          <div className="mt-12 max-w-3xl mx-auto bg-secondary-light p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Why Subscribe?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-primary mb-2">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-bold mb-1">Personalized Plans</h4>
                <p className="text-gray-400">AI-generated workout plans tailored to your specific goals and fitness level.</p>
              </div>
              
              <div>
                <div className="text-primary mb-2">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-bold mb-1">Advanced Analytics</h4>
                <p className="text-gray-400">Track your progress with detailed metrics and visualizations.</p>
              </div>
              
              <div>
                <div className="text-primary mb-2">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-bold mb-1">Premium Support</h4>
                <p className="text-gray-400">Get priority access to our fitness experts for guidance and motivation.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 