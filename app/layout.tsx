import type { Metadata, Viewport } from "next"; // <--- 1. Import Viewport
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import SmoothScrolling from "./components/SmoothScrolling";
import Navbar from "./components/Navbar";
import SecretSketchbook from "./components/SecretSketchbook";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rahul Sharma | Portfolio",
  description: "Full Stack & AI Engineer. Engineering intelligence into design.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents accidental zoom interactions
  themeColor: "#000000",
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

        {/* Secret Easter Egg Component */}
        <SecretSketchbook />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}