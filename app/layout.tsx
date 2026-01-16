import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Or your preferred font
import "./globals.css";
import SmoothScrolling from "./components/SmoothScrolling"; // IMPORT THIS

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rahul Sharma | Portfolio",
  description: "Immersive Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* WRAP CHILDREN HERE */}
        <SmoothScrolling>{children}</SmoothScrolling>
      </body>
    </html>
  );
}