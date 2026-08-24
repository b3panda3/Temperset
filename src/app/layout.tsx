import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Temperset — Temperature, Translated.",
  description:
    "The Operating System for Heat. Temperset translates FortyGuard's hyperlocal temperature intelligence into decisions for every role — logistics, data centers, architects, city planners, and more.",
  keywords: [
    "Temperset",
    "FortyGuard",
    "Temperature API",
    "Heat Intelligence",
    "Urban Heat",
    "Climate AI",
    "Hackathon 2026",
  ],
  authors: [{ name: "Temperset Team" }],
  openGraph: {
    title: "Temperset — Temperature, Translated.",
    description:
      "One temperature. Infinite decisions. The role-aware thermal intelligence platform built on FortyGuard.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
