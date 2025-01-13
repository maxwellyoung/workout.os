"use client";

import { motion } from "framer-motion";
import { AuthButton } from "./auth/auth-button";
import { Greeting } from "./auth/greeting";
import { ScrambleText } from "./ui/scramble-text";
import Link from "next/link";
import { useAuth } from "./auth/auth-provider";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Header() {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
            <Link href="/" className="text-lg font-medium tracking-tight">
              <ScrambleText
                text="WORKOUT.OS"
                scrambleSpeed={30}
                maxIterations={15}
                sequential={true}
                revealDirection="center"
                scrambledClassName="text-primary"
              />
            </Link>
          </motion.div>
          <div className="flex items-center space-x-6">
            {user && (
              <nav className="flex items-center space-x-4">
                <Link
                  href="/"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/" && "text-primary"
                  )}
                >
                  Tracker
                </Link>
                <Link
                  href="/routines"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/routines" && "text-primary"
                  )}
                >
                  Routines
                </Link>
              </nav>
            )}
            <Greeting />
            <div className="text-sm text-muted-foreground dot-matrix">
              <ScrambleText
                text="v1.0.0"
                scrambleSpeed={40}
                maxIterations={8}
                characters="0123456789."
                scrambledClassName="text-primary"
              />
            </div>
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}
