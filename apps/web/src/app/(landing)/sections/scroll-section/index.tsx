"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const storySteps = [
	"This is a support chat bubble.",
	"It's just a frame. A text box. A blinking cursor.",
	"It sits in the corner. Waiting for customers to get confused. Frustrated. Stuck.",
	'Now, most of these bubbles come with "AI."',
	'But the first thing customers ask is: "Can I talk to a human?"',
	"Why is that?",
	"Because most AI agents don't help. They deflect. Delay. Frustrate.",
	"But it's not AI's fault. It's the system around it.",
	"Support has become disconnected. Bubbles in the corner. Humans in tickets. Bots in scripts.",
	"What if support wasn't trapped in a bubble?",
	"What if it was a system, flexible, composable, everywhere you need it?",
	"What if AI agents actually helped? And humans could step in with a full context and no friction?",
	"What if support finally felt like your product? Fast. Useful. Beautiful. Yours.",
	"That's what Cossistant is.",
	"An open-source, AI-native support system built for developers shipping modern SaaS.",
	"Developer-first. Customer-ready. Built to scale with you.",
	"Let's escape the bubble, together.",
];

export function ScrollSection() {
	const [activeStep, setActiveStep] = useState(0);
	const [showContinue, setShowContinue] = useState(true);
	const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		const observers: IntersectionObserver[] = [];

		sectionsRef.current.forEach((section, index) => {
			if (!section) {
				return;
			}

			const observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) {
							setActiveStep(index);
							setShowContinue(index === storySteps.length - 1);
						}
					}
				},
				{
					rootMargin: "-40% 0px -40% 0px",
					threshold: 0.2,
				}
			);

			observer.observe(section);
			observers.push(observer);
		});

		return () => {
			for (const observer of observers) {
				observer.disconnect();
			}
		};
	}, []);

	const renderStoryText = (text: React.ReactNode, stepIndex: number) => {
		return (
			<p
				className="mb-3"
				key={`${stepIndex}-${activeStep === stepIndex ? "active" : "inactive"}`}
			>
				{text}
			</p>
		);
	};

	return (
		<div className="relative min-h-screen snap-y snap-mandatory overflow-y-auto bg-background">
			<div className="relative mx-auto flex max-w-7xl px-6 lg:px-8">
				{/* Left Column - Scrolling Text */}
				<div className="min-h-screen w-full md:w-4/5">
					{storySteps.map((step, index) => (
						<div
							className="flex min-h-screen snap-center snap-always items-center justify-center"
							key={step}
							ref={(el) => {
								sectionsRef.current[index] = el;
							}}
						>
							<motion.div
								animate={{
									opacity: activeStep === index ? 1 : 0,
								}}
								className="flex max-w-4xl text-balance"
								initial={{ opacity: 0 }}
								transition={{ duration: 0.3, ease: "easeInOut" }}
							>
								<div
									className="font-medium font-mono text-foreground text-lg leading-relaxed lg:text-xl xl:text-2xl"
									style={{ opacity: activeStep === index ? 1 : 0 }}
								>
									{renderStoryText(step, index)}
								</div>
							</motion.div>
						</div>
					))}
				</div>

				{/* Right Column - Fixed Visuals */}
				<div className="sticky top-0 hidden h-screen w-2/5 items-center md:flex">
					<div className="w-full max-w-md" />
				</div>
			</div>

			{/* Scroll Continue Indicator */}
			{!showContinue && (
				<motion.div
					animate={{ opacity: 1 }}
					className="-translate-x-1/2 fixed bottom-8 left-1/2 z-10 transform"
					initial={{ opacity: 0 }}
				>
					<div className="flex items-center space-x-2 text-foreground/60">
						<motion.div
							animate={{ y: [0, 4, 0] }}
							className="h-6 w-1 rounded-full bg-foreground/40"
							transition={{
								duration: 1.5,
								repeat: Number.POSITIVE_INFINITY,
								ease: "easeInOut",
							}}
						/>
					</div>
				</motion.div>
			)}
		</div>
	);
}
