"use client";

import type React from "react";
import * as Primitive from "../../primitive";
import { cn } from "../utils";

export interface WindowProps {
  className?: string;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ className, children }) => {
  return (
    <Primitive.Window
      className={cn(
        "flex h-[calc(100vh-6rem)] w-[calc(100vw-2rem)] flex-col overflow-clip rounded-lg border border-co-border bg-co-background shadow-xl md:aspect-[9/16] md:h-auto md:w-[400px]",
        className
      )}
    >
      {children}
    </Primitive.Window>
  );
};
