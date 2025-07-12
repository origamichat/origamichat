/** biome-ignore-all lint/a11y/noSvgWithoutTitle: no needed */
import { ImageResponse } from "next/og";

async function loadAssets(): Promise<
	{ name: string; data: Buffer; weight: 400 | 600; style: "normal" }[]
> {
	const [
		{ base64Font: normal },
		{ base64Font: mono },
		{ base64Font: semibold },
	] = await Promise.all([
		import("./geist-regular-otf.json").then((mod) => mod.default || mod),
		import("./geistmono-regular-otf.json").then((mod) => mod.default || mod),
		import("./geist-semibold-otf.json").then((mod) => mod.default || mod),
	]);

	return [
		{
			name: "Geist",
			data: Buffer.from(normal, "base64"),
			weight: 400 as const,
			style: "normal" as const,
		},
		{
			name: "Geist Mono",
			data: Buffer.from(mono, "base64"),
			weight: 400 as const,
			style: "normal" as const,
		},
		{
			name: "Geist",
			data: Buffer.from(semibold, "base64"),
			weight: 600 as const,
			style: "normal" as const,
		},
	];
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const title = searchParams.get("title");
	const description = searchParams.get("description");

	const [fonts] = await Promise.all([loadAssets()]);

	return new ImageResponse(
		<div
			style={{ fontFamily: "Geist Sans" }}
			tw="flex h-full w-full bg-black text-white"
		>
			<div tw="flex border absolute border-white/10 border-dotted inset-y-0 right-16 w-[1px]" />
			<div tw="flex border absolute border-white/10 border-dotted inset-y-0 right-[165px] w-[1px]" />
			<div tw="flex border absolute border-white/10 border-dotted inset-x-0 h-[1px] bottom-16" />
			<div tw="flex border absolute border-white/10 border-dotted inset-x-0 h-[1px] bottom-[148px]" />
			<div tw="flex absolute flex-row bottom-16 right-16 text-white">
				<svg
					fill="none"
					height="83"
					viewBox="0 0 101 83"
					width="101"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						clipRule="evenodd"
						d="M100.852 17.6353V82.75H18.8128L0 65.3085V17.6353L18.8128 0H82.0388L100.852 17.6353ZM23.3223 28.4363C22.2199 28.4363 21.1654 28.8869 20.4033 29.6835L17.1462 33.0882C16.4201 33.8473 16.0181 34.8594 16.0256 35.9098L16.0785 43.2495H23.3014L23.2367 39.3593C23.2367 36.5163 23.9144 35.9793 26.926 35.9793H33.5369C36.5486 35.9793 36.9974 36.5163 36.9974 39.5836V43.2495H44.2938V35.9084C44.2938 34.8588 43.8853 33.8504 43.1548 33.0967L39.8283 29.6645C39.0674 28.8794 38.0207 28.4363 36.9273 28.4363H23.3223ZM59.682 28.4363C58.5795 28.4363 57.5248 28.8868 56.7626 29.6835L53.5056 33.0882C52.7795 33.8473 52.3775 34.8594 52.385 35.9098L52.4379 43.2495H59.6611L59.5964 39.3593C59.5964 36.5163 60.274 35.9793 63.2857 35.9793H69.8966C72.9081 35.9794 73.3568 36.5163 73.3568 39.5836V43.2495H80.6534V35.9084C80.6534 34.8588 80.2447 33.8504 79.5142 33.0967L76.1877 29.6645C75.4267 28.8795 74.38 28.4363 73.2867 28.4363H59.682Z"
						fill="white"
						fillRule="evenodd"
					/>
				</svg>
			</div>
			<div tw="flex flex-col absolute w-[896px] inset-16">
				<div
					style={{
						textWrap: "balance",
						fontWeight: 600,
						fontSize: title && title.length > 20 ? 54 : 70,
						letterSpacing: "-0.04em",
						marginBottom: 16,
					}}
					tw="tracking-tight grow-0 flex flex-col justify-center leading-[1.1]"
				>
					{title}
				</div>
				<div
					style={{
						fontWeight: 500,
						textWrap: "balance",
					}}
					tw="text-[40px] leading-[1.5] grow-0 text-stone-400"
				>
					{description}
				</div>
			</div>
		</div>,
		{
			width: 1200,
			height: 630,
			fonts,
		}
	);
}
