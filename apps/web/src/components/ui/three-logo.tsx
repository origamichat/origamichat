"use client";

import { AsciiRenderer } from "@react-three/drei";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface ThreeLogoProps {
	className?: string;
}

function LogoPlane() {
	const meshRef = useRef<THREE.Mesh>(null);
	const { camera, size } = useThree();

	// Create SVG data URL
	const svgString = `
    <svg width="1355" height="210" viewBox="0 0 1355 210" xmlns="http://www.w3.org/2000/svg">
      <title>Cossistant Logo</title>
      <path
        d="M343.357 82.2021V116.814H320.283V98.0664C320.283 85.9523 312.207 79.0293 300.093 79.0293H275.865C262.597 79.0293 255.098 86.8175 255.098 99.7969V169.597C255.098 182.576 262.597 190.364 275.865 190.364H300.093C312.207 190.364 320.283 183.442 320.283 171.328V153.156H343.357V187.191L321.148 209.689H253.944L231.734 187.191V82.2021L253.944 59.7051H321.148L343.357 82.2021ZM485.31 87.6826V181.711L459.351 209.689H388.396L362.149 181.711V87.6826L388.396 59.7051H459.351L485.31 87.6826ZM614.289 82.2021V111.622H590.926V97.4893C590.926 85.6636 583.138 78.4531 571.312 78.4531H545.354C533.528 78.4533 526.317 85.6638 526.317 96.624V109.315L614.289 149.983V187.191L592.08 209.689H525.164L503.243 187.191V158.349H526.317V171.904C526.317 183.73 534.105 190.941 545.931 190.941H571.89C583.715 190.941 590.926 183.73 590.926 172.77V160.944L503.243 120.275V82.2021L525.164 59.7051H592.08L614.289 82.2021ZM746.542 82.2021V111.622H723.18V97.4893C723.18 85.6637 715.392 78.4532 703.566 78.4531H677.607C665.782 78.4531 658.571 85.6637 658.571 96.624V109.315L746.542 149.983V187.191L724.333 209.689H657.417L635.496 187.191V158.349H658.571V171.904C658.571 183.73 666.359 190.941 678.185 190.941H704.143C715.968 190.941 723.18 183.730 723.18 172.77V160.944L635.496 120.275V82.2021L657.417 59.7051H724.333L746.542 82.2021ZM791.672 209.689H768.598V59.7051H791.672V209.689ZM924.567 82.2021V111.622H901.204V97.4893C901.204 85.6636 893.416 78.4531 881.591 78.4531H855.633C843.807 78.4531 836.596 85.6637 836.596 96.624V109.315L924.567 149.983V187.191L902.358 209.689H835.442L813.521 187.191V158.349H836.596V171.904C836.596 183.73 844.383 190.941 856.209 190.941H882.168C893.994 190.941 901.204 183.73 901.204 172.77V160.944L813.521 120.275V82.2021L835.442 59.7051H902.358L924.567 82.2021ZM968.238 59.7051H1006.02V79.0303H968.238V165.848C968.238 181.423 976.026 189.787 990.159 189.787H1008.04V209.689H968.815L945.164 185.749V79.0303L945.163 59.7051L945.164 29.708H968.238V59.7051ZM1132.48 82.2021V209.689H1120.36L1112.58 196.421L1099.31 209.689H1043.64L1021.43 187.191V143.927L1043.64 121.718H1109.4V98.9316C1109.4 86.2407 1101.62 78.4532 1088.64 78.4531H1065.56C1053.74 78.4531 1045.95 85.6636 1045.95 97.4893V111.334H1022.58V82.2021L1044.79 59.7051H1110.56L1132.48 82.2021ZM1174.34 72.9727L1187.89 59.7051H1244.14L1270.38 87.6826V209.689H1247.31V107.584C1247.31 89.4132 1236.64 78.7414 1220.77 78.7412H1204.04C1188.18 78.7413 1177.51 89.4131 1177.51 107.584V209.689H1154.43V59.7051H1166.26L1174.34 72.9727ZM1314.49 59.7051H1352.28V79.0303H1314.49V165.848C1314.49 181.423 1322.28 189.787 1336.41 189.787H1354.3V209.689H1315.07L1291.42 185.749V79.0303L1291.42 59.7051L1291.42 29.708H1314.49V59.7051ZM1064.12 139.312C1051.72 139.312 1044.79 145.658 1044.79 156.618V173.059C1044.79 184.019 1051.43 190.941 1062.96 190.941H1083.73C1099.31 190.941 1109.4 180.845 1109.4 163.828V139.312H1064.12ZM414.067 79.0293C396.762 79.0293 385.513 89.9901 385.513 108.161V161.81C385.513 179.692 396.762 190.364 414.067 190.364H433.681C450.986 190.364 462.235 179.692 462.235 161.81V108.161C462.235 89.9901 450.986 79.0294 433.681 79.0293H414.067ZM800.036 19.6133L780.135 39.8037L759.944 19.6133L780.135 0L800.036 19.6133Z"
        fill="white"
      />
      <path
        d="M0.268813 91.3819L34.5395 59.2561L149.718 59.2561L183.988 91.3819L183.988 210L149.718 210L34.5395 210L0.268809 178.228L0.268813 91.3819Z"
        fill="white"
      />
      <path
        d="M95.6992 124.672L95.7955 138.043H108.954L108.836 130.956C108.836 125.777 110.07 124.799 115.556 124.799H127.599C133.086 124.799 133.903 125.777 133.903 131.364V138.043H147.195V124.669C147.195 122.757 146.451 120.92 145.12 119.547L139.06 113.295C137.674 111.865 135.767 111.057 133.775 111.057H108.992C106.983 111.057 105.062 111.878 103.674 113.33L97.7406 119.532C96.4177 120.914 95.6854 122.758 95.6992 124.672Z"
        fill="black"
      />
      <path
        d="M29.4619 124.672L29.5581 138.043H42.7162L42.5985 130.956C42.5985 125.777 43.8328 124.799 49.3191 124.799H61.362C66.8483 124.799 67.6657 125.777 67.6657 131.364V138.043H80.9576V124.669C80.9576 122.757 80.2134 120.92 78.8827 119.547L72.8228 113.295C71.4366 111.865 69.5299 111.057 67.5381 111.057H42.7545C40.746 111.057 38.8248 111.878 37.4364 113.33L31.5033 119.532C30.1804 120.914 29.4481 122.758 29.4619 124.672Z"
        fill="black"
      />
    </svg>
  `;

	// Create texture from SVG
	const texture = new THREE.Texture();

	useEffect(() => {
		const img = new Image();
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		if (!ctx) {
			return;
		}

		canvas.width = 1355;
		canvas.height = 210;

		const blob = new Blob([svgString], { type: "image/svg+xml" });
		const url = URL.createObjectURL(blob);

		img.onload = () => {
			if (ctx) {
				ctx.drawImage(img, 0, 0);
				texture.image = canvas;
				texture.needsUpdate = true;
				URL.revokeObjectURL(url);
			}
		};

		img.src = url;

		return () => {
			URL.revokeObjectURL(url);
		};
	}, [texture]);

	// Calculate plane size to fill the viewport
	const fov = (camera as THREE.PerspectiveCamera).fov;
	const distance = camera.position.z;
	const aspect = size.width / size.height;

	// Calculate the height and width that would fill the view
	const vFOV = (fov * Math.PI) / 180;
	const planeHeight = 2 * Math.tan(vFOV / 2) * distance;
	const planeWidth = planeHeight * aspect;

	return (
		<mesh position={[0, 0, 0]} ref={meshRef}>
			<planeGeometry args={[planeWidth, planeHeight]} />
			<meshBasicMaterial map={texture} transparent />
		</mesh>
	);
}

export function ThreeLogo({ className }: ThreeLogoProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [dimensions, setDimensions] = useState({ width: 1355, height: 210 });
	const { resolvedTheme } = useTheme();

	useEffect(() => {
		const updateDimensions = () => {
			if (containerRef.current) {
				const { width } = containerRef.current.getBoundingClientRect();
				// Maintain aspect ratio from viewBox (1355:210)
				const aspectRatio = 1355 / 210;
				const height = width / aspectRatio;
				setDimensions({ width, height });
			}
		};

		updateDimensions();
		window.addEventListener("resize", updateDimensions);
		return () => window.removeEventListener("resize", updateDimensions);
	}, []);

	return (
		<div className={className} ref={containerRef} style={{ width: "100%" }}>
			<Canvas
				camera={{ position: [0, 0, 10], fov: 75 }}
				dpr={[1, 2]}
				style={{ width: dimensions.width, height: dimensions.height }}
			>
				<LogoPlane />
				<AsciiRenderer
					bgColor="transparent"
					characters=" %%=*:+-% "
					fgColor={resolvedTheme === "dark" ? "white" : "black"}
					resolution={0.19}
				/>
			</Canvas>
		</div>
	);
}
