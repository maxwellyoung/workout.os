"use client";

import { Button } from "@/components/ui/button";
import Header from "@/components/header";

export default function PricingPage() {
  const handleUpgrade = () => {
    window.location.href = "https://buy.stripe.com/bIY9C53WpeQ09Ec6op";
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Simple, transparent pricing</h1>
            <p className="text-xl text-muted-foreground">
              Choose the plan that&apos;s right for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            {/* Free Plan */}
            <div className="glassmorphic rounded-lg p-6 space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Free</h2>
                <p className="text-muted-foreground mt-1">
                  Get started for free
                </p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  Basic workout tracking
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  AI workout generation (3/month)
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  Progress tracking
                </li>
              </ul>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="glassmorphic rounded-lg p-6 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium">
                Popular
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold">Pro</h2>
                <p className="text-muted-foreground mt-1">
                  For serious athletes
                </p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$9</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  Advanced workout tracking
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  Unlimited AI workout generation
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  Detailed analytics and insights
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  Priority support
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  Custom workout templates
                </li>
              </ul>
              <Button onClick={handleUpgrade} className="w-full">
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
