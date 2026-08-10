import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import localFont from "next/font/local";
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
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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
    description: "Engineering intelligence into design — portfolio of AI and full-stack projects.",
    url: BASE_URL,
    siteName: "Rahul Sharma",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: OG_IMAGE,
        secureUrl: OG_IMAGE,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Rahul Sharma — Full Stack & AI Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahul Sharma | Full Stack & AI Engineer",
    description: "Engineering intelligence into design.",
    images: [OG_IMAGE],
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
  themeColor: "#000000",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {GA_MEASUREMENT_ID ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        ) : null}
      </head>
      <body className={`${manrope.className} ${interHeadings.variable} ${ammonite.variable}`}>
        <JsonLd />
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}