import { ComponentPreviewTabs } from "@/components/component-preview-tabs";
import { ComponentSource } from "@/components/component-source";
import { Index } from "@/registry/__index__";

export function ComponentPreview({
	name,
	className,
	align = "center",
	withOrnament,
	sizeClasses,
}: React.ComponentProps<"div"> & {
	name: string;
	align?: "center" | "start" | "end";
	withOrnament?: boolean;
	sizeClasses?: string;
}) {
	const Component = Index[name]?.demoComponent || Index[name]?.component;

	if (!Component) {
		return (
			<p className="text-muted-foreground text-sm">
				Component{" "}
				<code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
					{name}
				</code>{" "}
				not found in registry.
			</p>
		);
	}

	return (
		<ComponentPreviewTabs
			align={align}
			className={className}
			component={<Component />}
			sizeClasses={sizeClasses}
			source={<ComponentSource name={name} />}
			withOrnament={withOrnament}
		/>
	);
}
