"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const Spinner = ({ className }: { className?: string }) => {
  // Create 7 circles positioned in a circle
  const circles = Array.from({ length: 7 }, (_, i) => {
    const angle = (i * 360) / 7; // Distribute circles evenly
    const radius = 7; // Distance from center
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;

    return { x, y, delay: i * 0.1 };
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
          rotate: [0, 360, 360, 0, 0], // Right, pause, left, pause
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "circInOut",
          times: [0, 0.4, 0.5, 0.9, 1], // Timing for each keyframe
        }}
      >
        {circles.map((circle, index) => (
          <motion.div
            key={index}
            className="absolute size-1 bg-current rounded-full"
            style={{
              left: 12 + circle.x - 2, // Center (12) + offset - half circle size (2)
              top: 12 + circle.y - 2,
            }}
            animate={{
              scale: [1, 1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: circle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};
