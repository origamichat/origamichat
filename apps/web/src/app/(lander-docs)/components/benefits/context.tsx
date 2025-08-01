"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const lines = [
	'◼ Anonymous user ID38d9sj visited "/sign-up"',
	"◼ Anonymous user ID38d9sj signed up",
	'✔ User identified as "Yin Yang" (yin.yang@example.com)',
	'◼ "Yin Yang" visited "/onboarding"',
	'◼ "Yin Yang" completed onboarding',
	'⚠ "Yin Yang" faced an error',
	"  ❯ 'JS Error: TypeError:",
	"  ❯ Cannot read property 'theme' of undefined'",
	`◼ "Yin Yang" opened support widget`,
];

export const ContextGraphic = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true });

	return (
		<div className="relative">
			<pre
				className="grid text-muted-foreground text-sm leading-relaxed"
				ref={ref}
			>
				{lines.map((line, index) => (
					<motion.code
						animate={{ opacity: isInView ? 1 : 0 }}
						initial={{ opacity: 0 }}
						key={line}
						transition={{
							duration: 0.3,
							delay: index * 0.3,
							ease: "easeOut",
						}}
					>
						{line}
					</motion.code>
				))}
			</pre>
			<div className="absolute right-0 bottom-0 left-0 h-20 bg-gradient-to-t from-background to-transparent" />
		</div>
	);
};
