import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import SmoothScrolling from "./components/SmoothScrolling";
import Navbar from "./components/Navbar";
import SecretSketchbook from "./components/SecretSketchbook"; // <--- 1. IMPORT

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rahul Sharma | Portfolio",
  description: "Full Stack & AI Engineer. Engineering intelligence into design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SmoothScrolling>
          <Navbar />
          {children}
        </SmoothScrolling>

        {/* 2. ADD COMPONENT HERE (It's invisible until triggered) */}
        <SecretSketchbook />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}