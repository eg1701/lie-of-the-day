// pages/api/og.js
// Generates a dynamic OG image as PNG using @vercel/og

import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const quote = (searchParams.get("quote") || "One documented Trump falsehood per day.").slice(0, 120);
  const topic = searchParams.get("topic") || "Politics";
  const rating = searchParams.get("rating") || "FALSE";
  const days = searchParams.get("days") || "886";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #0a0d1a 0%, #0d1530 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "0",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Red top bar */}
        <div style={{ width: "1200px", height: "10px", background: "#BF0A30", display: "flex" }} />

        {/* Left red accent */}
        <div style={{
          position: "absolute",
          left: "60px",
          top: "80px",
          width: "6px",
          height: "470px",
          background: "#BF0A30",
          borderRadius: "3px",
          display: "flex",
        }} />

        <div style={{ padding: "40px 90px", display: "flex", flexDirection: "column", flex: 1 }}>
          {/* Days */}
          <div style={{ fontSize: "26px", color: "#4a6fa5", letterSpacing: "3px", marginBottom: "20px", display: "flex" }}>
            ⏳ {days} DAYS UNTIL 2028 ELECTION
          </div>

          {/* Title */}
          <div style={{ fontSize: "80px", fontWeight: "900", color: "#BF0A30", lineHeight: 1, marginBottom: "20px", display: "flex" }}>
            LIE OF THE DAY
          </div>

          {/* Topic | Rating */}
          <div style={{ fontSize: "28px", color: "#8899bb", marginBottom: "20px", display: "flex" }}>
            {topic}  ·  {rating}
          </div>

          {/* Divider */}
          <div style={{ width: "1020px", height: "2px", background: "#002868", opacity: 0.6, marginBottom: "24px", display: "flex" }} />

          {/* Quote */}
          <div style={{
            fontSize: "30px",
            color: "#e8eaf0",
            fontStyle: "italic",
            lineHeight: 1.5,
            flex: 1,
            display: "flex",
            alignItems: "flex-start",
          }}>
            "{quote}{quote.length >= 120 ? "…" : ""}"
          </div>

          {/* Domain */}
          <div style={{ fontSize: "24px", color: "#4a6fa5", display: "flex" }}>
            trumplieoftheday.com
          </div>
        </div>

        {/* Blue bottom bar */}
        <div style={{ width: "1200px", height: "10px", background: "#002868", display: "flex" }} />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
