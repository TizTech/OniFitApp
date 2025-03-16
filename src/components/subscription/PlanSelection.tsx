import { useState, useEffect } from 'react';
import { getSubscriptionPlans } from '../../lib/supabase';

type SubscriptionPlan = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[] | null;
  is_active: boolean;
};

type PlanSelectionProps = {
  onSelectPlan: (plan: SubscriptionPlan) => void;
  selectedPlanId?: string;
};

export default function PlanSelection({ onSelectPlan, selectedPlanId }: PlanSelectionProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await getSubscriptionPlans();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setPlans(data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load subscription plans');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, []);

  const filteredPlans = plans.filter(plan => plan.interval === billingInterval);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-light rounded w-1/3 mx-auto mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-secondary-light p-6 rounded-lg h-80"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-900/30 border border-red-500 rounded-md p-4 max-w-md mx-auto">
          <p className="text-red-200">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 text-primary hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>
      
      <div className="flex justify-center mb-8">
        <div className="bg-secondary-light p-1 rounded-full">
          <button
            className={`px-6 py-2 rounded-full ${
              billingInterval === 'monthly' 
                ? 'bg-primary text-secondary' 
                : 'text-white hover:bg-secondary-dark'
            }`}
            onClick={() => setBillingInterval('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-6 py-2 rounded-full ${
              billingInterval === 'yearly' 
                ? 'bg-primary text-secondary' 
                : 'text-white hover:bg-secondary-dark'
            }`}
            onClick={() => setBillingInterval('yearly')}
          >
            Yearly <span className="text-xs opacity-75">(Save 15%)</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredPlans.map(plan => (
          <div 
            key={plan.id}
            className={`bg-secondary-light rounded-lg overflow-hidden transition-all duration-300 ${
              selectedPlanId === plan.id 
                ? 'ring-2 ring-primary transform scale-105' 
                : 'hover:transform hover:scale-105'
            }`}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-400 mb-4">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-gray-400">/{billingInterval === 'monthly' ? 'month' : 'year'}</span>
              </div>
              
              <button
                onClick={() => onSelectPlan(plan)}
                className={`w-full py-2 px-4 rounded-md transition-colors ${
                  selectedPlanId === plan.id
                    ? 'bg-primary-dark text-secondary'
                    : 'bg-primary text-secondary hover:bg-primary-dark'
                }`}
              >
                {selectedPlanId === plan.id ? 'Selected' : 'Select Plan'}
              </button>
            </div>
            
            <div className="border-t border-gray-700 p-6">
              <p className="font-medium mb-4">Features:</p>
              <ul className="space-y-2">
                {plan.features?.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-primary mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 