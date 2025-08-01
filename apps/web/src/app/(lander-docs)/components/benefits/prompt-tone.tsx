"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const lines = [
	"You are a friendly and professional support agent for Acme SaaS.",
	"Always maintain a helpful, empathetic tone while being concise.",
	"Prioritize solving customer problems quickly and efficiently.",
	"",
	"## Rules",
	"- If you don't know the answer, escalate to human support immediately",
	"- NEVER make up information or provide guesses",
	"- Do not book a time with our founder if the user is not an enterprise customer",
	"",
	"## Available Tools",
	"@updateUserEmail - Update customer email address",
	"@check_status - Check service status and recent incidents",
];

export const PromptToneGraphic = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true });

	return (
		<div className="relative">
			<div
				className="grid gap-2 font-mono text-muted-foreground text-xs"
				ref={ref}
			>
				{lines.map((line, index) => (
					<motion.div
						animate={{ opacity: isInView ? 1 : 0 }}
						className="flex items-center gap-2"
						initial={{ opacity: 0 }}
						key={line}
						transition={{
							duration: 0.1,
							delay: index * 0.1,
							ease: "easeOut",
						}}
					>
						<p className="truncate">{line}</p>
					</motion.div>
				))}
			</div>
			<div className="absolute right-0 bottom-0 left-0 h-20 bg-gradient-to-t from-background to-transparent" />
		</div>
	);
};
