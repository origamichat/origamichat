import { Button, type ButtonProps } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export function BaseSubmitButton({
	children,
	isSubmitting,
	disabled,
	...props
}: {
	children: React.ReactNode;
	isSubmitting: boolean;
	disabled?: boolean;
} & ButtonProps) {
	return (
		<Button
			disabled={isSubmitting || disabled}
			{...props}
			className={cn(props.className, "relative")}
		>
			<span
				className={cn("flex items-center gap-2 ", {
					"opacity-0": isSubmitting,
				})}
			>
				{children}
			</span>

			{isSubmitting && (
				<span className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
					<Spinner />
				</span>
			)}
		</Button>
	);
}
