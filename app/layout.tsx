import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import SmoothScrolling from "./components/SmoothScrolling";
import Navbar from "./components/Navbar";

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
        <Navbar />
        <SmoothScrolling>{children}</SmoothScrolling>
        
        {/* Analytics Component - Runs on client side automatically */}
        <Analytics />
      </body>
    </html>
  );
}