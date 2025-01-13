"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import WorkoutTracker from "@/components/workout-tracker";
import Header from "@/components/header";
import { ProtectedRoute } from "@/components/protected-route";
import { AIWorkoutGenerator } from "@/components/ai-workout-generator";

interface WorkoutRoutine {
  id: string;
  user_id: string;
  name: string;
  description: string;
  workouts: {
    [day: string]: Array<{
      id: string;
      name: string;
      sets: number;
      reps: number;
      completed: boolean;
      targetMuscles?: string[];
      notes?: string;
    }>;
  };
  analysis?: {
    muscleGroupsCovered: { [key: string]: number };
    weeklyVolume: { [key: string]: number };
    restPeriods: string[];
    notes: string[];
  };
  created_at: string;
  updated_at: string;
}

export default function RoutinesPage() {
  const { user } = useAuth();
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const [selectedRoutine, setSelectedRoutine] = useState<string | null>(null);

  const fetchRoutines = useCallback(async () => {
    try {
      if (!user?.id) {
        console.error("No user ID found");
        return;
      }

      const { data, error } = await supabase
        .from("workout_routines")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error fetching routines:", {
          code: error.code,
          message: error.message,
          details: error.details,
        });

        if (error.code === "PGRST116") {
          // No data found - this is fine for new users
          setRoutines([]);
          return;
        }

        if (error.code === "42P01") {
          // Table doesn't exist
          toast.error(
            "Workout routines table not found. Please set up the database."
          );
          return;
        }

        throw error;
      }

      if (!data) {
        console.log("No routines found for user");
        setRoutines([]);
        return;
      }

      console.log("Fetched routines:", data);
      setRoutines(data);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching routines:", {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
        toast.error(`Failed to load workout routines: ${error.message}`);
      } else {
        console.error("Unknown error fetching routines:", error);
        toast.error("Failed to load workout routines");
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchRoutines();
    }
  }, [user, fetchRoutines]);

  async function deleteRoutine(routineId: string) {
    try {
      if (!user?.id) {
        console.error("No user ID found");
        return;
      }

      const { error } = await supabase
        .from("workout_routines")
        .delete()
        .eq("id", routineId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Supabase error deleting routine:", error);
        throw error;
      }

      setRoutines((prev) => prev.filter((routine) => routine.id !== routineId));
      toast.success("Routine deleted successfully");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error deleting routine:", error.message);
        toast.error(`Failed to delete routine: ${error.message}`);
      } else {
        console.error("Unknown error deleting routine:", error);
        toast.error("Failed to delete routine");
      }
    }
  }

  const handleWorkoutGenerated = async () => {
    await fetchRoutines();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto p-4 space-y-6">
          {selectedRoutine ? (
            <>
              <Button
                variant="outline"
                onClick={() => setSelectedRoutine(null)}
                className="mb-4"
              >
                Back to Routines
              </Button>
              {selectedRoutine === "new" ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Create New Routine</h2>
                  <p className="text-muted-foreground">
                    Use our AI to generate a personalized workout routine based
                    on your preferences.
                  </p>
                  <div className="flex justify-center py-4">
                    <AIWorkoutGenerator
                      onWorkoutGenerated={handleWorkoutGenerated}
                      saveAsRoutine={true}
                    />
                  </div>
                </div>
              ) : (
                <WorkoutTracker key={selectedRoutine} saveAsRoutine={false} />
              )}
            </>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Workout Routines</h1>
                <AIWorkoutGenerator
                  onWorkoutGenerated={handleWorkoutGenerated}
                  saveAsRoutine={true}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {routines.map((routine) => (
                  <motion.div
                    key={routine.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "p-4 rounded-lg border bg-card text-card-foreground shadow-sm",
                      "hover:shadow-md transition-shadow"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{routine.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {routine.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRoutine(routine.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        Created:{" "}
                        {new Date(routine.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => setSelectedRoutine(routine.id)}
                          className="w-full"
                        >
                          Load Routine
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
