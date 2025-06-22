"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { TextEffect } from "@/components/ui/text-effect";

const storySteps = [
  "This is a support chat bubble.",
  "It's just a frame.\nA text box.\nA blinking cursor.",
  "It sits in the corner.\nWaiting for customers to get confused.\nFrustrated.\nStuck.",
  'Now, most of these bubbles come with "AI."',
  'But the first thing customers ask is: "Can I talk to a human?"',
  "Why is that?",
  "Because most AI agents don't help.\nThey deflect. Delay. Frustrate.",
  "But it's not AI's fault.\nIt's the system around it.",
  "Support has become disconnected.\nBubbles in the corner. Humans in tickets. Bots in scripts.",
  "What if support wasn't trapped in a bubble?",
  "What if it was a system, flexible, composable, everywhere you need it?",
  "What if AI agents actually helped?\nAnd humans could step in with a full context and no friction?",
  "What if support finally felt like your product?\nFast. Useful. Beautiful. Yours.",
  "That's what Origami is.",
  "An open-source, AI-native support system built for developers shipping modern SaaS.",
  "Developer-first.\nCustomer-ready.\nBuilt to scale with you.",
  "Let's escape the bubble, together.",
];

export function ScrollSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [showContinue, setShowContinue] = useState(true);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionsRef.current.forEach((section, index) => {
      if (!section) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveStep(index);
              setShowContinue(index === storySteps.length - 1);
            }
          });
        },
        {
          rootMargin: "-20% 0px -20% 0px",
          threshold: 0.1,
        }
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const renderStoryText = (text: string) => {
    return text.split("\n").map((line, index) => (
      <TextEffect key={index} className="mb-2" delay={index * 1.3}>
        {line}
      </TextEffect>
    ));
  };

  return (
    <div className="relative min-h-screen bg-background snap-y snap-mandatory overflow-y-auto">
      <div className="relative flex max-w-7xl mx-auto px-6 lg:px-8">
        {/* Left Column - Scrolling Text */}
        <div className="w-full md:w-3/5 min-h-screen">
          {storySteps.map((step, index) => (
            <div
              key={index}
              ref={(el) => {
                sectionsRef.current[index] = el;
              }}
              className="min-h-screen flex items-center snap-start snap-always"
            >
              {activeStep === index && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: false, margin: "-10% 0px -10% 0px" }}
                  className="max-w-2xl"
                >
                  <div className="text-xl lg:text-2xl xl:text-3xl font-mono leading-relaxed text-foreground">
                    {renderStoryText(step)}
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Right Column - Fixed Visuals */}
        <div className="hidden md:flex w-2/5 h-screen sticky top-0 items-center">
          <div className="w-full max-w-md"></div>
        </div>
      </div>

      {/* Scroll Continue Indicator */}
      {!showContinue && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="flex items-center space-x-2 text-foreground/60">
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1 h-6 bg-foreground/40 rounded-full"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
