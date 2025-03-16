import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCheckoutSession } from '../../lib/stripe';

export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  is_active: boolean;
  trial_days: number;
};

export type PaymentFormProps = {
  plan: SubscriptionPlan;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function PaymentForm({ plan, onSuccess, onCancel }: PaymentFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      console.log('Processing subscription for plan:', plan.name);
      
      // Create checkout session
      const { success, error, redirectUrl } = await createCheckoutSession(plan.id);
      
      if (!success) {
        throw new Error(error || 'Failed to process subscription');
      }
      
      // If we have a redirect URL, navigate to it
      if (redirectUrl) {
        navigate(redirectUrl);
        return;
      }
      
      // Otherwise, call the success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      setError(err.message || 'Failed to process subscription');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6 bg-secondary-light rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {plan.trial_days > 0 ? 'Start Your Free Trial' : 'Subscription Details'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-md text-red-200">
          {error}
        </div>
      )}
      
      <div className="mb-6 p-4 bg-secondary rounded-md">
        <div className="flex justify-between mb-2">
          <span className="font-medium">{plan.name}</span>
          <span>
            ${plan.price}/{plan.interval}
          </span>
        </div>
        {plan.trial_days > 0 && (
          <p className="text-sm text-green-400">
            Includes {plan.trial_days}-day free trial
          </p>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h3 className="font-medium mb-2">Features:</h3>
          <ul className="space-y-1">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start text-sm">
                <svg className="h-5 w-5 text-primary mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-300 hover:text-white"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : plan.trial_days > 0 ? (
              'Start Free Trial'
            ) : (
              `Subscribe for $${plan.price}/${plan.interval}`
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 