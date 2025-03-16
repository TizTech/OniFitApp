import { supabase } from './supabase';

// This is the URL for your Stripe API endpoint
// In a real app, this would be your backend server endpoint
const STRIPE_API_URL = import.meta.env.VITE_STRIPE_API_URL || 'https://api.example.com/stripe';

export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  is_active: boolean;
  trial_days: number;
  stripe_price_id?: string; // Stripe price ID
};

/**
 * Creates a Stripe checkout session for subscription
 */
export const createCheckoutSession = async (planId: string) => {
  try {
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('You must be logged in to subscribe');
    }
    
    const userId = session.user.id;
    const userEmail = session.user.email;
    
    // Get user profile data
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('first_name, last_name')
      .eq('id', userId)
      .single();
    
    // Get the plan details
    const { data: planData, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();
    
    if (planError || !planData) {
      throw new Error('Failed to retrieve plan details');
    }
    
    // For development/demo purposes, we'll simulate a Stripe checkout session
    // In a real app, you would call your backend API to create a Stripe checkout session
    
    // If this is a free trial, handle it directly
    if (planData.trial_days > 0) {
      // Calculate trial end date
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + planData.trial_days);
      
      // Create subscription record
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          status: 'trialing',
          current_period_start: new Date().toISOString(),
          current_period_end: trialEndDate.toISOString(),
          trial_start: new Date().toISOString(),
          trial_end: trialEndDate.toISOString()
        });
      
      if (subscriptionError) {
        throw new Error('Failed to create subscription');
      }
      
      // Create payment history record for free trial
      await supabase
        .from('payment_history')
        .insert({
          user_id: userId,
          amount: 0, // Free trial
          status: 'succeeded',
          description: `Free trial - ${planData.name}`,
          payment_method: 'Free Trial'
        });
      
      return { success: true, redirectUrl: '/subscription/success' };
    }
    
    // For a real implementation, you would call your backend API:
    // const response = await fetch(`${STRIPE_API_URL}/create-checkout-session`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     planId,
    //     userId,
    //     userEmail,
    //     customerName: profileData ? `${profileData.first_name} ${profileData.last_name}` : undefined,
    //   }),
    // });
    
    // if (!response.ok) {
    //   const errorData = await response.json();
    //   throw new Error(errorData.message || 'Failed to create checkout session');
    // }
    
    // const { sessionId, url } = await response.json();
    // return { success: true, sessionId, redirectUrl: url };
    
    // For demo purposes, we'll simulate a successful checkout
    // In a real app, this would redirect to Stripe Checkout
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create subscription record
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      });
    
    if (subscriptionError) {
      throw new Error('Failed to create subscription');
    }
    
    // Create payment history record
    await supabase
      .from('payment_history')
      .insert({
        user_id: userId,
        amount: planData.price,
        status: 'succeeded',
        description: `Subscription - ${planData.name}`,
        payment_method: 'Credit Card'
      });
    
    return { success: true, redirectUrl: '/subscription/success' };
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return { success: false, error: error.message || 'Failed to create checkout session' };
  }
}; 