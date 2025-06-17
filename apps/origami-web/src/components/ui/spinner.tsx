"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const Spinner = ({ className }: { className?: string }) => {
  const [rotation, setRotation] = useState(0);

  // Start the animation loop
  useEffect(() => {
    const timer = setTimeout(() => {
      setRotation(240); // Start by rotating right with overshoot
    }, 20);
    return () => clearTimeout(timer);
  }, []);

  // Create 7 circles positioned in a circle
  const circles = Array.from({ length: 7 }, (_, i) => {
    const angle = (i * 360) / 7; // Distribute circles evenly
    const radius = 7; // Distance from center
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;

    return { x, y };
  });

  return (
    <div
      className={cn("relative", className)}
      style={{ width: 24, height: 24 }}
    >
      {/* Container that rotates */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          rotate: rotation,
        }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 15,
          duration: 3,
        }}
        onAnimationComplete={() => {
          // After animation completes, switch to the opposite rotation with 60° overshoot
          setTimeout(() => {
            setRotation((prev) => (prev === 0 || prev === 240 ? -60 : 240));
          }, 20);
        }}
      >
        {circles.map((circle, index) => (
          <div
            key={index}
            className="absolute size-1 bg-current rounded-full"
            style={{
              left: 12 + circle.x - 2, // Center (12) + offset - half circle size (2)
              top: 12 + circle.y - 2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};
