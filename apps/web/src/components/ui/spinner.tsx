"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: number;
  circleCount?: number;
  circleDiameter?: number;
}

export const Spinner = ({
  className,
  size = 20,
  circleCount = 7,
  circleDiameter = 3,
}: SpinnerProps) => {
  const [rotation, setRotation] = useState(0);
  const [isSpread, setIsSpread] = useState(false);

  // Start the spreading animation first, then rotation
  useEffect(() => {
    // Start spreading animation after a short delay
    const spreadTimer = setTimeout(() => {
      setIsSpread(true);
    }, 100);

    // Start rotation animation after spreading is complete
    const rotationTimer = setTimeout(() => {
      setRotation(240); // Start by rotating right with overshoot
    }, 300); // Delay to allow spreading animation to complete

    return () => {
      clearTimeout(spreadTimer);
      clearTimeout(rotationTimer);
    };
  }, []);

  // Calculate radius based on size, leaving space for circle diameter
  const radius = size / 2 - circleDiameter / 2 - 1;

  // Create circles positioned in a circle
  const circles = Array.from({ length: circleCount }, (_, i) => {
    const angle = (i * 360) / circleCount; // Distribute circles evenly
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;

    return { x, y };
  });

  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
    >
      {/* Container that rotates */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{
          rotate: 0,
        }}
        animate={{
          rotate: rotation,
        }}
        transition={{
          type: "tween",
          duration: 2,
          ease: "easeInOut",
        }}
        onAnimationComplete={() => {
          // After animation completes, switch to the opposite rotation with 80° overshoot
          setTimeout(() => {
            setRotation((prev) => (prev === 0 || prev === 240 ? -80 : 240));
          }, 20);
        }}
      >
        {circles.map((circle, index) => (
          <motion.div
            key={index}
            className="absolute bg-current rounded-full"
            style={{
              width: circleDiameter,
              height: circleDiameter,
            }}
            initial={{
              left: size / 2 - circleDiameter / 2, // Start at center
              top: size / 2 - circleDiameter / 2,
            }}
            animate={{
              left: isSpread
                ? size / 2 + circle.x - circleDiameter / 2
                : size / 2 - circleDiameter / 2, // Animate to target position or stay at center
              top: isSpread
                ? size / 2 + circle.y - circleDiameter / 2
                : size / 2 - circleDiameter / 2,
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              duration: 0.6,
              delay: index * 0.3,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};
