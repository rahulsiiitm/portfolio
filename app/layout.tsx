import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import JsonLd from "./components/JsonLd";
import SiteChrome from "./components/SiteChrome";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const interHeadings = Inter({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-inter-headings",
  display: "swap",
});

const ammonite = localFont({
  src: "./fonts/Ammonite.otf",
  variable: "--font-ammonite",
  display: "swap",
});

const BASE_URL = "https://rahul.aishtrex.com";
const OG_IMAGE = `${BASE_URL}/opengraph-image`;
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-QEZQ8Y5GE1";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Rahul Sharma | Full Stack & AI Engineer",
    template: "%s | Rahul Sharma",
  },
  description: "Full Stack & AI Engineer — machine learning, robotics & modern web. Building intelligent products that merge deep learning with clean UI.",
  keywords: ["Full Stack Developer", "AI Engineer", "Machine Learning", "Robotics", "React", "Next.js", "Python", "TensorFlow"],
  authors: [{ name: "Rahul Sharma", url: BASE_URL }],
  creator: "Rahul Sharma",
  category: "technology",
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: "Rahul Sharma | Full Stack & AI Engineer",
    description: "Full Stack & AI Engineer — machine learning, robotics & modern web. Building intelligent products that merge deep learning with clean UI.",
    url: BASE_URL,
    siteName: "Rahul Sharma Portfolio",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Rahul Sharma — Full Stack & AI Engineer" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahul Sharma | Full Stack & AI Engineer",
    description: "Full Stack & AI Engineer — machine learning, robotics & modern web. Building intelligent products that merge deep learning with clean UI.",
    images: [OG_IMAGE],
    creator: "@rahulsiiitm",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${manrope.className} ${interHeadings.variable} ${ammonite.variable}`}>
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                    send_page_view: true,
                    debug_mode: true
                  });
                `,
              }}
            />
          </>
        )}
        <JsonLd />
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}