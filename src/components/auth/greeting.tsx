"use client";

import { useAuth } from "./auth-provider";
import { motion } from "framer-motion";

export function Greeting() {
  const { user, loading } = useAuth();

  if (loading || !user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
      className="text-muted-foreground"
    >
      <p className="text-sm">
        Welcome back,{" "}
        <span className="font-medium text-foreground">
          {user.user_metadata.full_name || user.email}
        </span>
      </p>
    </motion.div>
  );
}
