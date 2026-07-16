import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent MIME-type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Allow iframing only from same origin (prevents clickjacking)
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // Control referrer information
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Restrict browser feature access
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // DNS prefetch for performance
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // Force HTTPS for 1 year (enable only after confirming HTTPS works)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: self + Vercel Analytics/Insights
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vercel.live",
      // Styles: self + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts: self + Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + data URIs (for canvas) + blob
      "img-src 'self' data: blob:",
      // Media: self (for audio files)
      "media-src 'self'",
      // Connections: self + AI API providers + Vercel
      "connect-src 'self' https://api.x.ai https://generativelanguage.googleapis.com https://vitals.vercel-insights.com https://va.vercel-scripts.com",
      // Frames: YouTube only (for project demo iframes)
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
      // Workers
      "worker-src 'self' blob:",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
