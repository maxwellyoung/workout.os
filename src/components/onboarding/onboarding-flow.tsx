"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "../auth/auth-provider";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface OnboardingData {
  fitnessGoal: "strength" | "endurance" | "weight-loss" | "muscle-gain";
  experienceLevel: "beginner" | "intermediate" | "advanced";
  workoutDays: number;
  equipment: string[];
}

export function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    fitnessGoal: "strength",
    experienceLevel: "beginner",
    workoutDays: 3,
    equipment: [],
  });
  const { user } = useAuth();

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleComplete = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.from("user_preferences").upsert({
        user_id: user.id,
        fitness_goal: data.fitnessGoal,
        experience_level: data.experienceLevel,
        workout_days: data.workoutDays,
        equipment: data.equipment,
        onboarding_completed: true,
      });

      if (error) throw error;

      toast.success("Preferences saved successfully!");
      // Redirect to dashboard or home
      window.location.href = "/";
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Welcome to Workout.OS</h2>
          <p className="text-muted-foreground">
            Let&apos;s personalize your experience
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label>What&apos;s your primary fitness goal?</Label>
              <RadioGroup
                value={data.fitnessGoal}
                onValueChange={(value: OnboardingData["fitnessGoal"]) =>
                  setData({ ...data, fitnessGoal: value })
                }
                className="grid grid-cols-2 gap-4 mt-2"
              >
                <div>
                  <RadioGroupItem value="strength" id="strength" />
                  <Label htmlFor="strength">Strength</Label>
                </div>
                <div>
                  <RadioGroupItem value="endurance" id="endurance" />
                  <Label htmlFor="endurance">Endurance</Label>
                </div>
                <div>
                  <RadioGroupItem value="weight-loss" id="weight-loss" />
                  <Label htmlFor="weight-loss">Weight Loss</Label>
                </div>
                <div>
                  <RadioGroupItem value="muscle-gain" id="muscle-gain" />
                  <Label htmlFor="muscle-gain">Muscle Gain</Label>
                </div>
              </RadioGroup>
            </div>
            <Button onClick={handleNext} className="w-full">
              Next
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label>What&apos;s your experience level?</Label>
              <RadioGroup
                value={data.experienceLevel}
                onValueChange={(value: OnboardingData["experienceLevel"]) =>
                  setData({ ...data, experienceLevel: value })
                }
                className="grid gap-2 mt-2"
              >
                <div>
                  <RadioGroupItem value="beginner" id="beginner" />
                  <Label htmlFor="beginner">Beginner</Label>
                </div>
                <div>
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">Intermediate</Label>
                </div>
                <div>
                  <RadioGroupItem value="advanced" id="advanced" />
                  <Label htmlFor="advanced">Advanced</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleBack} variant="outline">
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label>How many days per week do you want to work out?</Label>
              <Input
                type="number"
                min={1}
                max={7}
                value={data.workoutDays}
                onChange={(e) =>
                  setData({
                    ...data,
                    workoutDays: parseInt(e.target.value) || 3,
                  })
                }
                className="mt-2"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleBack} variant="outline">
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div>
              <Label>What equipment do you have access to?</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  "Dumbbells",
                  "Barbell",
                  "Pull-up Bar",
                  "Resistance Bands",
                  "Bench",
                  "Kettlebell",
                  "Cable Machine",
                  "Smith Machine",
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={item}
                      checked={data.equipment.includes(item)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setData({
                            ...data,
                            equipment: [...data.equipment, item],
                          });
                        } else {
                          setData({
                            ...data,
                            equipment: data.equipment.filter((i) => i !== item),
                          });
                        }
                      }}
                    />
                    <Label htmlFor={item}>{item}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleBack} variant="outline">
                Back
              </Button>
              <Button onClick={handleComplete} className="flex-1">
                Complete Setup
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full transition-colors ${
                i === step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
