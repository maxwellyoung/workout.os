"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ScrambleTextProps {
  text: string;
  scrambleSpeed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  className?: string;
  scrambledClassName?: string;
  characters?: string;
  hover?: boolean;
}

const defaultCharacters =
  "ABCDEFGHIJKLMNO PQRSTUVWXYZ abcdefghijklmno pqrstuvwxyz !@#$%^&*()_+";

export function ScrambleText({
  text,
  scrambleSpeed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = "start",
  useOriginalCharsOnly = true,
  className,
  scrambledClassName,
  characters = defaultCharacters,
  hover = true,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);

  const scrambleText = useCallback(() => {
    let iterations = 0;
    const currentText = text.split("");
    const interval = setInterval(() => {
      if (iterations >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
        return;
      }

      const newText = currentText
        .map((char, index) => {
          if (sequential) {
            const position =
              revealDirection === "start"
                ? index
                : revealDirection === "end"
                ? text.length - 1 - index
                : Math.abs(text.length / 2 - index);

            if (position > iterations) {
              return useOriginalCharsOnly
                ? text.charAt(Math.floor(Math.random() * text.length))
                : characters.charAt(
                    Math.floor(Math.random() * characters.length)
                  );
            }
            return text.charAt(index);
          }

          return Math.random() > 0.5
            ? char
            : useOriginalCharsOnly
            ? text.charAt(Math.floor(Math.random() * text.length))
            : characters.charAt(Math.floor(Math.random() * characters.length));
        })
        .join("");

      setDisplayText(newText);
      iterations++;
    }, scrambleSpeed);

    return () => clearInterval(interval);
  }, [
    text,
    maxIterations,
    sequential,
    revealDirection,
    useOriginalCharsOnly,
    characters,
    scrambleSpeed,
  ]);

  useEffect(() => {
    if (isScrambling) {
      scrambleText();
    }
  }, [isScrambling, scrambleText]);

  const handleInteraction = () => {
    if (!isScrambling) {
      setIsScrambling(true);
    }
  };

  if (hover) {
    return (
      <span
        className={cn(isScrambling ? scrambledClassName : className)}
        onMouseEnter={handleInteraction}
        onMouseLeave={() => setDisplayText(text)}
      >
        {displayText}
      </span>
    );
  }

  return (
    <span className={cn(isScrambling ? scrambledClassName : className)}>
      {displayText}
    </span>
  );
}
