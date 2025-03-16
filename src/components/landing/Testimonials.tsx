import { motion } from 'framer-motion';
import { useState } from 'react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Fitness Enthusiast',
    image: 'https://via.placeholder.com/150',
    quote: 'OniFit completely transformed my approach to fitness. The AI-generated meal plans are delicious and perfectly aligned with my goals.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Marathon Runner',
    image: 'https://via.placeholder.com/150',
    quote: 'As someone who trains regularly, having personalized workout routines that adapt to my progress has been a game-changer.',
    rating: 5,
  },
  {
    name: 'Emma Rodriguez',
    role: 'Yoga Instructor',
    image: 'https://via.placeholder.com/150',
    quote: 'The intuitive interface and AI recommendations make OniFit stand out from other fitness apps I\'ve tried.',
    rating: 4,
  },
  {
    name: 'David Kim',
    role: 'Weight Loss Journey',
    image: 'https://via.placeholder.com/150',
    quote: 'I\'ve lost 30 pounds in 3 months following OniFit\'s personalized plans. The progress tracking keeps me motivated every day.',
    rating: 5,
  },
  {
    name: 'Lisa Thompson',
    role: 'Busy Professional',
    image: 'https://via.placeholder.com/150',
    quote: 'With my hectic schedule, OniFit makes it easy to stay on track with quick workouts and simple meal plans that fit my lifestyle.',
    rating: 4,
  },
  {
    name: 'James Wilson',
    role: 'Bodybuilding Enthusiast',
    image: 'https://via.placeholder.com/150',
    quote: 'The AI adjusts my workout intensity perfectly. I\'ve seen more muscle growth in 2 months than I did in a year on my own.',
    rating: 5,
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold mb-4">
          What Our <span className="text-primary">Users</span> Say
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Join thousands of satisfied users who have transformed their fitness journey with OniFit.
        </p>
      </motion.div>

      {/* Mobile Testimonial Carousel */}
      <div className="md:hidden">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-secondary p-6 rounded-lg border border-gray-800"
        >
          <div className="flex items-center mb-4">
            <img
              src={testimonials[activeIndex].image}
              alt={testimonials[activeIndex].name}
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div>
              <h3 className="font-semibold text-white">{testimonials[activeIndex].name}</h3>
              <p className="text-gray-400 text-sm">{testimonials[activeIndex].role}</p>
            </div>
          </div>
          <div className="mb-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < testimonials[activeIndex].rating ? "text-primary" : "text-gray-600"}>
                ★
              </span>
            ))}
          </div>
          <p className="text-gray-300 italic">"{testimonials[activeIndex].quote}"</p>

          <div className="flex justify-between mt-6">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-secondary-light hover:bg-primary/20 transition-colors"
            >
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-secondary-light hover:bg-primary/20 transition-colors"
            >
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>

        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full ${
                index === activeIndex ? 'bg-primary' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Testimonial Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-secondary p-6 rounded-lg hover:shadow-lg transition-all duration-300 hover:shadow-primary/20 border border-gray-800 hover:border-primary/30"
          >
            <div className="flex items-center mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="font-semibold text-white">{testimonial.name}</h3>
                <p className="text-gray-400 text-sm">{testimonial.role}</p>
              </div>
            </div>
            <div className="mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < testimonial.rating ? "text-primary" : "text-gray-600"}>
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-300 italic">"{testimonial.quote}"</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <p className="text-gray-300">
          Join <span className="text-primary font-semibold">5,000+</span> users who have transformed their fitness journey
        </p>
      </motion.div>
    </div>
  );
};

export default Testimonials; 