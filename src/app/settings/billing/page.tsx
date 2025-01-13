"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSubscription } from "@/hooks/use-subscription";
import { Loader2 } from "lucide-react";

export default function BillingPage() {
  const { isPro, isLoading, features } = useSubscription();

  const handleUpgrade = () => {
    window.location.href = "https://buy.stripe.com/bIY9C53WpeQ09Ec6op";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and billing information.
        </p>
      </div>
      <Separator />
      <div className="space-y-8">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">
              {isPro ? "Pro Plan" : "Free Plan"}
            </div>
            <div className="text-sm text-muted-foreground">
              {isPro
                ? "You are currently on the pro plan"
                : "You are currently on the free plan"}
            </div>
          </div>
          {!isPro && (
            <Button onClick={handleUpgrade} variant="outline">
              Upgrade to Pro
            </Button>
          )}
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium mb-2">Your Features</div>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>
              • AI workout generation (
              {features.aiWorkoutGenerations === "unlimited"
                ? "Unlimited"
                : `${features.aiWorkoutGenerations}/month`}
              )
            </li>
            <li>
              • {features.advancedTracking ? "Advanced" : "Basic"} workout
              tracking
            </li>
            {features.customTemplates && <li>• Custom workout templates</li>}
            {features.analytics && <li>• Detailed analytics and insights</li>}
            {features.prioritySupport && <li>• Priority support</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
