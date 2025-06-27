import type React from "react";
import { cn } from "@/lib/utils";

export type IconVariant = "default" | "filled";

export type IconName = "sidebar" | "command" | "check" | "x";

export interface IconProps {
	name: IconName;
	variant?: IconVariant;
	className?: string;
}

const iconRegistry: Record<IconName, Record<IconVariant, string>> = {
	sidebar: {
		default:
			"M9 2L9 22M10 22H14C16.8003 22 18.2004 22 19.27 21.455C20.2108 20.9757 20.9757 20.2108 21.455 19.27C22 18.2004 22 16.8003 22 14V10C22 7.19974 22 5.79961 21.455 4.73005C20.9757 3.78924 20.2108 3.02433 19.27 2.54497C18.2004 2 16.8003 2 14 2H10C7.19974 2 5.79961 2 4.73005 2.54497C3.78924 3.02433 3.02433 3.78924 2.54497 4.73005C2 5.79961 2 7.19974 2 10V14C2 16.8003 2 18.2004 2.54497 19.27C3.02433 20.2108 3.78924 20.9757 4.73005 21.455C5.79961 22 7.19974 22 10 22Z",
		filled:
			"M9.25 2.58333C9.25 2.27334 9.25 2.11835 9.21593 1.99118C9.12346 1.64609 8.85391 1.37654 8.50882 1.28407C8.38165 1.25 8.22666 1.25 7.91667 1.25C6.36671 1.25 5.59174 1.25 4.9559 1.42037C3.23044 1.88271 1.88271 3.23044 1.42037 4.9559C1.25 5.59174 1.25 6.36671 1.25 7.91667V16.0833C1.25 17.6333 1.25 18.4083 1.42037 19.0441C1.88271 20.7696 3.23044 22.1173 4.9559 22.5796C5.59174 22.75 6.36671 22.75 7.91667 22.75C8.22666 22.75 8.38165 22.75 8.50882 22.7159C8.85391 22.6235 9.12346 22.3539 9.21593 22.0088C9.25 21.8817 9.25 21.7267 9.25 21.4167L9.25 2.58333ZM10.75 21.15C10.75 21.7101 10.75 21.9901 10.859 22.204C10.9549 22.3922 11.1078 22.5451 11.296 22.641C11.5099 22.75 11.7899 22.75 12.35 22.75H14.75C17.5503 22.75 18.9504 22.75 20.02 22.205C20.9608 21.7257 21.7257 20.9608 22.205 20.02C22.75 18.9504 22.75 17.5503 22.75 14.75V9.25C22.75 6.44974 22.75 5.04961 22.205 3.98005C21.7257 3.03924 20.9608 2.27433 20.02 1.79497C18.9504 1.25 17.5503 1.25 14.75 1.25H12.35C11.7899 1.25 11.5099 1.25 11.296 1.35899C11.1078 1.45487 10.9549 1.60785 10.859 1.79601C10.75 2.00992 10.75 2.28995 10.75 2.85L10.75 21.15Z",
	},
	command: {
		default:
			"M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3",
		filled:
			"M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3",
	},
	check: {
		default: "M4 13L9 18L20 6",
		filled: "M4 13L9 18L20 6",
	},
	x: {
		default: "M6 18L18 6M6 6L18 18",
		filled: "M6 18L18 6M6 6L18 18",
	},
};

const getIconPath = (name: IconName, variant: IconVariant): string => {
	return iconRegistry[name]?.[variant] || iconRegistry[name]?.default || "";
};

const getIconType = (variant: IconVariant) => {
	return variant === "filled" ? "filled" : "stroked";
};

export const Icon: React.FC<IconProps> = ({
	name,
	variant = "default",
	className,
}) => {
	const path = getIconPath(name, variant);
	const iconType = getIconType(variant);

	if (!path) {
		console.warn(`Icon "${name}" with variant "${variant}" not found`);
		return null;
	}

	return (
		<svg
			className={cn("size-4", className)}
			fill="none"
			height="24"
			viewBox="0 0 24 24"
			width="24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>{name}</title>
			{iconType === "filled" ? (
				<path
					clipRule="evenodd"
					d={path}
					fill="currentColor"
					fillRule="evenodd"
				/>
			) : (
				<path
					d={path}
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.5"
				/>
			)}
		</svg>
	);
};

export type AddNewIconTemplate = {
	[key: string]: {
		default: string;
		filled: string;
	};
};

export default Icon;
