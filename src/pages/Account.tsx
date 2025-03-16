import { useState } from 'react';
import { motion } from 'framer-motion';

const Account = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: '••••••••',
    height: '5\'10"',
    weight: '180 lbs',
    fitnessGoal: 'Weight Loss',
    dietaryPreferences: 'No Restrictions',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profileData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData(formData);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 mb-8 md:mb-0">
            <div className="bg-secondary-light rounded-lg p-4 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Account</h2>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-primary text-secondary font-medium'
                      : 'text-gray-300 hover:bg-secondary-dark'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('subscription')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'subscription'
                      ? 'bg-primary text-secondary font-medium'
                      : 'text-gray-300 hover:bg-secondary-dark'
                  }`}
                >
                  Subscription
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'notifications'
                      ? 'bg-primary text-secondary font-medium'
                      : 'text-gray-300 hover:bg-secondary-dark'
                  }`}
                >
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'privacy'
                      ? 'bg-primary text-secondary font-medium'
                      : 'text-gray-300 hover:bg-secondary-dark'
                  }`}
                >
                  Privacy & Security
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:ml-8 flex-1">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold text-white">Your Profile</h1>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-primary"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="space-x-2">
                      <button
                        onClick={cancelEdit}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="btn btn-primary"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-secondary-light rounded-lg overflow-hidden">
                  {!isEditing ? (
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 mb-6 md:mb-0">
                          <div className="flex flex-col items-center">
                            <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                              <span className="text-4xl text-primary">
                                {profileData.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <h3 className="text-xl font-semibold text-white">{profileData.name}</h3>
                            <p className="text-gray-400">{profileData.email}</p>
                          </div>
                        </div>
                        <div className="md:w-2/3 md:pl-8 border-t md:border-t-0 md:border-l border-gray-700 pt-6 md:pt-0 md:pl-8">
                          <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
                          <div className="space-y-4">
                            <div>
                              <p className="text-gray-400 text-sm">Height</p>
                              <p className="text-white">{profileData.height}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Weight</p>
                              <p className="text-white">{profileData.weight}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Fitness Goal</p>
                              <p className="text-white">{profileData.fitnessGoal}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Dietary Preferences</p>
                              <p className="text-white">{profileData.dietaryPreferences}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                          <label htmlFor="name" className="block text-gray-300 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md bg-secondary border border-gray-700 text-white focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-gray-300 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md bg-secondary border border-gray-700 text-white focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label htmlFor="password" className="block text-gray-300 mb-2">
                            Password
                          </label>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md bg-secondary border border-gray-700 text-white focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label htmlFor="height" className="block text-gray-300 mb-2">
                            Height
                          </label>
                          <input
                            type="text"
                            id="height"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md bg-secondary border border-gray-700 text-white focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label htmlFor="weight" className="block text-gray-300 mb-2">
                            Weight
                          </label>
                          <input
                            type="text"
                            id="weight"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md bg-secondary border border-gray-700 text-white focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label htmlFor="fitnessGoal" className="block text-gray-300 mb-2">
                            Fitness Goal
                          </label>
                          <select
                            id="fitnessGoal"
                            name="fitnessGoal"
                            value={formData.fitnessGoal}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md bg-secondary border border-gray-700 text-white focus:outline-none focus:border-primary"
                          >
                            <option value="Weight Loss">Weight Loss</option>
                            <option value="Muscle Gain">Muscle Gain</option>
                            <option value="Endurance">Endurance</option>
                            <option value="Overall Health">Overall Health</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="dietaryPreferences" className="block text-gray-300 mb-2">
                            Dietary Preferences
                          </label>
                          <select
                            id="dietaryPreferences"
                            name="dietaryPreferences"
                            value={formData.dietaryPreferences}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md bg-secondary border border-gray-700 text-white focus:outline-none focus:border-primary"
                          >
                            <option value="No Restrictions">No Restrictions</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Vegan">Vegan</option>
                            <option value="Keto">Keto</option>
                            <option value="Paleo">Paleo</option>
                          </select>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold text-white">Your Subscription</h1>
                  <button className="btn btn-primary">Manage Plan</button>
                </div>

                <div className="bg-secondary-light rounded-lg overflow-hidden p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Premium Plan</h3>
                      <p className="text-gray-400">$9.99/month</p>
                    </div>
                    <div className="ml-auto">
                      <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">Active</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-6 mt-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Plan Details</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Billing Cycle</span>
                        <span className="text-white">Monthly</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Next Billing Date</span>
                        <span className="text-white">April 15, 2023</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Payment Method</span>
                        <span className="text-white">Visa ending in 4242</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-6 mt-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Plan Features</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center text-gray-300">
                        <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Personalized Meal Plans
                      </li>
                      <li className="flex items-center text-gray-300">
                        <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Custom Workout Routines
                      </li>
                      <li className="flex items-center text-gray-300">
                        <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Progress Tracking
                      </li>
                      <li className="flex items-center text-gray-300">
                        <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        AI Recommendations
                      </li>
                    </ul>
                  </div>

                  <div className="border-t border-gray-700 pt-6 mt-6 flex justify-between">
                    <button className="text-gray-400 hover:text-white transition-colors">
                      Update Payment Method
                    </button>
                    <button className="text-red-400 hover:text-red-300 transition-colors">
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-white">Notification Settings</h1>
                  <p className="text-gray-400 mt-2">Manage how and when you receive notifications.</p>
                </div>

                <div className="bg-secondary-light rounded-lg overflow-hidden p-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                      <div>
                        <h3 className="text-lg font-semibold text-white">Workout Reminders</h3>
                        <p className="text-gray-400 text-sm">Receive reminders for your scheduled workouts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                      <div>
                        <h3 className="text-lg font-semibold text-white">Meal Plan Updates</h3>
                        <p className="text-gray-400 text-sm">Get notified when your meal plan is updated</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                      <div>
                        <h3 className="text-lg font-semibold text-white">Progress Milestones</h3>
                        <p className="text-gray-400 text-sm">Celebrate when you reach fitness milestones</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                      <div>
                        <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
                        <p className="text-gray-400 text-sm">Receive personalized AI fitness recommendations</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-white">Marketing Emails</h3>
                        <p className="text-gray-400 text-sm">Receive news and special offers</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Privacy & Security Tab */}
            {activeTab === 'privacy' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-white">Privacy & Security</h1>
                  <p className="text-gray-400 mt-2">Manage your account security and data privacy settings.</p>
                </div>

                <div className="bg-secondary-light rounded-lg overflow-hidden p-6 mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Security Settings</h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                      <div>
                        <h4 className="text-lg font-medium text-white">Two-Factor Authentication</h4>
                        <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                      </div>
                      <button className="btn btn-secondary">Enable</button>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                      <div>
                        <h4 className="text-lg font-medium text-white">Change Password</h4>
                        <p className="text-gray-400 text-sm">Update your password regularly for better security</p>
                      </div>
                      <button className="btn btn-secondary">Update</button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-medium text-white">Active Sessions</h4>
                        <p className="text-gray-400 text-sm">Manage devices where you're currently logged in</p>
                      </div>
                      <button className="btn btn-secondary">View</button>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary-light rounded-lg overflow-hidden p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Data Privacy</h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                      <div>
                        <h4 className="text-lg font-medium text-white">Data Sharing</h4>
                        <p className="text-gray-400 text-sm">Control how your data is used for personalization</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                      <div>
                        <h4 className="text-lg font-medium text-white">Download Your Data</h4>
                        <p className="text-gray-400 text-sm">Get a copy of all your personal data</p>
                      </div>
                      <button className="btn btn-secondary">Download</button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-medium text-white text-red-400">Delete Account</h4>
                        <p className="text-gray-400 text-sm">Permanently delete your account and all data</p>
                      </div>
                      <button className="btn bg-red-500 hover:bg-red-600 text-white">Delete</button>
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

export default Account; 