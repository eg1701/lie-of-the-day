// components/LieCard.js

const RATING_COLORS = {
  "PANTS ON FIRE": "#ff3b3b",
  "FALSE": "#e05252",
  "MOSTLY FALSE": "#e07a52",
  "HALF TRUE": "#e0b452",
  "MOSTLY TRUE": "#7ae052",
};

export default function LieCard({ lie, accent, revealed }) {
  if (!lie) return null;

  const ratingColor = RATING_COLORS[lie.rating?.toUpperCase()] || accent;

  return (
    <div style={{
      opacity: revealed ? 1 : 0,
      transform: revealed ? "translateY(0)" : "translateY(16px)",
      transition: "opacity 0.8s ease, transform 0.8s ease",
    }}>
      {/* Quote */}
      <div style={{ marginBottom: "32px" }}>
        <div style={sectionLabel}>What He Said</div>
        <blockquote style={{
          margin: 0,
          padding: "22px 26px",
          borderLeft: `4px solid ${accent}`,
          background: `${accent}08`,
          borderRadius: "0 10px 10px 0",
          fontStyle: "italic",
          fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
          lineHeight: 1.8,
          color: "#ddd8cc",
          transition: "border-color 0.8s ease, background 0.8s ease",
          position: "relative",
        }}>
          <span style={{
            position: "absolute",
            top: "-8px",
            left: "20px",
            fontSize: "4rem",
            color: `${accent}25`,
            fontFamily: "Georgia, serif",
            lineHeight: 1,
            pointerEvents: "none",
            transition: "color 0.8s ease",
          }}>"</span>
          {lie.quote}
        </blockquote>
      </div>

      {/* Rating badge */}
      {lie.rating && (
        <div style={{ marginBottom: "24px" }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: `${ratingColor}18`,
            border: `1px solid ${ratingColor}55`,
            color: ratingColor,
            borderRadius: "6px",
            padding: "5px 14px",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.2em",
          }}>
            ⚠ {lie.rating}
          </span>
        </div>
      )}

      {/* Context */}
      {lie.context && (
        <div style={{ marginBottom: "24px" }}>
          <div style={sectionLabel}>Context</div>
          <p style={bodyText}>{lie.context}</p>
        </div>
      )}

      {/* Divider */}
      <div style={{
        height: "1px",
        background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)",
        margin: "28px 0",
      }} />

      {/* Truth */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ ...sectionLabel, color: accent, transition: "color 0.8s ease" }}>
          The Truth
        </div>
        <p style={{ ...bodyText, color: "#c8c0b0" }}>{lie.verdict}</p>
      </div>

      {/* Source */}
      {lie.source && (
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "6px",
          padding: "7px 14px",
          fontSize: "12px",
          color: "#666",
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Documented by: <strong style={{ color: "#888" }}>{lie.source}</strong>
        </div>
      )}
    </div>
  );
}

const sectionLabel = {
  fontSize: "10px",
  letterSpacing: "0.35em",
  textTransform: "uppercase",
  color: "#555",
  marginBottom: "12px",
  fontFamily: "'Georgia', serif",
};

const bodyText = {
  margin: 0,
  fontSize: "0.95rem",
  color: "#999",
  lineHeight: 1.8,
};
