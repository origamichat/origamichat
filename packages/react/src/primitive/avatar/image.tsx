import * as React from "react";
import { useRenderElement } from "../../hooks/use-render-element";
import { useAvatarContext } from "./avatar";

interface ImageState {
	imageLoadingStatus: "idle" | "loading" | "loaded" | "error";
}

export interface AvatarImageProps
	extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
	src: string;
	alt?: string;
	asChild?: boolean;
	className?: string;
	onLoadingStatusChange?: (status: ImageState["imageLoadingStatus"]) => void;
}

export const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
	(
		{
			src,
			alt = "",
			className,
			asChild = false,
			onLoadingStatusChange,
			...props
		},
		ref
	) => {
		const { imageLoadingStatus, onImageLoadingStatusChange } =
			useAvatarContext();

		const imageRef = React.useRef<HTMLImageElement>(null);
		// biome-ignore lint/style/noNonNullAssertion: ok
		React.useImperativeHandle(ref, () => imageRef.current!);

		const updateImageLoadingStatus = React.useCallback(
			(status: ImageState["imageLoadingStatus"]) => {
				onImageLoadingStatusChange(status);
				onLoadingStatusChange?.(status);
			},
			[onImageLoadingStatusChange, onLoadingStatusChange]
		);

		React.useLayoutEffect(() => {
			if (!src) {
				updateImageLoadingStatus("error");
				return;
			}

			let isMounted = true;
			const image = new Image();

			const updateStatus = (status: ImageState["imageLoadingStatus"]) => {
				if (!isMounted) {
					return;
				}
				updateImageLoadingStatus(status);
			};

			updateStatus("loading");

			image.onload = () => updateStatus("loaded");
			image.onerror = () => updateStatus("error");
			image.src = src;

			return () => {
				isMounted = false;
			};
		}, [src, updateImageLoadingStatus]);

		const state: ImageState = {
			imageLoadingStatus,
		};

		return useRenderElement(
			"img",
			{
				asChild,
				className,
			},
			{
				ref: imageRef,
				state,
				enabled: imageLoadingStatus === "loaded",
				props: {
					...props,
					src,
					alt,
				},
			}
		);
	}
);

AvatarImage.displayName = "AvatarImage";
