"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "./auth-provider";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export function AuthButton() {
  const { user } = useAuth();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {user ? (
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="transition-all duration-300 hover:bg-destructive hover:text-destructive-foreground"
        >
          Sign Out
        </Button>
      ) : (
        <Button
          onClick={handleSignIn}
          className="transition-all duration-300 hover:scale-105"
        >
          Sign In with Google
        </Button>
      )}
    </motion.div>
  );
}
