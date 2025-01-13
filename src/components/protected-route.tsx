"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/lib/supabase";
import { ScrambleText } from "@/components/ui/scramble-text";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { AuthButton } from "@/components/auth/auth-button";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    async function checkOnboardingStatus() {
      // If no user, don't check onboarding
      if (!user) {
        setCheckingOnboarding(false);
        return;
      }

      try {
        const { data } = await supabase
          .from("user_preferences")
          .select("id")
          .eq("user_id", user.id)
          .single();

        setHasCompletedOnboarding(!!data);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setHasCompletedOnboarding(false);
      } finally {
        setCheckingOnboarding(false);
      }
    }

    checkOnboardingStatus();
  }, [user]);

  // Show loading state while checking onboarding
  if (checkingOnboarding) {
    return null;
  }

  // If no user, show sign in
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              <ScrambleText
                text="Welcome to WORKOUT.OS"
                scrambleSpeed={100}
                maxIterations={10}
                sequential={true}
                revealDirection="center"
                scrambledClassName="text-primary"
              />
            </h1>
            <p className="text-xl text-muted-foreground">
              <ScrambleText
                text="Sign in with Google to start tracking your workouts and progress"
                scrambleSpeed={80}
                maxIterations={8}
                sequential={true}
                revealDirection="center"
              />
            </p>
            <AuthButton />
          </div>
        </main>
      </div>
    );
  }

  // If user hasn't completed onboarding, show onboarding
  if (!hasCompletedOnboarding) {
    return (
      <OnboardingFlow onComplete={() => setHasCompletedOnboarding(true)} />
    );
  }

  // User is signed in and has completed onboarding
  return <>{children}</>;
}
