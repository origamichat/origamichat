import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cossistant.com"),
  title: "Cossistant | AI-powered chat for your business",
  description:
    "Cossistant is an AI-powered chat for your business. It's a tool that helps you manage your business and stay organized.",
  twitter: {
    title: "Cossistant | AI-powered chat for your business",
    description:
      "Cossistant is an AI-powered chat for your business. It's a tool that helps you manage your business and stay organized.",
    images: [
      // {
      //   url: "https://cdn.midday.ai/opengraph-image.jpg",
      //   width: 800,
      //   height: 600,
      // },
      // {
      //   url: "https://cdn.midday.ai/opengraph-image.jpg",
      //   width: 1800,
      //   height: 1600,
      // },
    ],
  },
  openGraph: {
    title: "Cossistant | AI-powered chat for your business",
    description:
      "Cossistant is an AI-powered chat for your business. It's a tool that helps you manage your business and stay organized.",
    url: "https://cossistant.com",
    siteName: "Cossistant",
    images: [
      // {
      //   url: "https://cdn.midday.ai/opengraph-image.jpg",
      //   width: 800,
      //   height: 600,
      // },
      // {
      //   url: "https://cdn.midday.ai/opengraph-image.jpg",
      //   width: 1800,
      //   height: 1600,
      // },
    ],
    locale: "en_US",
    type: "website",
  },
};

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
