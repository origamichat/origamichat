"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

export const HumanAiGraphic = () => {
	return (
		<div className="relative">
			<div className="absolute right-0 bottom-0 left-0 h-20 bg-gradient-to-t from-background to-transparent" />
		</div>
	);
};
