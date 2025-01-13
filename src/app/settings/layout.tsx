import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background relative">
        <div className="fixed inset-0 grid-pattern opacity-[0.03]" />
        <div className="fixed inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="container mx-auto p-4 space-y-6 relative">
          <div className="flex items-center gap-4">
            <Link href="/routines">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="lg:w-1/5">
              <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                <Link
                  href="/settings/profile"
                  className="justify-start hover:bg-accent hover:text-accent-foreground px-3 py-2 text-sm font-medium rounded-md"
                >
                  Profile
                </Link>
                <Link
                  href="/settings/billing"
                  className="justify-start hover:bg-accent hover:text-accent-foreground px-3 py-2 text-sm font-medium rounded-md"
                >
                  Billing
                </Link>
              </nav>
            </aside>
            <div className="flex-1 lg:max-w-2xl glassmorphic rounded-lg p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
