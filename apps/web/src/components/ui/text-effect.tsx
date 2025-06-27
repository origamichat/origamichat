"use client";
import type {
	TargetAndTransition,
	Transition,
	Variant,
	Variants,
} from "motion/react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { cn } from "@/lib/utils";

export type PresetType = "blur" | "fade-in-blur" | "scale" | "fade" | "slide";

export type PerType = "word" | "char" | "line";

const SPACE_REGEX = /(\s+)/;

export type TextEffectProps = {
	children: string | string[];
	per?: PerType;
	as?: keyof React.JSX.IntrinsicElements;
	variants?: {
		container?: Variants;
		item?: Variants;
	};
	className?: string;
	preset?: PresetType;
	delay?: number;
	speedReveal?: number;
	speedSegment?: number;
	trigger?: boolean;
	onAnimationComplete?: () => void;
	onAnimationStart?: () => void;
	segmentWrapperClassName?: string;
	containerTransition?: Transition;
	segmentTransition?: Transition;
	style?: React.CSSProperties;
};

const defaultStaggerTimes: Record<PerType, number> = {
	char: 0.03,
	word: 0.05,
	line: 0.1,
};

const defaultContainerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.05,
		},
	},
	exit: {
		transition: { staggerChildren: 0.05, staggerDirection: -1 },
	},
};

const defaultItemVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
	},
	exit: { opacity: 0 },
};

const presetVariants: Record<
	PresetType,
	{ container: Variants; item: Variants }
> = {
	blur: {
		container: defaultContainerVariants,
		item: {
			hidden: { opacity: 0, filter: "blur(12px)" },
			visible: { opacity: 1, filter: "blur(0px)" },
			exit: { opacity: 0, filter: "blur(12px)" },
		},
	},
	"fade-in-blur": {
		container: defaultContainerVariants,
		item: {
			hidden: { opacity: 0, y: 20, filter: "blur(12px)" },
			visible: { opacity: 1, y: 0, filter: "blur(0px)" },
			exit: { opacity: 0, y: 20, filter: "blur(12px)" },
		},
	},
	scale: {
		container: defaultContainerVariants,
		item: {
			hidden: { opacity: 0, scale: 0 },
			visible: { opacity: 1, scale: 1 },
			exit: { opacity: 0, scale: 0 },
		},
	},
	fade: {
		container: defaultContainerVariants,
		item: {
			hidden: { opacity: 0 },
			visible: { opacity: 1 },
			exit: { opacity: 0 },
		},
	},
	slide: {
		container: defaultContainerVariants,
		item: {
			hidden: { opacity: 0, y: 20 },
			visible: { opacity: 1, y: 0 },
			exit: { opacity: 0, y: 20 },
		},
	},
};

const AnimationComponent: React.FC<{
	segment: string;
	variants: Variants;
	per: "line" | "word" | "char";
	segmentWrapperClassName?: string;
}> = React.memo(({ segment, variants, per, segmentWrapperClassName }) => {
	const content =
		per === "line" ? (
			<motion.span className="block" variants={variants}>
				{segment}
			</motion.span>
		) : per === "word" ? (
			<motion.span
				aria-hidden="true"
				className="inline-block whitespace-pre"
				variants={variants}
			>
				{segment}
			</motion.span>
		) : (
			<motion.span className="inline-block whitespace-pre">
				{segment.split("").map((char, charIndex) => (
					<motion.span
						aria-hidden="true"
						className="inline-block whitespace-pre"
						key={`char-${charIndex}`}
						variants={variants}
					>
						{char}
					</motion.span>
				))}
			</motion.span>
		);

	if (!segmentWrapperClassName) {
		return content;
	}

	const defaultWrapperClassName = per === "line" ? "block" : "inline-block";

	return (
		<span className={cn(defaultWrapperClassName, segmentWrapperClassName)}>
			{content}
		</span>
	);
});

AnimationComponent.displayName = "AnimationComponent";

const splitText = (text: string, per: PerType) => {
	if (per === "line") {
		return text.split("\n");
	}
	return text.split(SPACE_REGEX);
};

const hasTransition = (
	variant?: Variant
): variant is TargetAndTransition & { transition?: Transition } => {
	if (!variant) {
		return false;
	}
	return typeof variant === "object" && "transition" in variant;
};

const createVariantsWithTransition = (
	baseVariants: Variants,
	transition?: Transition & { exit?: Transition }
): Variants => {
	if (!transition) {
		return baseVariants;
	}

	const { exit: _, ...mainTransition } = transition;

	return {
		...baseVariants,
		visible: {
			...baseVariants.visible,
			transition: {
				...(hasTransition(baseVariants.visible)
					? baseVariants.visible.transition
					: {}),
				...mainTransition,
			},
		},
		exit: {
			...baseVariants.exit,
			transition: {
				...(hasTransition(baseVariants.exit)
					? baseVariants.exit.transition
					: {}),
				...mainTransition,
				staggerDirection: -1,
			},
		},
	};
};

export function TextEffect({
	children,
	per = "word",
	as = "p",
	variants,
	className,
	preset = "fade",
	delay = 0,
	speedReveal = 1,
	speedSegment = 1,
	trigger = true,
	onAnimationComplete,
	onAnimationStart,
	segmentWrapperClassName,
	containerTransition,
	segmentTransition,
	style,
}: TextEffectProps) {
	const segments = splitText(
		Array.isArray(children) ? children.join("") : children,
		per
	);
	const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

	const baseVariants = preset
		? presetVariants[preset]
		: { container: defaultContainerVariants, item: defaultItemVariants };

	const stagger = defaultStaggerTimes[per] / speedReveal;

	const baseDuration = 0.3 / speedSegment;

	const customStagger = hasTransition(variants?.container?.visible ?? {})
		? (variants?.container?.visible as TargetAndTransition).transition
				?.staggerChildren
		: undefined;

	const customDelay = hasTransition(variants?.container?.visible ?? {})
		? (variants?.container?.visible as TargetAndTransition).transition
				?.delayChildren
		: undefined;

	const computedVariants = {
		container: createVariantsWithTransition(
			variants?.container || baseVariants.container,
			{
				staggerChildren: customStagger ?? stagger,
				delayChildren: customDelay ?? delay,
				...containerTransition,
				exit: {
					staggerChildren: customStagger ?? stagger,
					staggerDirection: -1,
				},
			}
		),
		item: createVariantsWithTransition(variants?.item || baseVariants.item, {
			duration: baseDuration,
			...segmentTransition,
		}),
	};

	return (
		<AnimatePresence mode="popLayout">
			{trigger && (
				<MotionTag
					animate="visible"
					className={className}
					exit="exit"
					initial="hidden"
					onAnimationComplete={onAnimationComplete}
					onAnimationStart={onAnimationStart}
					style={style}
					variants={computedVariants.container}
				>
					{per !== "line" ? <span className="sr-only">{children}</span> : null}
					{segments.map((segment, index) => (
						<AnimationComponent
							key={`${per}-${index}-${segment}`}
							per={per}
							segment={segment}
							segmentWrapperClassName={segmentWrapperClassName}
							variants={computedVariants.item}
						/>
					))}
				</MotionTag>
			)}
		</AnimatePresence>
	);
}
