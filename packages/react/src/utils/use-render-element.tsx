/** biome-ignore-all lint/suspicious/noExplicitAny: works well here */

import type { JSX } from "react";
import * as React from "react";

type IntrinsicTag = keyof JSX.IntrinsicElements;

type ClassName<State> = string | ((state: State) => string);

type RenderFn<Props, State> = (
	props: Props,
	state: State
) => React.ReactElement;

interface RenderProps<State, Tag extends IntrinsicTag> {
	render?: React.ReactElement | RenderFn<JSX.IntrinsicElements[Tag], State>;
	className?: ClassName<State>;
	asChild?: boolean;
}

interface RenderParams<State, Tag extends IntrinsicTag> {
	state?: State;
	ref?: React.Ref<any>;
	props?: Partial<JSX.IntrinsicElements[Tag]>;
	enabled?: boolean;
}

function Slot({
	children,
	...props
}: {
	children: React.ReactElement;
	[key: string]: any;
}) {
	return React.cloneElement(children, {
		...props,
		className: [(children.props as any).className, props.className]
			.filter(Boolean)
			.join(" "),
	} as any);
}

export function useRenderElement<
	State extends Record<string, any>,
	Tag extends IntrinsicTag,
>(
	tag: Tag,
	componentProps: RenderProps<State, Tag>,
	params?: RenderParams<State, Tag>
): React.ReactElement | null {
	const { render, className: classNameProp, asChild = false } = componentProps;

	const {
		state = {} as State,
		ref,
		props = {} as Partial<JSX.IntrinsicElements[Tag]>,
		enabled = true,
	} = params || {};

	if (!enabled) {
		return null;
	}

	const computedClassName =
		typeof classNameProp === "function" ? classNameProp(state) : classNameProp;

	const mergedProps = {
		...props,
		className: [props.className, computedClassName].filter(Boolean).join(" "),
		ref,
	};

	if (typeof render === "function") {
		return render(mergedProps as JSX.IntrinsicElements[Tag], state);
	}

	if (React.isValidElement(render)) {
		return React.cloneElement(render, {
			...mergedProps,
			ref: (render as any).ref || ref,
		});
	}

	if (asChild && React.isValidElement(props.children)) {
		return <Slot {...mergedProps}>{props.children}</Slot>;
	}

	return React.createElement(tag, mergedProps as any);
}
