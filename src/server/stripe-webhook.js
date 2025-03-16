// This file would be used in a server environment (Node.js)
// It's included here for reference on how to handle Stripe webhooks

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  
  let event;
  
  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event based on its type
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      
      // Retrieve the subscription details
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      
      // Get the customer from the session
      const customer = await stripe.customers.retrieve(session.customer);
      
      // Get the user ID from the customer metadata
      const userId = customer.metadata.user_id;
      
      // Get the plan ID from the subscription metadata
      const planId = subscription.metadata.plan_id;
      
      // Create a new subscription record in Supabase
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        });
      
      if (error) {
        console.error('Error creating subscription record:', error);
      }
      
      break;
    }
    
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object;
      
      // Only handle subscription invoices
      if (invoice.subscription) {
        // Create a payment history record
        const { error } = await supabase
          .from('payment_history')
          .insert({
            user_id: invoice.customer_email, // This would need to be mapped to your user ID
            subscription_id: invoice.subscription,
            stripe_payment_intent_id: invoice.payment_intent,
            amount: invoice.amount_paid / 100, // Convert from cents to dollars
            currency: invoice.currency,
            status: 'succeeded',
            payment_method: invoice.payment_method_details?.type || null,
            receipt_url: invoice.hosted_invoice_url || null,
          });
        
        if (error) {
          console.error('Error creating payment history record:', error);
        }
      }
      
      break;
    }
    
    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      
      // Update the subscription record in Supabase
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
          canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
        })
        .eq('stripe_subscription_id', subscription.id);
      
      if (error) {
        console.error('Error updating subscription record:', error);
      }
      
      break;
    }
    
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      
      // Update the subscription record in Supabase
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          canceled_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id);
      
      if (error) {
        console.error('Error updating subscription record:', error);
      }
      
      break;
    }
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  
  // Return a 200 response to acknowledge receipt of the event
  return res.status(200).json({ received: true });
} 