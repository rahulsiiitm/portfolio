import { ImageResponse } from "next/og";

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
        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            top: "-200px",
            right: "-200px",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(220,38,38,0.18) 0%, rgba(220,38,38,0) 70%)",
            display: "flex",
          }}
        />

        {/* Grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Diagonal sheen */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1200px",
            height: "630px",
            background:
              "linear-gradient(115deg, rgba(255,255,255,0.05) 0%, transparent 25%)",
            display: "flex",
          }}
        />

        <div style={{ position: "absolute", top: 0, left: 80, width: 60, height: 3, backgroundColor: "#dc2626" }} />

        {/* Corner brackets */}
        <div style={{ position: "absolute", top: 32, left: 40, display: "flex" }}>
          <div style={{ width: 20, height: 2, backgroundColor: "rgba(255,255,255,0.25)" }} />
        </div>
        <div style={{ position: "absolute", top: 32, left: 40, display: "flex" }}>
          <div style={{ width: 2, height: 20, backgroundColor: "rgba(255,255,255,0.25)" }} />
        </div>
        <div style={{ position: "absolute", top: 32, right: 40, display: "flex" }}>
          <div style={{ width: 20, height: 2, backgroundColor: "rgba(255,255,255,0.25)" }} />
        </div>
        <div style={{ position: "absolute", top: 32, right: 40, display: "flex", flexDirection: "row-reverse" }}>
          <div style={{ width: 2, height: 20, backgroundColor: "rgba(255,255,255,0.25)" }} />
        </div>
        <div style={{ position: "absolute", bottom: 32, left: 40, display: "flex" }}>
          <div style={{ width: 20, height: 2, backgroundColor: "rgba(255,255,255,0.25)" }} />
        </div>
        <div style={{ position: "absolute", bottom: 32, left: 40, display: "flex", alignItems: "flex-end" }}>
          <div style={{ width: 2, height: 20, backgroundColor: "rgba(255,255,255,0.25)" }} />
        </div>
        <div style={{ position: "absolute", bottom: 32, right: 40, display: "flex", flexDirection: "row-reverse" }}>
          <div style={{ width: 20, height: 2, backgroundColor: "rgba(255,255,255,0.25)" }} />
        </div>
        <div style={{ position: "absolute", bottom: 32, right: 40, display: "flex", flexDirection: "row-reverse", alignItems: "flex-end" }}>
          <div style={{ width: 2, height: 20, backgroundColor: "rgba(255,255,255,0.25)" }} />
        </div>

        {/* Top row: badge + mark */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#dc2626" }} />
            <span style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#dc2626" }}>
              Portfolio — 2026
            </span>
          </div>

          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 800,
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "-0.02em",
            }}
          >
            RS
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "22px", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "104px", fontWeight: 900, color: "#ffffff", lineHeight: 0.88, letterSpacing: "-0.035em", display: "flex" }}>
            Rahul Sharma
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: 32, height: 2, backgroundColor: "#dc2626" }} />
            <span style={{ fontSize: "26px", fontWeight: 400, color: "rgba(255,255,255,0.6)", letterSpacing: "0.04em" }}>
              Full Stack &amp; AI Engineer
            </span>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
            {["Machine Learning", "Robotics", "Next.js", "Python"].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "7px 16px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderRadius: "2px",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                padding: "11px 28px",
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
          </div>

          <div style={{ fontSize: "14px", fontWeight: 500, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
            rahul.aishtrex.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}