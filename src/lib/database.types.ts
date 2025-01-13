export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          fitness_goal:
            | "strength"
            | "endurance"
            | "weight-loss"
            | "muscle-gain";
          experience_level: "beginner" | "intermediate" | "advanced";
          workout_days: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          fitness_goal:
            | "strength"
            | "endurance"
            | "weight-loss"
            | "muscle-gain";
          experience_level: "beginner" | "intermediate" | "advanced";
          workout_days: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          fitness_goal?:
            | "strength"
            | "endurance"
            | "weight-loss"
            | "muscle-gain";
          experience_level?: "beginner" | "intermediate" | "advanced";
          workout_days?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      workout_routines: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          workouts: Json;
          analysis?: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description: string;
          workouts: Json;
          analysis?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          workouts?: Json;
          analysis?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      equipment: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          quantity: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
