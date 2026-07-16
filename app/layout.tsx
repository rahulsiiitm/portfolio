import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local"; // 1. Import localFont
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import SmoothScrolling from "./components/SmoothScrolling";
import Navbar from "./components/Navbar";
import ChatWidget from "./components/Chatbot/ChatWidget";
import JsonLd from "./components/JsonLd";
// import Preloader from "./components/Preloader";

const inter = Inter({ subsets: ["latin"] });

// 2. Configure Ammonite
const ammonite = localFont({
  src: "./fonts/Ammonite.otf", // Make sure this matches your file name/extension exactly
  variable: "--font-ammonite",
  display: "swap",
});

const BASE_URL = "https://rahul.aishtrex.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Rahul Sharma | Full Stack & AI Engineer",
    template: "%s | Rahul Sharma",
  },
  description: "Full Stack & AI Engineer specializing in machine learning, robotics, and modern web development. Building intelligent products that merge deep learning with clean interfaces.",
  keywords: ["Full Stack Developer", "AI Engineer", "Machine Learning", "Robotics", "React", "Next.js", "Python", "TensorFlow"],
  authors: [{ name: "Rahul Sharma", url: BASE_URL }],
  creator: "Rahul Sharma",
  category: "technology",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "Rahul Sharma | Full Stack & AI Engineer",
    description: "Engineering intelligence into design. Portfolio of AI and full-stack projects.",
    url: BASE_URL,
    siteName: "Rahul Sharma Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/profile.jpg",
        width: 1200,
        height: 630,
        alt: "Rahul Sharma — Full Stack & AI Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahul Sharma | Full Stack & AI Engineer",
    description: "Engineering intelligence into design.",
    images: ["/profile.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        <JsonLd />
        {/* <Preloader /> */}
        <SmoothScrolling>
          <Navbar />
          {children}
        </SmoothScrolling>
        <ChatWidget />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}