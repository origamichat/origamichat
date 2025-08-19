"use client";

import createGlobe, { type COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const MOVEMENT_DAMPING = 1400;

export const GLOBE_CONFIG: COBEOptions = {
	width: 800,
	height: 800,
	onRender: () => {},
	devicePixelRatio: 2,
	phi: 0,
	theta: 0.3,
	dark: 0,
	diffuse: 0.4,

	mapSamples: 16_000,
	mapBrightness: 1.2,
	baseColor: [1, 1, 1],
	markerColor: [218 / 255, 91 / 255, 68 / 255],
	glowColor: [1, 1, 1],
	markers: [
		{ location: [14.5995, 120.9842], size: 0.03 },
		{ location: [19.076, 72.8777], size: 0.1 },
		{ location: [23.8103, 90.4125], size: 0.05 },
		{ location: [30.0444, 31.2357], size: 0.07 },
		{ location: [39.9042, 116.4074], size: 0.08 },
		{ location: [-23.5505, -46.6333], size: 0.1 },
		{ location: [19.4326, -99.1332], size: 0.1 },
		{ location: [40.7128, -74.006], size: 0.1 },
		{ location: [34.6937, 135.5022], size: 0.05 },
		{ location: [41.0082, 28.9784], size: 0.06 },
	],
};

export function Globe({
	className,
	config = GLOBE_CONFIG,
}: {
	className?: string;
	config?: COBEOptions;
}) {
	let phi = 0;
	let width = 0;
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const pointerInteracting = useRef<number | null>(null);
	const pointerInteractionMovement = useRef(0);

	const r = useMotionValue(0);
	const rs = useSpring(r, {
		mass: 1,
		damping: 30,
		stiffness: 100,
	});

	const updatePointerInteraction = (value: number | null) => {
		pointerInteracting.current = value;
		if (canvasRef.current) {
			canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
		}
	};

	const updateMovement = (clientX: number) => {
		if (pointerInteracting.current !== null) {
			const delta = clientX - pointerInteracting.current;
			pointerInteractionMovement.current = delta;
			r.set(r.get() + delta / MOVEMENT_DAMPING);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: ok
	useEffect(() => {
		const onResize = () => {
			if (canvasRef.current) {
				width = canvasRef.current.offsetWidth;
			}
		};

		window.addEventListener("resize", onResize);
		onResize();

		// biome-ignore lint/style/noNonNullAssertion: ok
		const globe = createGlobe(canvasRef.current!, {
			...config,
			width: width * 2,
			height: width * 2,
			onRender: (state) => {
				if (!pointerInteracting.current) {
					phi += 0.0005;
				}
				state.phi = phi + rs.get();
				state.width = width * 2;
				state.height = width * 2;
			},
		});

		setTimeout(() => {
			if (canvasRef.current) {
				canvasRef.current.style.opacity = "1";
			}
		}, 0);
		return () => {
			globe.destroy();
			window.removeEventListener("resize", onResize);
		};
	}, [rs, config]);

	return (
		<div
			className={cn(
				"absolute inset-0 z-0 mx-auto aspect-[1/1] w-full max-w-[600px]",
				className
			)}
		>
			<canvas
				className={cn(
					"size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
				)}
				onMouseMove={(e) => updateMovement(e.clientX)}
				onPointerDown={(e) => {
					pointerInteracting.current = e.clientX;
					updatePointerInteraction(e.clientX);
				}}
				onPointerOut={() => updatePointerInteraction(null)}
				onPointerUp={() => updatePointerInteraction(null)}
				onTouchMove={(e) =>
					e.touches[0] && updateMovement(e.touches[0].clientX)
				}
				ref={canvasRef}
			/>
		</div>
	);
}
