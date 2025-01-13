"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "../auth/auth-provider";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface OnboardingStep {
  title: string;
  description: string;
}

const steps: OnboardingStep[] = [
  {
    title: "What are your fitness goals?",
    description: "Select your primary fitness goal",
  },
  {
    title: "Your experience level",
    description: "Help us understand where you're starting from",
  },
  {
    title: "What equipment do you have?",
    description: "Select all equipment available to you",
  },
  {
    title: "Preferred workout days",
    description: "Select the days you'd like to work out",
  },
];

const fitnessGoals = [
  { id: "strength", label: "Build Strength" },
  { id: "endurance", label: "Improve Endurance" },
  { id: "weight-loss", label: "Weight Loss" },
  { id: "muscle-gain", label: "Muscle Gain" },
] as const;

const experienceLevels = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
] as const;

const equipmentOptions = [
  { id: "dumbbells", label: "Dumbbells", defaultQuantity: 2 },
  { id: "pull-up-bar", label: "Pull-up Bar", defaultQuantity: 1 },
  { id: "resistance-bands", label: "Resistance Bands", defaultQuantity: 1 },
  { id: "yoga-mat", label: "Yoga Mat", defaultQuantity: 1 },
  { id: "bench", label: "Workout Bench", defaultQuantity: 1 },
  { id: "kettlebell", label: "Kettlebell", defaultQuantity: 1 },
  { id: "foam-roller", label: "Foam Roller", defaultQuantity: 1 },
  { id: "ab-wheel", label: "Ab Wheel", defaultQuantity: 1 },
] as const;

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

type GoalType = (typeof fitnessGoals)[number]["id"];
type ExperienceType = (typeof experienceLevels)[number]["id"];
type WeekDayType = (typeof weekDays)[number];
type EquipmentType = (typeof equipmentOptions)[number]["id"];

interface Equipment {
  id: EquipmentType;
  quantity: number;
}

interface FormData {
  goal: GoalType;
  experience: ExperienceType;
  equipment: Equipment[];
  workoutDays: WeekDayType[];
}

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    goal: "strength",
    experience: "beginner",
    equipment: [],
    workoutDays: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    try {
      if (!user?.id) {
        throw new Error("No user ID found");
      }

      setIsSubmitting(true);

      // Save preferences
      const { error: preferencesError } = await supabase
        .from("user_preferences")
        .upsert({
          user_id: user.id,
          fitness_goal: formData.goal,
          experience_level: formData.experience,
          workout_days: formData.workoutDays,
        })
        .select()
        .single();

      if (preferencesError) {
        console.error("Supabase error saving preferences:", {
          code: preferencesError.code,
          message: preferencesError.message,
          details: preferencesError.details,
        });
        throw new Error(
          `Failed to save preferences: ${preferencesError.message}`
        );
      }

      // Save equipment if any is selected
      if (formData.equipment.length > 0) {
        const { error: equipmentError } = await supabase
          .from("equipment")
          .upsert(
            formData.equipment.map((item) => ({
              user_id: user.id,
              name: item.id,
              quantity: item.quantity,
            }))
          )
          .select();

        if (equipmentError) {
          console.error("Supabase error saving equipment:", {
            code: equipmentError.code,
            message: equipmentError.message,
            details: equipmentError.details,
          });
          throw new Error(
            `Failed to save equipment: ${equipmentError.message}`
          );
        }
      }

      // If we get here, everything was saved successfully
      toast.success("Preferences saved successfully!");
      onComplete?.();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error saving preferences:", error.message);
        toast.error(error.message);
      } else {
        console.error("Unknown error saving preferences:", error);
        toast.error("An unexpected error occurred while saving preferences");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return !!formData.goal;
      case 1:
        return !!formData.experience;
      case 2:
        return formData.equipment.length > 0;
      case 3:
        return formData.workoutDays.length > 0;
      default:
        return true;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto p-6 space-y-8"
    >
      {/* Progress bar */}
      <div className="relative pt-4">
        <div className="h-2 bg-secondary rounded-full">
          <motion.div
            className="absolute h-2 bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">
              {steps[currentStep].title}
            </h2>
            <p className="text-muted-foreground">
              {steps[currentStep].description}
            </p>
          </div>

          {currentStep === 0 && (
            <RadioGroup
              value={formData.goal}
              onValueChange={(value: GoalType) =>
                setFormData({ ...formData, goal: value })
              }
              className="space-y-3"
            >
              {fitnessGoals.map((goal) => (
                <div key={goal.id} className="flex items-center space-x-3">
                  <RadioGroupItem value={goal.id} id={goal.id} />
                  <Label htmlFor={goal.id}>{goal.label}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentStep === 1 && (
            <RadioGroup
              value={formData.experience}
              onValueChange={(value: ExperienceType) =>
                setFormData({ ...formData, experience: value })
              }
              className="space-y-3"
            >
              {experienceLevels.map((level) => (
                <div key={level.id} className="flex items-center space-x-3">
                  <RadioGroupItem value={level.id} id={level.id} />
                  <Label htmlFor={level.id}>{level.label}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              {equipmentOptions.map((eq) => (
                <div key={eq.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={eq.id}
                    checked={formData.equipment.some((e) => e.id === eq.id)}
                    onCheckedChange={(checked) => {
                      const updatedEquipment = checked
                        ? [
                            ...formData.equipment,
                            {
                              id: eq.id as EquipmentType,
                              quantity: eq.defaultQuantity,
                            },
                          ]
                        : formData.equipment.filter((e) => e.id !== eq.id);
                      setFormData({ ...formData, equipment: updatedEquipment });
                    }}
                  />
                  <Label htmlFor={eq.id}>{eq.label}</Label>
                </div>
              ))}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-3">
              {weekDays.map((day) => (
                <div key={day} className="flex items-center space-x-3">
                  <Checkbox
                    id={day}
                    checked={formData.workoutDays.includes(day)}
                    onCheckedChange={(checked) => {
                      const updatedDays = checked
                        ? [...formData.workoutDays, day]
                        : formData.workoutDays.filter((d) => d !== day);
                      setFormData({ ...formData, workoutDays: updatedDays });
                    }}
                  />
                  <Label htmlFor={day}>{day}</Label>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between pt-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 0 || isSubmitting}
        >
          Back
        </Button>
        <Button onClick={handleNext} disabled={!isStepValid() || isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current" />
              Saving...
            </>
          ) : currentStep === steps.length - 1 ? (
            "Finish"
          ) : (
            "Next"
          )}
        </Button>
      </div>
    </motion.div>
  );
}
