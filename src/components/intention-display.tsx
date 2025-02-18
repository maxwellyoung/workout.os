"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useIntention } from "@/hooks/use-intention";
import { processStatsUpdate } from "@/lib/stats-processor";
import { useAuth } from "@/components/auth/auth-provider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface IntentionDisplayProps {
  className?: string;
}

export function IntentionDisplay({ className }: IntentionDisplayProps) {
  const { user } = useAuth();
  const { intention, isLoading } = useIntention();
  const [isUpdating, setIsUpdating] = useState(false);
  const [input, setInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  async function handleUpdate() {
    if (!user?.id || !input.trim()) return;

    try {
      setIsUpdating(true);
      await processStatsUpdate(user.id, input);
      toast.success("Intention updated");
      setInput("");
      setIsEditing(false);
      // The intention will update automatically via the hook
    } catch (error) {
      console.error("Error updating intention:", error);
      toast.error("Failed to update intention");
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return (
      <div className={cn("animate-pulse h-8 bg-muted rounded", className)} />
    );
  }

  if (!isEditing && intention) {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        <div className="flex-1">
          <div className="text-sm text-muted-foreground mb-1">
            Current Intention
          </div>
          <div className="font-medium">{intention}</div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
          Update
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="text-sm text-muted-foreground">
        {intention ? "Update Intention" : "Set Intention"}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., 'Feeling strong today, aiming for new PR on bench'"
          className="flex-1 bg-background border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button onClick={handleUpdate} disabled={isUpdating || !input.trim()}>
          {isUpdating ? "Updating..." : "Update"}
        </Button>
        {isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
