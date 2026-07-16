import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";
export const alt = "Rahul Sharma — Full Stack & AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#000000",
          padding: "72px 80px",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Background grid ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* ── Red accent line top-left ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 80,
            width: 60,
            height: 3,
            backgroundColor: "#dc2626",
          }}
        />

        {/* ── Corner brackets ── */}
        {/* top-left */}
        <div style={{ position: "absolute", top: 32, left: 40, display: "flex" }}>
          <div style={{ width: 20, height: 2, backgroundColor: "rgba(255,255,255,0.25)" }} />
        </div>
        <div style={{ position: "absolute", top: 32, left: 40, display: "flex" }}>
          <div style={{ width: 2, height: 20, backgroundColor: "rgba(255,255,255,0.25)" }} />
        </div>
        {/* top-right */}
        <div style={{ position: "absolute", top: 32, right: 40, display: "flex" }}>
          <div style={{ width: 20, height: 2, backgroundColor: "rgba(255,255,255,0.25)" }} />
        </div>
        <div style={{ position: "absolute", top: 32, right: 40, display: "flex", flexDirection: "row-reverse" }}>
          <div style={{ width: 2, height: 20, backgroundColor: "rgba(255,255,255,0.25)" }} />
        </div>
        {/* bottom-left */}
        <div style={{ position: "absolute", bottom: 32, left: 40, display: "flex" }}>
          <div style={{ width: 20, height: 2, backgroundColor: "rgba(255,255,255,0.25)" }} />
        </div>
        <div style={{ position: "absolute", bottom: 32, left: 40, display: "flex", alignItems: "flex-end" }}>
          <div style={{ width: 2, height: 20, backgroundColor: "rgba(255,255,255,0.25)" }} />
        </div>
        {/* bottom-right */}
        <div style={{ position: "absolute", bottom: 32, right: 40, display: "flex", flexDirection: "row-reverse" }}>
          <div style={{ width: 20, height: 2, backgroundColor: "rgba(255,255,255,0.25)" }} />
        </div>
        <div style={{ position: "absolute", bottom: 32, right: 40, display: "flex", flexDirection: "row-reverse", alignItems: "flex-end" }}>
          <div style={{ width: 2, height: 20, backgroundColor: "rgba(255,255,255,0.25)" }} />
        </div>

        {/* ── Top badge ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative", zIndex: 1 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#dc2626" }} />
          <span
            style={{
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#dc2626",
            }}
          >
            Portfolio — 2026
          </span>
        </div>

        {/* ── Main content ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative", zIndex: 1 }}>
          {/* Name */}
          <div
            style={{
              fontSize: "96px",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
            }}
          >
            Rahul Sharma
          </div>

          {/* Role */}
          <div
            style={{
              fontSize: "28px",
              fontWeight: 400,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.05em",
            }}
          >
            Full Stack &amp; AI Engineer
          </div>

          {/* Chips */}
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            {["Machine Learning", "Robotics", "Next.js", "Python"].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "6px 16px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "2px",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              padding: "10px 28px",
              backgroundColor: "#dc2626",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#ffffff",
            }}
          >
            View Projects →
          </div>

          <div
            style={{
              fontSize: "14px",
              fontWeight: 500,
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            rahul.aishtrex.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
