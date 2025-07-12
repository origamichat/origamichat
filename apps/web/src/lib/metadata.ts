import type { Metadata } from "next";

const defaultMetadata: Metadata = {
	title: {
		default: "Cossistant - Open-Source AI and Human support framework",
		template: "%s | Cossistant",
	},
	description:
		"Cossistant is the open-source support framework that puts human and AI help right in your React app with custom actions and UI.",
	keywords: [
		"AI support",
		"human-AI support",
		"react support framework",
		"open source support",
		"custom AI actions",
		"react component",
		"customer support framework",
		"AI agent support",
	],
	authors: [{ name: "Cossistant Team" }],
	creator: "Cossistant",
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_URL || "https://cossistant.com"
	),
	icons: {
		icon: [
			{
				url: "/favicon.svg",
				type: "image/svg+xml",
			},
			{
				url: "/icon-light.svg",
				media: "(prefers-color-scheme: light)",
			},
			{
				url: "/icon-dark.svg",
				media: "(prefers-color-scheme: dark)",
			},
		],
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "/",
		siteName: "Cossistant",
		title: "Cossistant - AI and Human <Support /> right in your app",
		description:
			"Cossistant is the open-source support framework that puts human and AI help right in your React app with custom actions and UI.",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Cossistant - Open-Source AI and Human Support Framework",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Cossistant - AI and Human <Support /> right in your app",
		description:
			"Cossistant is the open-source support framework that puts human and AI help right in your React app with custom actions and UI.",
		images: ["/og-image.png"],
		creator: "@cossistant",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
		},
		"max-video-preview": -1,
		"max-image-preview": "large",
		"max-snippet": -1,
	},
	alternates: {
		canonical: "/",
	},
};

type GenerateMetadataOptions = {
	title?: string;
	description?: string;
	path?: string;
	image?: string;
	noIndex?: boolean;
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Ok
export function generateSiteMetadata({
	title,
	description,
	path = "/",
	image,
	noIndex = false,
}: GenerateMetadataOptions = {}): Metadata {
	const metadata: Metadata = {
		...defaultMetadata,
		robots: noIndex
			? {
					index: false,
					follow: false,
					nocache: true,
					googleBot: {
						index: false,
						follow: false,
					},
				}
			: defaultMetadata.robots,
	};

	if (title) {
		metadata.title = title;
		if (metadata.openGraph) {
			metadata.openGraph.title = title;
		}
		if (metadata.twitter) {
			metadata.twitter.title = title;
		}
	}

	if (description) {
		metadata.description = description;
		if (metadata.openGraph) {
			metadata.openGraph.description = description;
		}
		if (metadata.twitter) {
			metadata.twitter.description = description;
		}
	}

	if (path && metadata.alternates) {
		metadata.alternates.canonical = path;
		if (metadata.openGraph) {
			metadata.openGraph.url = path;
		}
	}

	if (image) {
		const imageUrl = image.startsWith("http")
			? image
			: `${process.env.NEXT_PUBLIC_URL || "https://cossistant.com"}${image}`;
		if (metadata.openGraph?.images) {
			metadata.openGraph.images = [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: typeof title === "string" ? title : "Cossistant",
				},
			];
		}
		if (metadata.twitter) {
			metadata.twitter.images = [imageUrl];
		}
	}

	return metadata;
}
