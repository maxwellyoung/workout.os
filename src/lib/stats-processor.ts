import { supabase } from "./supabase";

interface ProcessedStats {
  type: "intention" | "completion";
  exercise?: string;
  weight?: number;
  sets?: number;
  reps?: number;
  intensity?: "low" | "medium" | "high";
  mood?: string;
  notes?: string;
}

export async function processStatsUpdate(
  userId: string,
  input: string
): Promise<ProcessedStats> {
  try {
    const response = await fetch("/api/process-stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, input }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to process stats");
    }

    if (!data.type) {
      throw new Error("Invalid response from stats processor");
    }

    return data;
  } catch (error) {
    console.error("Error processing stats:", error);
    throw error;
  }
}

// Function to get user's workout history and preferences
export async function getUserWorkoutContext(userId: string) {
  try {
    const [preferencesResponse, statsResponse] = await Promise.all([
      supabase
        .from("user_fitness_preferences")
        .select("*")
        .eq("user_id", userId)
        .single(),
      supabase
        .from("workout_stats")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    if (preferencesResponse.error) {
      console.warn("No preferences found, using defaults");
    }

    if (statsResponse.error) {
      console.warn("No workout history found");
    }

    return {
      preferences: preferencesResponse.data,
      recentStats: statsResponse.data,
    };
  } catch (error) {
    console.error("Error fetching user context:", error);
    return {
      preferences: null,
      recentStats: [],
    };
  }
}

// Function to update user preferences
export async function updateUserPreferences(
  userId: string,
  preferences: Partial<{
    primary_goal: string;
    experience_level: string;
    available_equipment: string[];
    preferred_workout_days: number;
    workout_duration_minutes: number;
    injury_considerations: string[];
    target_muscle_groups: string[];
  }>
) {
  try {
    const { error } = await supabase
      .from("user_fitness_preferences")
      .upsert({
        user_id: userId,
        ...preferences,
      })
      .eq("user_id", userId);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating preferences:", error);
    throw error;
  }
}
