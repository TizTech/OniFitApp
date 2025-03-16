# 🏋️‍♂️ OniFit - AI-Powered Fitness Platform

![OniFit Banner](https://via.placeholder.com/1200x300/0a0a0a/00ff00?text=OniFit+AI+Fitness)

## 📋 Project Overview

OniFit is a cutting-edge, AI-driven fitness platform that delivers personalized meal plans, workout routines, and comprehensive progress tracking. Drawing inspiration from modern fitness applications like [Fit Senpai](https://www.fitsenpai.com/), our platform features:

- **Sleek Design**: Green and black health-oriented theme
- **Engaging UX**: Parallax scrolling and smooth transitions
- **AI-Powered Personalization**: Custom fitness and nutrition plans

### User Journey

```mermaid
graph LR
    A[Landing Page] --> B[Subscription & Signup]
    B --> C[Main Dashboard]
    C --> D[Account Management]
```

1. **Landing Page** – Captivating design with AI-driven fitness pitch
2. **Subscription & Signup** – 7-day free trial via Stripe integration
3. **Main Dashboard** – Personalized meal plans, fitness routines, and AI customization
4. **Account Page** – Subscription and profile management

---

## 🚀 Core Features

### Landing Page
- ✨ **Parallax Scrolling** for an immersive experience
- 🎨 **Green & Black Color Scheme** for a health-focused aesthetic
- 📣 **Hero Section** with AI-generated fitness benefits
- 👥 **Testimonials** to build user trust
- 🔘 **Signup Button** for free trial access
- 📞 **Contact Button** linking to `info@tizzle.org`

### Subscription System
- 💳 **Stripe Integration** for seamless payment processing
- 🔐 **Supabase Authentication** for secure user management
- 🆓 **7-Day Free Trial** followed by premium subscription

### Main Dashboard
- 📱 **Single-Page Design** with smooth scrolling
- 🍽️ **AI-Powered Meal Plans**
  * Personalized based on dietary preferences
  * Customized to user's nutritional goals
- 💪 **AI-Powered Fitness Plans**
  * Tailored workout routines
  * Adaptive difficulty progression
- 📊 **Progress Tracking**
  * Workout and meal logging
  * Visual progress charts
- 🤖 **DeepSeek AI Integration**
  * Custom plan generation
  * Intelligent fitness insights

### Backend Infrastructure
- 🗄️ **Supabase Database** for user data management
- 📋 **Data Structure**:
  * `contact_submissions` - User inquiries
  * `profiles` - User authentication data
  * `user_meal_plans` - Personalized nutrition
  * `user_fitness_plans` - Custom workouts
  * `user_progress` - Fitness journey tracking

---

## 🎨 Design Philosophy

| Element | Specification |
|---------|---------------|
| Typography | Modern sans-serif fonts for readability |
| Animations | Subtle transitions for enhanced UX |
| Responsiveness | Seamless experience across all devices |
| UI Approach | Minimalist design with focused content |

---

## 💻 Technology Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **AI Engine**: DeepSeek AI API
- **Payment Processing**: Stripe API

---

## 🔄 User Flow

1. **Discovery** → User lands on engaging homepage
2. **Conversion** → Signs up for free trial with Stripe
3. **Onboarding** → Creates profile and sets fitness goals
4. **Engagement** → Receives personalized AI fitness and meal plans
5. **Retention** → Tracks progress and updates preferences

---

*This document serves as the blueprint for the OniFit platform development. Our mission is to deliver an engaging, AI-driven fitness experience with intuitive design and seamless functionality.*

**Project by Tizzle Studios** | *Building the future of fitness technology* | 🚀
