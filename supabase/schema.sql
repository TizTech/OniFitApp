-- Enable the necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  height NUMERIC,
  weight NUMERIC,
  fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  fitness_goals TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  interval TEXT NOT NULL CHECK (interval IN ('monthly', 'yearly')),
  features TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment history table
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  stripe_payment_intent_id TEXT UNIQUE,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('succeeded', 'processing', 'failed')),
  payment_method TEXT,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout plans table
CREATE TABLE IF NOT EXISTS workout_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_weeks INTEGER,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES workout_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  calories_burned INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  scheduled_date DATE,
  completed_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  muscle_group TEXT,
  equipment TEXT[],
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  instructions TEXT[],
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout_exercises junction table
CREATE TABLE IF NOT EXISTS workout_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  sets INTEGER,
  reps INTEGER,
  weight NUMERIC,
  duration_seconds INTEGER,
  rest_seconds INTEGER,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workout_id, exercise_id, order_index)
);

-- Create RLS policies

-- User_profiles table policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Subscriptions table policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Payment history table policies
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment history"
  ON payment_history FOR SELECT
  USING (auth.uid() = user_id);

-- Subscription plans table policies
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active subscription plans"
  ON subscription_plans FOR SELECT
  USING (is_active = TRUE);

-- Workout plans table policies
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workout plans"
  ON workout_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout plans"
  ON workout_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout plans"
  ON workout_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout plans"
  ON workout_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Workouts table policies
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workouts"
  ON workouts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workouts"
  ON workouts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts"
  ON workouts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts"
  ON workouts FOR DELETE
  USING (auth.uid() = user_id);

-- Exercises table policies
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view exercises"
  ON exercises FOR SELECT
  TO authenticated
  USING (TRUE);

-- Workout exercises table policies
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workout exercises"
  ON workout_exercises FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM workouts
    WHERE workouts.id = workout_exercises.workout_id
    AND workouts.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own workout exercises"
  ON workout_exercises FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM workouts
    WHERE workouts.id = workout_exercises.workout_id
    AND workouts.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own workout exercises"
  ON workout_exercises FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM workouts
    WHERE workouts.id = workout_exercises.workout_id
    AND workouts.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own workout exercises"
  ON workout_exercises FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM workouts
    WHERE workouts.id = workout_exercises.workout_id
    AND workouts.user_id = auth.uid()
  ));

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, first_name, last_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample subscription plans
INSERT INTO subscription_plans (name, description, price, interval, features)
VALUES 
  ('Basic', 'Access to basic workout plans and tracking', 9.99, 'monthly', ARRAY['Basic workout plans', 'Progress tracking', 'Community access']),
  ('Pro', 'Access to advanced features and personalized plans', 19.99, 'monthly', ARRAY['All Basic features', 'Personalized AI workout plans', 'Nutrition tracking', 'Premium content']),
  ('Elite', 'Full access to all features and premium support', 29.99, 'monthly', ARRAY['All Pro features', 'One-on-one coaching', 'Advanced analytics', 'Priority support']),
  ('Basic Annual', 'Access to basic workout plans and tracking (annual billing)', 99.99, 'yearly', ARRAY['Basic workout plans', 'Progress tracking', 'Community access']),
  ('Pro Annual', 'Access to advanced features and personalized plans (annual billing)', 199.99, 'yearly', ARRAY['All Basic features', 'Personalized AI workout plans', 'Nutrition tracking', 'Premium content']),
  ('Elite Annual', 'Full access to all features and premium support (annual billing)', 299.99, 'yearly', ARRAY['All Pro features', 'One-on-one coaching', 'Advanced analytics', 'Priority support']);

-- Insert sample exercises
INSERT INTO exercises (name, description, muscle_group, equipment, difficulty, instructions)
VALUES
  ('Push-up', 'A classic bodyweight exercise for the upper body', 'chest', ARRAY['none'], 'beginner', ARRAY['Start in a plank position with hands shoulder-width apart', 'Lower your body until your chest nearly touches the floor', 'Push back up to the starting position']),
  ('Squat', 'A fundamental lower body exercise', 'legs', ARRAY['none'], 'beginner', ARRAY['Stand with feet shoulder-width apart', 'Bend your knees and lower your hips as if sitting in a chair', 'Return to standing position']),
  ('Plank', 'Core stabilizing exercise', 'core', ARRAY['none'], 'beginner', ARRAY['Start in a push-up position but with forearms on the ground', 'Keep your body in a straight line from head to heels', 'Hold the position']),
  ('Dumbbell Bench Press', 'Upper body strength exercise', 'chest', ARRAY['dumbbells', 'bench'], 'intermediate', ARRAY['Lie on a bench with a dumbbell in each hand', 'Press the weights upward until arms are extended', 'Lower the weights back to starting position']),
  ('Deadlift', 'Compound exercise for posterior chain', 'back', ARRAY['barbell'], 'advanced', ARRAY['Stand with feet hip-width apart, barbell over midfoot', 'Bend at hips and knees to grip the bar', 'Lift the bar by extending hips and knees', 'Return the bar to the floor with control']); 