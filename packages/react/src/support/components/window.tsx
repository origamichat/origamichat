"use client";

import { motion } from "motion/react";
import type React from "react";
import * as Primitive from "../../primitive";
import { cn } from "../utils";

export interface WindowProps {
  className?: string;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ className, children }) => {
  return (
    <Primitive.Window asChild>
      <motion.div
        animate="visible"
        className={cn(
          "flex h-[calc(100vh-6rem)] w-[calc(100vw-2rem)] flex-col overflow-clip rounded-lg border border-co-border bg-co-background shadow-xl md:aspect-[9/16] md:h-auto md:w-[400px]",
          className
        )}
        exit="exit"
        initial="hidden"
        transition={{
          default: { ease: "anticipate" },
          layout: { duration: 0.3 },
        }}
        variants={{
          hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          exit: { opacity: 0, y: 10, filter: "blur(6px)" },
        }}
      >
        {children}
      </motion.div>
    </Primitive.Window>
  );
};
