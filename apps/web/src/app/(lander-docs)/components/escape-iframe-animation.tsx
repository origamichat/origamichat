"use client";

import { motion } from "motion/react";

export const EscapeIframeAnimation = () => {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="relative w-full px-6 text-center font-mono text-primary/80 text-xs md:w-fit lg:px-0 lg:text-left"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 2 }}
    >
      Own your support
      {/* left */}
      {/* <motion.div
        animate={{ scaleY: 1 }}
        className="-top-[30px] -left-[1px] pointer-events-none absolute h-[75px] w-[1px] border-primary/20 border-l border-dashed"
        initial={{ scaleY: 0 }}
        style={{ originY: 0.5 }}
        transition={{ duration: 0.6, delay: 3, ease: "easeOut" }}
      /> */}
      {/* right */}
      <motion.div
        animate={{ scaleY: 1 }}
        className="-top-[15px] -right-[1px] pointer-events-none absolute h-[45px] w-[1px] border-primary/10 border-r border-dashed"
        initial={{ scaleY: 0 }}
        style={{ originY: 0.5 }}
        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
      />
      {/* bottom */}
      {/* <motion.div
        animate={{ scaleX: 1 }}
        className="-bottom-[1px] -left-[30px] pointer-events-none absolute h-[1px] w-[calc(100%+70px)] border-primary/20 border-b border-dashed"
        initial={{ scaleX: 0 }}
        style={{ originX: 0.5 }}
        transition={{ duration: 0.6, delay: 3.5, ease: "easeOut" }}
      /> */}
      {/* top */}
      {/* <motion.div
        animate={{ scaleX: 1 }}
        className="-top-[1px] -left-[15px] pointer-events-none absolute h-[1px] w-[calc(100%+30px)] border-primary/20 border-b border-dashed"
        initial={{ scaleX: 0 }}
        style={{ originX: 0.5 }}
        transition={{ duration: 0.6, delay: 3.8, ease: "easeOut" }}
      /> */}
    </motion.div>
  );
};
