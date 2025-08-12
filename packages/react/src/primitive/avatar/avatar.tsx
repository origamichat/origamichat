import * as React from "react";
import { useRenderElement } from "../../hooks/use-render-element";

interface AvatarState {
	imageLoadingStatus: "idle" | "loading" | "loaded" | "error";
}

export interface AvatarProps
	extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
	children?: React.ReactNode;
	asChild?: boolean;
	className?: string;
}

export interface AvatarContextValue extends AvatarState {
	onImageLoadingStatusChange: (
		status: AvatarState["imageLoadingStatus"]
	) => void;
}

const AvatarContext = React.createContext<AvatarContextValue | null>(null);

export const useAvatarContext = () => {
	const context = React.useContext(AvatarContext);
	if (!context) {
		throw new Error(
			"Avatar compound components cannot be rendered outside the Avatar component"
		);
	}
	return context;
};

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
	({ children, className, asChild = false, ...props }, ref) => {
		const [imageLoadingStatus, setImageLoadingStatus] =
			React.useState<AvatarState["imageLoadingStatus"]>("idle");

		const contextValue: AvatarContextValue = React.useMemo(
			() => ({
				imageLoadingStatus,
				onImageLoadingStatusChange: setImageLoadingStatus,
			}),
			[imageLoadingStatus]
		);

		const state: AvatarState = {
			imageLoadingStatus,
		};

		return (
			<AvatarContext.Provider value={contextValue}>
				{useRenderElement(
					"div",
					{
						asChild,
						className,
					},
					{
						ref,
						state,
						props: {
							...props,
							children,
						},
					}
				)}
			</AvatarContext.Provider>
		);
	}
);

Avatar.displayName = "Avatar";
