import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Mock data for demonstration
const mealPlans = [
  {
    id: 1,
    title: 'Breakfast',
    description: 'Protein-packed breakfast to start your day',
    items: [
      { name: 'Greek Yogurt with Berries', calories: 240, protein: 15, carbs: 30, fat: 5 },
      { name: 'Whole Grain Toast', calories: 120, protein: 4, carbs: 20, fat: 2 },
      { name: 'Scrambled Eggs', calories: 180, protein: 12, carbs: 2, fat: 12 },
    ],
  },
  {
    id: 2,
    title: 'Lunch',
    description: 'Balanced meal to keep you energized',
    items: [
      { name: 'Grilled Chicken Salad', calories: 320, protein: 28, carbs: 15, fat: 14 },
      { name: 'Quinoa', calories: 120, protein: 4, carbs: 21, fat: 2 },
      { name: 'Avocado', calories: 160, protein: 2, carbs: 8, fat: 15 },
    ],
  },
  {
    id: 3,
    title: 'Dinner',
    description: 'Nutrient-rich evening meal',
    items: [
      { name: 'Baked Salmon', calories: 280, protein: 30, carbs: 0, fat: 16 },
      { name: 'Steamed Vegetables', calories: 80, protein: 2, carbs: 15, fat: 1 },
      { name: 'Sweet Potato', calories: 150, protein: 2, carbs: 35, fat: 0 },
    ],
  },
];

const workoutPlans = [
  {
    id: 1,
    title: 'Upper Body Strength',
    description: 'Focus on chest, shoulders, and arms',
    exercises: [
      { name: 'Push-ups', sets: 3, reps: '12-15', rest: '60 sec' },
      { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', rest: '90 sec' },
      { name: 'Bicep Curls', sets: 3, reps: '12 each arm', rest: '60 sec' },
      { name: 'Tricep Dips', sets: 3, reps: '12-15', rest: '60 sec' },
      { name: 'Chest Flyes', sets: 3, reps: '10-12', rest: '90 sec' },
    ],
  },
  {
    id: 2,
    title: 'Lower Body Power',
    description: 'Build strength in legs and core',
    exercises: [
      { name: 'Squats', sets: 4, reps: '12-15', rest: '90 sec' },
      { name: 'Lunges', sets: 3, reps: '10 each leg', rest: '60 sec' },
      { name: 'Deadlifts', sets: 3, reps: '10-12', rest: '120 sec' },
      { name: 'Calf Raises', sets: 3, reps: '15-20', rest: '60 sec' },
      { name: 'Plank', sets: 3, reps: '30-60 sec', rest: '60 sec' },
    ],
  },
  {
    id: 3,
    title: 'Cardio Blast',
    description: 'Improve endurance and burn calories',
    exercises: [
      { name: 'Jumping Jacks', sets: 3, reps: '30 sec', rest: '15 sec' },
      { name: 'Mountain Climbers', sets: 3, reps: '30 sec', rest: '15 sec' },
      { name: 'Burpees', sets: 3, reps: '10-12', rest: '30 sec' },
      { name: 'High Knees', sets: 3, reps: '30 sec', rest: '15 sec' },
      { name: 'Jump Rope', sets: 1, reps: '5 min', rest: 'N/A' },
    ],
  },
];

const progressData = {
  weight: [
    { date: 'Jan 1', value: 185 },
    { date: 'Jan 8', value: 183 },
    { date: 'Jan 15', value: 181 },
    { date: 'Jan 22', value: 180 },
    { date: 'Jan 29', value: 178 },
    { date: 'Feb 5', value: 177 },
  ],
  workouts: [
    { date: 'Week 1', value: 3 },
    { date: 'Week 2', value: 4 },
    { date: 'Week 3', value: 3 },
    { date: 'Week 4', value: 5 },
    { date: 'Week 5', value: 4 },
    { date: 'Week 6', value: 5 },
  ],
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('meal-plans');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndSubscription = async () => {
      try {
        // Check if user is logged in
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          // Not logged in, redirect to login
          navigate('/login');
          return;
        }
        
        setIsAuthenticated(true);
        
        // Check if user has an active subscription
        const userId = sessionData.session.user.id;
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId)
          .in('status', ['active', 'trialing'])
          .single();
        
        if (subscriptionError || !subscriptionData) {
          // No active subscription, redirect to subscription page
          navigate('/subscription');
          return;
        }
        
        setHasSubscription(true);
      } catch (error) {
        console.error('Error checking auth and subscription:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthAndSubscription();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-secondary flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // This should not be visible as we redirect in the useEffect
    return null;
  }

  if (!hasSubscription) {
    // This should not be visible as we redirect in the useEffect
    return null;
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 mb-8 md:mb-0">
            <div className="bg-secondary-light rounded-lg p-4 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Dashboard</h2>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('meal-plans')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'meal-plans'
                      ? 'bg-primary text-secondary font-medium'
                      : 'text-gray-300 hover:bg-secondary-dark'
                  }`}
                >
                  Meal Plans
                </button>
                <button
                  onClick={() => setActiveTab('workout-plans')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'workout-plans'
                      ? 'bg-primary text-secondary font-medium'
                      : 'text-gray-300 hover:bg-secondary-dark'
                  }`}
                >
                  Workout Plans
                </button>
                <button
                  onClick={() => setActiveTab('progress')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'progress'
                      ? 'bg-primary text-secondary font-medium'
                      : 'text-gray-300 hover:bg-secondary-dark'
                  }`}
                >
                  Progress Tracking
                </button>
                <button
                  onClick={() => setActiveTab('ai-recommendations')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'ai-recommendations'
                      ? 'bg-primary text-secondary font-medium'
                      : 'text-gray-300 hover:bg-secondary-dark'
                  }`}
                >
                  AI Recommendations
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:ml-8 flex-1">
            {/* Meal Plans Tab */}
            {activeTab === 'meal-plans' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold text-white">Your Meal Plan</h1>
                  <button className="btn btn-primary">Customize Plan</button>
                </div>

                <p className="text-gray-300 mb-8">
                  Your personalized meal plan based on your dietary preferences and fitness goals.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {mealPlans.map((meal) => (
                    <div
                      key={meal.id}
                      className="bg-secondary-light rounded-lg overflow-hidden border border-gray-800 hover:border-primary/30 transition-colors"
                    >
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-2">{meal.title}</h3>
                        <p className="text-gray-400 mb-4">{meal.description}</p>
                        <div className="space-y-3">
                          {meal.items.map((item, index) => (
                            <div key={index} className="border-t border-gray-800 pt-3">
                              <div className="flex justify-between">
                                <span className="text-white">{item.name}</span>
                                <span className="text-gray-400">{item.calories} cal</span>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>P: {item.protein}g</span>
                                <span>C: {item.carbs}g</span>
                                <span>F: {item.fat}g</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-secondary-light rounded-lg p-6 border border-gray-800">
                  <h3 className="text-xl font-semibold text-white mb-4">Daily Nutrition Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-secondary p-4 rounded-lg">
                      <div className="text-gray-400 text-sm">Calories</div>
                      <div className="text-2xl font-bold text-white">1,850</div>
                    </div>
                    <div className="bg-secondary p-4 rounded-lg">
                      <div className="text-gray-400 text-sm">Protein</div>
                      <div className="text-2xl font-bold text-white">120g</div>
                    </div>
                    <div className="bg-secondary p-4 rounded-lg">
                      <div className="text-gray-400 text-sm">Carbs</div>
                      <div className="text-2xl font-bold text-white">180g</div>
                    </div>
                    <div className="bg-secondary p-4 rounded-lg">
                      <div className="text-gray-400 text-sm">Fat</div>
                      <div className="text-2xl font-bold text-white">65g</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Workout Plans Tab */}
            {activeTab === 'workout-plans' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold text-white">Your Workout Plan</h1>
                  <button className="btn btn-primary">Customize Plan</button>
                </div>

                <p className="text-gray-300 mb-8">
                  Your personalized workout plan designed to help you reach your fitness goals.
                </p>

                <div className="space-y-6">
                  {workoutPlans.map((workout) => (
                    <div
                      key={workout.id}
                      className="bg-secondary-light rounded-lg overflow-hidden border border-gray-800"
                    >
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-2">{workout.title}</h3>
                        <p className="text-gray-400 mb-4">{workout.description}</p>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="border-b border-gray-800">
                                <th className="pb-2 text-gray-400">Exercise</th>
                                <th className="pb-2 text-gray-400">Sets</th>
                                <th className="pb-2 text-gray-400">Reps</th>
                                <th className="pb-2 text-gray-400">Rest</th>
                              </tr>
                            </thead>
                            <tbody>
                              {workout.exercises.map((exercise, index) => (
                                <tr key={index} className="border-b border-gray-800">
                                  <td className="py-3 text-white">{exercise.name}</td>
                                  <td className="py-3 text-white">{exercise.sets}</td>
                                  <td className="py-3 text-white">{exercise.reps}</td>
                                  <td className="py-3 text-white">{exercise.rest}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <button className="btn btn-secondary">Log Workout</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Progress Tracking Tab */}
            {activeTab === 'progress' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold text-white">Progress Tracking</h1>
                  <button className="btn btn-primary">Log New Data</button>
                </div>

                <p className="text-gray-300 mb-8">
                  Track your fitness journey and see your improvements over time.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Weight Progress Chart */}
                  <div className="bg-secondary-light rounded-lg p-6 border border-gray-800">
                    <h3 className="text-xl font-semibold text-white mb-4">Weight Progress</h3>
                    <div className="h-64 flex items-end justify-between">
                      {progressData.weight.map((item, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div
                            className="w-8 bg-primary rounded-t"
                            style={{
                              height: `${((item.value - 175) / 15) * 100}%`,
                              minHeight: '10px',
                            }}
                          ></div>
                          <div className="text-xs text-gray-400 mt-2">{item.date}</div>
                          <div className="text-xs text-white">{item.value} lbs</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Workout Frequency Chart */}
                  <div className="bg-secondary-light rounded-lg p-6 border border-gray-800">
                    <h3 className="text-xl font-semibold text-white mb-4">Workout Frequency</h3>
                    <div className="h-64 flex items-end justify-between">
                      {progressData.workouts.map((item, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div
                            className="w-8 bg-primary rounded-t"
                            style={{
                              height: `${(item.value / 7) * 100}%`,
                              minHeight: '10px',
                            }}
                          ></div>
                          <div className="text-xs text-gray-400 mt-2">{item.date}</div>
                          <div className="text-xs text-white">{item.value} workouts</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-secondary-light rounded-lg p-6 border border-gray-800">
                  <h3 className="text-xl font-semibold text-white mb-4">Your Achievements</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-secondary p-4 rounded-lg text-center">
                      <div className="text-3xl text-primary mb-2">7</div>
                      <div className="text-gray-300">lbs Lost</div>
                    </div>
                    <div className="bg-secondary p-4 rounded-lg text-center">
                      <div className="text-3xl text-primary mb-2">24</div>
                      <div className="text-gray-300">Workouts</div>
                    </div>
                    <div className="bg-secondary p-4 rounded-lg text-center">
                      <div className="text-3xl text-primary mb-2">42</div>
                      <div className="text-gray-300">Days Streak</div>
                    </div>
                    <div className="bg-secondary p-4 rounded-lg text-center">
                      <div className="text-3xl text-primary mb-2">3</div>
                      <div className="text-gray-300">Goals Reached</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* AI Recommendations Tab */}
            {activeTab === 'ai-recommendations' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold text-white">AI Recommendations</h1>
                  <button className="btn btn-primary">Refresh</button>
                </div>

                <p className="text-gray-300 mb-8">
                  Personalized recommendations based on your progress and goals.
                </p>

                <div className="bg-secondary-light rounded-lg p-6 border border-gray-800 mb-6">
                  <div className="flex items-start">
                    <div className="bg-primary/20 p-3 rounded-full mr-4">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Nutrition Insight</h3>
                      <p className="text-gray-300">
                        Based on your recent progress, increasing your protein intake by 10-15g per day could help accelerate muscle recovery and growth. Consider adding a protein-rich snack between lunch and dinner.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary-light rounded-lg p-6 border border-gray-800 mb-6">
                  <div className="flex items-start">
                    <div className="bg-primary/20 p-3 rounded-full mr-4">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Workout Suggestion</h3>
                      <p className="text-gray-300">
                        You've been consistent with your upper body workouts. To maintain balance, we recommend adding an extra lower body session this week. This will help prevent muscle imbalances and improve overall strength.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary-light rounded-lg p-6 border border-gray-800">
                  <div className="flex items-start">
                    <div className="bg-primary/20 p-3 rounded-full mr-4">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Recovery Tip</h3>
                      <p className="text-gray-300">
                        Your workout intensity has increased over the past two weeks. To optimize recovery, ensure you're getting 7-8 hours of sleep and consider adding a 10-minute stretching routine before bed to reduce muscle soreness.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 