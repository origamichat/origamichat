import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { generateSiteMetadata } from "@/lib/metadata";
import { Providers } from "./providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
	display: "swap",
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
	display: "swap",
});

const F37Stout = localFont({
	src: [
		{
			path: "../../public/fonts/F37Stout-Regular.woff2",
			weight: "400",
			style: "normal",
		},
	],
	variable: "--font-f37-stout",
	display: "swap",
});

export const metadata = generateSiteMetadata();

export const viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	themeColor: [
		{ media: "(prefers-color-scheme: light)" },
		{ media: "(prefers-color-scheme: dark)" },
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${F37Stout.variable} group/body overscroll-none antialiased`}
			>
				<Providers>{children}</Providers>
				<Toaster />
				<Analytics />
			</body>
		</html>
	);
}
