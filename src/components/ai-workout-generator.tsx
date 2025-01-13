"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Workout {
  [day: string]: Array<{
    id: string;
    name: string;
    sets: number;
    reps: number;
    completed: boolean;
  }>;
}

interface AIWorkoutGeneratorProps {
  onWorkoutGenerated: (workouts: Workout) => void;
  saveAsRoutine?: boolean;
}

interface WorkoutAnalysis {
  muscleGroupsCovered: Record<string, string>;
  weeklyVolume: Record<string, string>;
  restPeriods: string[];
  notes: string[];
}

interface UserPreferences {
  user_id: string;
  fitness_goal: string;
  experience_level: string;
  workout_days: string[];
}

interface PreviewWorkout {
  workout: Workout;
  analysis?: WorkoutAnalysis;
}

export function AIWorkoutGenerator({
  onWorkoutGenerated,
  saveAsRoutine = false,
}: AIWorkoutGeneratorProps) {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewWorkout, setPreviewWorkout] = useState<PreviewWorkout | null>(
    null
  );
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  async function handleGenerate() {
    try {
      if (!user?.id) {
        throw new Error("Please sign in to generate a workout");
      }

      setIsGenerating(true);

      // Fetch user preferences
      const { data: prefs, error: preferencesError } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (preferencesError) {
        if (preferencesError.code === "PGRST116") {
          throw new Error(
            "Please complete onboarding first to set your preferences"
          );
        }
        console.error("Error fetching preferences:", preferencesError);
        throw new Error("Failed to fetch user preferences");
      }

      if (!prefs) {
        throw new Error(
          "No preferences found. Please complete onboarding first"
        );
      }

      setPreferences(prefs);

      // Fetch user equipment
      const { data: equipment, error: equipmentError } = await supabase
        .from("equipment")
        .select("name, quantity")
        .eq("user_id", user.id);

      if (equipmentError) {
        console.error("Error fetching equipment:", equipmentError);
        throw new Error("Failed to fetch user equipment");
      }

      // Generate workout
      const response = await fetch("/api/generate-workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferences: {
            ...prefs,
            equipment: equipment || [],
          },
          includeAnalysis: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response from API:", errorData);
        throw new Error(errorData.error || "Failed to generate workout");
      }

      const workout = await response.json();

      if (saveAsRoutine) {
        // Validate workout data
        if (!workout.workout) {
          throw new Error("Invalid workout data received from API");
        }

        // Show preview instead of saving immediately
        setPreviewWorkout(workout);
      } else {
        onWorkoutGenerated(workout.workout);
      }
    } catch (error) {
      console.error("Error generating workout:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(
          "An unexpected error occurred while generating the workout"
        );
      }
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSaveRoutine() {
    if (!previewWorkout || !user?.id) return;

    try {
      const { error: saveError } = await supabase
        .from("workout_routines")
        .insert({
          user_id: user.id,
          name: `AI Workout - ${new Date().toLocaleDateString()}`,
          description: `Generated based on ${preferences?.fitness_goal} goal, ${preferences?.experience_level} level`,
          workouts: previewWorkout.workout,
          analysis: previewWorkout.analysis,
        })
        .select()
        .single();

      if (saveError) {
        console.error("Error saving routine:", saveError);
        throw new Error(`Failed to save workout routine: ${saveError.message}`);
      }

      toast.success("Workout routine saved successfully!");
      setPreviewWorkout(null);
      onWorkoutGenerated({});
    } catch (error) {
      console.error("Error saving routine:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred while saving the routine");
      }
    }
  }

  return (
    <>
      <Button onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current" />
            Generating...
          </>
        ) : (
          "Generate AI Workout"
        )}
      </Button>

      <Dialog
        open={!!previewWorkout}
        onOpenChange={() => setPreviewWorkout(null)}
      >
        <DialogContent className="max-w-[95vw] sm:max-w-4xl mx-auto">
          <DialogHeader>
            <DialogTitle>Preview Generated Workout</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {previewWorkout &&
              Object.entries(previewWorkout.workout).map(([day, exercises]) => (
                <div key={day} className="border rounded-lg p-4">
                  <h3 className="font-semibold capitalize mb-2">{day}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {exercises.map((exercise, index) => (
                      <div key={index} className="p-2 bg-muted rounded">
                        <p className="font-medium">{exercise.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {exercise.sets} sets × {exercise.reps} reps
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            {previewWorkout?.analysis && (
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Analysis</h3>
                <div className="text-sm text-muted-foreground">
                  {/* Add analysis details here */}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setPreviewWorkout(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRoutine}>Save Routine</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
