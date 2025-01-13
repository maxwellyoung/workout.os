import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { v4 as uuidv4 } from "uuid";
import { checkWorkoutGenerationLimit } from "@/lib/subscription";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

interface Exercise {
  id?: string;
  name: string;
  sets: number;
  reps: number;
  completed?: boolean;
  notes?: string;
  targetMuscles?: string[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user has reached their generation limit
    const canGenerate = await checkWorkoutGenerationLimit(userId);
    if (!canGenerate) {
      return NextResponse.json(
        {
          error:
            "You have reached your workout generation limit for this month. Upgrade to Pro for unlimited generations.",
          code: "GENERATION_LIMIT_REACHED",
        },
        { status: 403 }
      );
    }

    // Get user context
    const { data: preferences, error: preferencesError } = await supabaseAdmin
      .from("user_fitness_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (preferencesError && preferencesError.code !== "PGRST116") {
      console.error("Error fetching preferences:", preferencesError);
      throw new Error("Failed to fetch user preferences");
    }

    const { data: recentStats, error: statsError } = await supabaseAdmin
      .from("workout_stats")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    if (statsError) {
      console.error("Error fetching workout history:", statsError);
      throw new Error("Failed to fetch workout history");
    }

    const prompt = `
Generate a concise workout routine based on:

User Profile:
- Goal: ${preferences?.primary_goal || "general fitness"}
- Level: ${preferences?.experience_level || "beginner"}
- Equipment: ${
      preferences?.available_equipment?.join(", ") || "basic gym equipment"
    }
- Days/week: ${preferences?.preferred_workout_days || 3}
- Duration: ${preferences?.workout_duration_minutes || 60} min
- Injuries: ${preferences?.injury_considerations?.join(", ") || "none"}
- Target: ${preferences?.target_muscle_groups?.join(", ") || "full body"}

Recent History:
${
  recentStats
    ?.slice(0, 3)
    .map(
      (stat) =>
        `- ${new Date(stat.created_at).toLocaleDateString()}: ${stat.raw_input}`
    )
    .join("\n") || "No recent history"
}

Focus on:
1. Progressive overload
2. Proper form
3. Rest periods
4. Exercise variety
5. Injury prevention

Return a JSON workout plan with:
{
  "name": "Brief routine name",
  "description": "2-3 sentence focus",
  "workouts": {
    "day1": [{
      "name": "Exercise",
      "sets": number,
      "reps": number,
      "notes": "Form cues",
      "targetMuscles": ["primary", "secondary"]
    }]
  },
  "analysis": {
    "muscleGroupsCovered": {"muscle": frequency},
    "weeklyVolume": {"muscle": total_sets},
    "restPeriods": ["guidelines"],
    "notes": ["key points"]
  }
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a precise fitness coach that creates efficient, focused workout routines.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1000,
    });

    if (!response.choices[0]?.message?.content) {
      throw new Error("Invalid response from OpenAI");
    }

    const content = response.choices[0].message.content;
    let workout;

    try {
      workout = JSON.parse(content);
    } catch {
      console.error("Failed to parse OpenAI response:", content);
      throw new Error("Invalid JSON response from OpenAI");
    }

    if (!workout.workouts || typeof workout.workouts !== "object") {
      throw new Error("Invalid workout structure in OpenAI response");
    }

    // Add unique IDs to exercises if they don't have them
    Object.keys(workout.workouts).forEach((day) => {
      if (!Array.isArray(workout.workouts[day])) {
        throw new Error(`Invalid exercises array for ${day}`);
      }

      workout.workouts[day] = workout.workouts[day].map(
        (exercise: Exercise) => ({
          ...exercise,
          id: exercise.id || uuidv4(),
          completed: false,
        })
      );
    });

    return NextResponse.json(workout);
  } catch (error) {
    console.error("Error generating workout:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate workout";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
