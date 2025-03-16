-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  interval TEXT NOT NULL CHECK (interval IN ('monthly', 'yearly')),
  features TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  trial_days INTEGER DEFAULT 0,
  stripe_price_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  stripe_subscription_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  cancel_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_history table
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id TEXT,
  stripe_payment_intent_id TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL,
  description TEXT,
  payment_method TEXT,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample subscription plans
INSERT INTO subscription_plans (name, description, price, interval, features, is_active, trial_days)
VALUES 
  ('Basic', 'Perfect for beginners', 9.99, 'monthly', ARRAY['Personalized workout plans', 'Basic progress tracking', 'Limited meal suggestions'], TRUE, 14),
  ('Pro', 'For serious fitness enthusiasts', 19.99, 'monthly', ARRAY['Advanced workout plans', 'Detailed progress analytics', 'Full meal planning', 'Priority support'], TRUE, 7),
  ('Elite', 'Maximum results', 29.99, 'monthly', ARRAY['Custom AI workout generation', 'Advanced body metrics', 'Nutrition coaching', 'Personal trainer consultation', '24/7 premium support'], TRUE, 0);

-- Insert yearly plans with discount
INSERT INTO subscription_plans (name, description, price, interval, features, is_active, trial_days)
VALUES 
  ('Basic Yearly', 'Perfect for beginners', 99.99, 'yearly', ARRAY['Personalized workout plans', 'Basic progress tracking', 'Limited meal suggestions', 'Save over 15%'], TRUE, 14),
  ('Pro Yearly', 'For serious fitness enthusiasts', 199.99, 'yearly', ARRAY['Advanced workout plans', 'Detailed progress analytics', 'Full meal planning', 'Priority support', 'Save over 15%'], TRUE, 7),
  ('Elite Yearly', 'Maximum results', 299.99, 'yearly', ARRAY['Custom AI workout generation', 'Advanced body metrics', 'Nutrition coaching', 'Personal trainer consultation', '24/7 premium support', 'Save over 15%'], TRUE, 0);

-- Create RLS policies
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active subscription plans
CREATE POLICY "Anyone can read active subscription plans" 
  ON subscription_plans FOR SELECT 
  USING (is_active = TRUE);

-- Allow users to read their own subscriptions
CREATE POLICY "Users can read their own subscriptions" 
  ON subscriptions FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to create their own subscriptions
CREATE POLICY "Users can create their own subscriptions" 
  ON subscriptions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own subscriptions
CREATE POLICY "Users can update their own subscriptions" 
  ON subscriptions FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow users to read their own payment history
CREATE POLICY "Users can read their own payment history" 
  ON payment_history FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to create their own payment history
CREATE POLICY "Users can create their own payment history" 
  ON payment_history FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow service role to manage all tables
CREATE POLICY "Service role can manage subscription plans" 
  ON subscription_plans 
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage subscriptions" 
  ON subscriptions 
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage payment history" 
  ON payment_history 
  USING (auth.role() = 'service_role'); 