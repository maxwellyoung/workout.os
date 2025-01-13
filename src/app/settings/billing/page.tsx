"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function BillingPage() {
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
            <div className="text-sm font-medium">Free Plan</div>
            <div className="text-sm text-muted-foreground">
              You are currently on the free plan
            </div>
          </div>
          <Button
            onClick={() => toast.info("Pro plan coming soon!")}
            variant="outline"
          >
            Upgrade to Pro
          </Button>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium mb-2">Free Plan Features</div>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Basic workout tracking</li>
            <li>• AI workout generation (3/month)</li>
            <li>• Progress tracking</li>
          </ul>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium mb-2">Pro Plan Features</div>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Advanced workout tracking</li>
            <li>• Unlimited AI workout generation</li>
            <li>• Detailed analytics and insights</li>
            <li>• Priority support</li>
            <li>• Custom workout templates</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
