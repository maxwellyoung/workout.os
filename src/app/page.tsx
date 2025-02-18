"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AuthButton } from "@/components/auth/auth-button";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <main
      className="min-h-screen bg-[#0A0A0A] relative overflow-hidden"
      ref={containerRef}
    >
      {/* Grainy background */}
      <div className="fixed inset-0 bg-noise" />

      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-radial from-primary/20 via-background to-background animate-gradient-slow opacity-50" />
      <div className="fixed inset-0 bg-grid-small-white/[0.02] bg-grid-animation" />

      {/* Main content */}
      <div className="relative min-h-screen mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-4 md:gap-6 lg:gap-8 py-8 md:py-12 lg:py-16">
          {/* Logo with breathing animation */}
          <motion.div
            className="col-span-12 lg:col-span-2 flex items-center"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
              <span className="font-mono font-bold tracking-wider">
                WORKOUT.OS
              </span>
            </div>
          </motion.div>

          {/* Sign in button with hover effect */}
          <div className="col-span-12 lg:col-span-2 lg:col-start-11 flex items-center justify-end">
            <AuthButton />
          </div>

          {/* Main title */}
          <motion.div
            className="col-span-12 lg:col-span-8 lg:col-start-3 flex flex-col items-center justify-center text-center mt-12 lg:mt-24"
            style={{ opacity, scale }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                Your Workout Operating System
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px] mb-12">
              Sign in with Google to start tracking your workouts and progress
            </p>
            <AuthButton />
          </motion.div>

          {/* Feature grid with hover animations */}
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mt-24">
            {[
              {
                title: "AI Generation",
                description:
                  "Generate custom workouts based on your fitness goals",
                className: "md:col-span-2 bg-orange-500/10",
              },
              {
                title: "Progress Tracking",
                description: "Track progress across different muscle groups",
                className: "bg-blue-500/10",
              },
              {
                title: "Equipment Adaptive",
                description: "Adapt routines based on available equipment",
                className: "bg-green-500/10",
              },
              {
                title: "Save & Reuse",
                description: "Save and reuse your favorite workouts",
                className: "bg-purple-500/10",
              },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                className={cn(
                  "p-6 md:p-8 rounded-2xl relative overflow-hidden cursor-pointer border border-white/5 hover:border-white/10 transition-colors",
                  feature.className
                )}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <div className="relative z-10">
                  <h3 className="font-mono font-bold text-2xl mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 text-lg">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Process steps with improved layout */}
          <div className="col-span-12 mt-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12">
              {[
                {
                  number: "01",
                  title: "Sign In",
                  description: "Connect with your Google account",
                  color: "from-orange-500/20",
                },
                {
                  number: "02",
                  title: "Set Goals",
                  description: "Define your fitness objectives",
                  color: "from-blue-500/20",
                },
                {
                  number: "03",
                  title: "Start Training",
                  description: "Get personalized AI workouts",
                  color: "from-green-500/20",
                },
              ].map((step, index) => (
                <motion.div
                  key={step.number}
                  className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-b from-transparent to-transparent border border-white/5 hover:border-white/10 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b opacity-10" />
                  <div className="relative">
                    <div className="font-mono text-6xl font-black text-white/20 mb-6">
                      {step.number}
                    </div>
                    <h3 className="font-mono font-bold text-2xl mb-4 text-white">
                      {step.title}
                    </h3>
                    <p className="text-white/80 text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
