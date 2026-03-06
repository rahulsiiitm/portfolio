import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local"; // 1. Import localFont
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import SmoothScrolling from "./components/SmoothScrolling";
import Navbar from "./components/Navbar";
// import Preloader from "./components/Preloader";

const inter = Inter({ subsets: ["latin"] });

// 2. Configure Ammonite
const ammonite = localFont({
  src: "./fonts/Ammonite.otf", // Make sure this matches your file name/extension exactly
  variable: "--font-ammonite",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rahul Sharma | Full Stack & AI Engineer",
  description: "Full Stack & AI Engineer specializing in machine learning, robotics, and modern web development. Building intelligent products that merge deep learning with clean interfaces.",
  keywords: ["Full Stack Developer", "AI Engineer", "Machine Learning", "Robotics", "React", "Next.js", "Python", "TensorFlow"],
  authors: [{ name: "Rahul Sharma" }],
  openGraph: {
    title: "Rahul Sharma | Full Stack & AI Engineer",
    description: "Engineering intelligence into design. Portfolio of AI and full-stack projects.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahul Sharma | Full Stack & AI Engineer",
    description: "Engineering intelligence into design.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 3. Inject the variable into the body tag */}
      <body className={`${inter.className} ${ammonite.variable}`}>
        {/* <Preloader /> */}
        <SmoothScrolling>
          <Navbar />
          {children}
        </SmoothScrolling>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}