import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
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
        className={`${geistSans.variable} ${geistMono.variable} ${F37Stout.variable} group/body overscroll-none antialiased`}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
