export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          height: number | null
          weight: number | null
          fitness_level: 'beginner' | 'intermediate' | 'advanced' | null
          fitness_goals: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          height?: number | null
          weight?: number | null
          fitness_level?: 'beginner' | 'intermediate' | 'advanced' | null
          fitness_goals?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          height?: number | null
          weight?: number | null
          fitness_level?: 'beginner' | 'intermediate' | 'advanced' | null
          fitness_goals?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          interval: 'monthly' | 'yearly'
          features: string[] | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          interval: 'monthly' | 'yearly'
          features?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          interval?: 'monthly' | 'yearly'
          features?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          stripe_subscription_id: string | null
          status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid'
          current_period_start: string | null
          current_period_end: string | null
          cancel_at: string | null
          canceled_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          stripe_subscription_id?: string | null
          status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid'
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          stripe_subscription_id?: string | null
          status?: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid'
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payment_history: {
        Row: {
          id: string
          user_id: string
          subscription_id: string | null
          stripe_payment_intent_id: string | null
          amount: number
          currency: string
          status: 'succeeded' | 'processing' | 'failed'
          payment_method: string | null
          receipt_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subscription_id?: string | null
          stripe_payment_intent_id?: string | null
          amount: number
          currency?: string
          status: 'succeeded' | 'processing' | 'failed'
          payment_method?: string | null
          receipt_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subscription_id?: string | null
          stripe_payment_intent_id?: string | null
          amount?: number
          currency?: string
          status?: 'succeeded' | 'processing' | 'failed'
          payment_method?: string | null
          receipt_url?: string | null
          created_at?: string
        }
      }
      workout_plans: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          difficulty: 'beginner' | 'intermediate' | 'advanced' | null
          duration_weeks: number | null
          is_ai_generated: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | null
          duration_weeks?: number | null
          is_ai_generated?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | null
          duration_weeks?: number | null
          is_ai_generated?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      workouts: {
        Row: {
          id: string
          plan_id: string | null
          user_id: string
          name: string
          description: string | null
          duration_minutes: number | null
          calories_burned: number | null
          completed: boolean
          scheduled_date: string | null
          completed_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          plan_id?: string | null
          user_id: string
          name: string
          description?: string | null
          duration_minutes?: number | null
          calories_burned?: number | null
          completed?: boolean
          scheduled_date?: string | null
          completed_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          plan_id?: string | null
          user_id?: string
          name?: string
          description?: string | null
          duration_minutes?: number | null
          calories_burned?: number | null
          completed?: boolean
          scheduled_date?: string | null
          completed_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          name: string
          description: string | null
          muscle_group: string | null
          equipment: string[] | null
          difficulty: 'beginner' | 'intermediate' | 'advanced' | null
          instructions: string[] | null
          video_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          muscle_group?: string | null
          equipment?: string[] | null
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | null
          instructions?: string[] | null
          video_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          muscle_group?: string | null
          equipment?: string[] | null
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | null
          instructions?: string[] | null
          video_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workout_exercises: {
        Row: {
          id: string
          workout_id: string
          exercise_id: string
          sets: number | null
          reps: number | null
          weight: number | null
          duration_seconds: number | null
          rest_seconds: number | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workout_id: string
          exercise_id: string
          sets?: number | null
          reps?: number | null
          weight?: number | null
          duration_seconds?: number | null
          rest_seconds?: number | null
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workout_id?: string
          exercise_id?: string
          sets?: number | null
          reps?: number | null
          weight?: number | null
          duration_seconds?: number | null
          rest_seconds?: number | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 