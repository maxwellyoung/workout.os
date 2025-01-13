"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocalStorage } from "@/lib/use-local-storage";
import WeekView from "./week-view";
import DayView from "./day-view";
import EquipmentManager from "./equipment-manager";
import { defaultWorkouts, defaultEquipment } from "@/lib/defaults";
import { AIWorkoutGenerator } from "./ai-workout-generator";

export type Exercise = {
  id: string;
  name: string;
  reps: number;
  sets: number;
  completed: boolean;
  targetMuscles?: string[];
  notes?: string;
};

export type WorkoutAnalysis = {
  muscleGroupsCovered: { [key: string]: number };
  weeklyVolume: { [key: string]: number };
  restPeriods: string[];
  notes: string[];
};

export type Workout = {
  [day: string]: Exercise[];
};

export type Equipment = {
  id: string;
  name: string;
  quantity: number;
};

interface WorkoutTrackerProps {
  saveAsRoutine?: boolean;
}

export default function WorkoutTracker({
  saveAsRoutine = false,
}: WorkoutTrackerProps) {
  const [workouts, setWorkouts] = useLocalStorage<Workout>(
    "workouts",
    defaultWorkouts
  );
  const [equipment, setEquipment] = useLocalStorage<Equipment[]>(
    "equipment",
    defaultEquipment
  );
  const [view, setView] = useState<"week" | "day">("week");
  const [selectedDay, setSelectedDay] = useState<string>(
    new Date().toLocaleString("en-US", { weekday: "long" })
  );

  const toggleExercise = (day: string, exerciseId: string) => {
    setWorkouts((prev) => ({
      ...prev,
      [day]: prev[day].map((exercise) =>
        exercise.id === exerciseId
          ? { ...exercise, completed: !exercise.completed }
          : exercise
      ),
    }));
  };

  const addExercise = (day: string, exercise: Exercise) => {
    setWorkouts((prev) => ({
      ...prev,
      [day]: [...prev[day], exercise],
    }));
  };

  const removeExercise = (day: string, exerciseId: string) => {
    setWorkouts((prev) => ({
      ...prev,
      [day]: prev[day].filter((exercise) => exercise.id !== exerciseId),
    }));
  };

  const addEquipment = (newEquipment: Equipment) => {
    setEquipment((prev) => [...prev, newEquipment]);
  };

  const removeEquipment = (equipmentId: string) => {
    setEquipment((prev) => prev.filter((item) => item.id !== equipmentId));
  };

  const handleWorkoutGenerated = (newWorkouts: Workout) => {
    setWorkouts(newWorkouts);
  };

  return (
    <div className="space-y-4 p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
          Workout Tracker
        </h1>
        <AIWorkoutGenerator
          onWorkoutGenerated={handleWorkoutGenerated}
          saveAsRoutine={saveAsRoutine}
        />
      </div>

      <div className="glassmorphic rounded-lg p-4 sm:p-6 shadow-lg">
        <Tabs
          value={view}
          onValueChange={(value) => setView(value as "week" | "day")}
          className="w-full"
        >
          <TabsList className="w-full sm:w-auto mb-4">
            <TabsTrigger value="week" className="flex-1 sm:flex-none">
              Week View
            </TabsTrigger>
            <TabsTrigger value="day" className="flex-1 sm:flex-none">
              Day View
            </TabsTrigger>
          </TabsList>
          <TabsContent value="week" className="mt-0">
            <WeekView
              workouts={workouts}
              toggleExercise={toggleExercise}
              addExercise={addExercise}
              removeExercise={removeExercise}
            />
          </TabsContent>
          <TabsContent value="day" className="mt-0">
            <DayView
              workouts={workouts[selectedDay]}
              day={selectedDay}
              toggleExercise={(exerciseId) =>
                toggleExercise(selectedDay, exerciseId)
              }
              addExercise={(exercise) => addExercise(selectedDay, exercise)}
              removeExercise={(exerciseId) =>
                removeExercise(selectedDay, exerciseId)
              }
              setSelectedDay={setSelectedDay}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="glassmorphic rounded-lg p-4 sm:p-6 shadow-lg">
        <EquipmentManager
          equipment={equipment}
          addEquipment={addEquipment}
          removeEquipment={removeEquipment}
        />
      </div>
    </div>
  );
}
