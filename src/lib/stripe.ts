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
    
    console.log('Creating checkout session for user:', userId);
    
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
    
    if (planError) {
      console.error('Error fetching plan:', planError);
      throw new Error(`Failed to retrieve plan details: ${planError.message}`);
    }
    
    if (!planData) {
      throw new Error('Plan not found');
    }
    
    console.log('Plan data:', planData);
    
    // Check if user already has an active subscription
    const { data: existingSubscription, error: subscriptionCheckError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['active', 'trialing'])
      .maybeSingle();
    
    if (subscriptionCheckError) {
      console.error('Error checking existing subscription:', subscriptionCheckError);
    }
    
    if (existingSubscription) {
      console.log('User already has an active subscription:', existingSubscription);
      return { 
        success: false, 
        error: 'You already have an active subscription. Please manage it from your account page.' 
      };
    }
    
    // For development/demo purposes, we'll simulate a Stripe checkout session
    // In a real app, you would call your backend API to create a Stripe checkout session
    
    // If this is a free trial, handle it directly
    if (planData.trial_days > 0) {
      console.log('Processing free trial for plan:', planData.name);
      
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
        console.error('Error creating subscription:', subscriptionError);
        throw new Error(`Failed to create subscription: ${subscriptionError.message}`);
      }
      
      // Create payment history record for free trial
      const { error: paymentError } = await supabase
        .from('payment_history')
        .insert({
          user_id: userId,
          amount: 0, // Free trial
          status: 'succeeded',
          description: `Free trial - ${planData.name}`,
          payment_method: 'Free Trial'
        });
      
      if (paymentError) {
        console.error('Error creating payment history:', paymentError);
        // Non-blocking error, we can continue
      }
      
      console.log('Free trial subscription created successfully');
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
    console.log('Processing paid subscription for plan:', planData.name);
    
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
      console.error('Error creating subscription:', subscriptionError);
      throw new Error(`Failed to create subscription: ${subscriptionError.message}`);
    }
    
    // Create payment history record
    const { error: paymentError } = await supabase
      .from('payment_history')
      .insert({
        user_id: userId,
        amount: planData.price,
        status: 'succeeded',
        description: `Subscription - ${planData.name}`,
        payment_method: 'Credit Card'
      });
    
    if (paymentError) {
      console.error('Error creating payment history:', paymentError);
      // Non-blocking error, we can continue
    }
    
    console.log('Paid subscription created successfully');
    return { success: true, redirectUrl: '/subscription/success' };
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to create checkout session',
      details: error.stack
    };
  }
}; 