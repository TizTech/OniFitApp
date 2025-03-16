// This file would be used in a server environment (Node.js)
// It's included here for reference on how to implement a server for Stripe integration

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { handleStripeWebhook } from './stripe-webhook.js';

// Load environment variables
dotenv.config();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());

// Use raw body for Stripe webhook
app.use('/webhook', express.raw({ type: 'application/json' }));

// Use JSON for other routes
app.use(express.json());

// Routes
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { planId, userId, userEmail, customerName } = req.body;
    
    if (!planId || !userId || !userEmail) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Get the plan details
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();
    
    if (planError || !plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    
    // Check if user already has an active subscription
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['active', 'trialing'])
      .maybeSingle();
    
    if (existingSubscription) {
      return res.status(400).json({ error: 'User already has an active subscription' });
    }
    
    // Create or retrieve customer
    let customer;
    const { data: existingCustomers } = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });
    
    if (existingCustomers && existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: userEmail,
        name: customerName,
        metadata: {
          user_id: userId,
        },
      });
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: Math.round(plan.price * 100), // Convert to cents
            recurring: {
              interval: plan.interval === 'yearly' ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: plan.trial_days > 0 ? plan.trial_days : undefined,
        metadata: {
          plan_id: planId,
        },
      },
      success_url: `${process.env.CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/subscription`,
    });
    
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook
app.post('/webhook', async (req, res) => {
  await handleStripeWebhook(req, res);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app; 