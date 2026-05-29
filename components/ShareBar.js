// components/ShareBar.js
import { useState } from "react";

export default function ShareBar({ lie, daysLeft, accent }) {
  const [copied, setCopied] = useState(false);

  if (!lie) return null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lieoftheday.com";
  const shareText = `📋 Lie of the Day — ${daysLeft} days until the 2028 election\n\nTopic: ${lie.topic}\n\n"${lie.quote.slice(0, 120)}${lie.quote.length > 120 ? "…" : ""}"\n\n${lie.verdict.slice(0, 100)}…\n\nSource: ${lie.source}`;
  const twitterText = encodeURIComponent(
    `📋 #LieOfTheDay · ${daysLeft} days to 2028\n\nTopic: ${lie.topic} ${lie.topicEmoji || ""}\n\n"${lie.quote.slice(0, 100)}${lie.quote.length > 100 ? "…" : ""}"\n\nFact: ${lie.rating}\n\n${siteUrl}`
  );
  const facebookUrl = encodeURIComponent(siteUrl);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${siteUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const btnBase = {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    padding: "9px 18px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.05em",
    cursor: "pointer",
    textDecoration: "none",
    border: "1px solid transparent",
    transition: "all 0.2s ease",
    fontFamily: "'Georgia', serif",
  };

  return (
    <div>
      <div style={{
        fontSize: "10px",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: "#555",
        marginBottom: "12px",
        textAlign: "center",
      }}>Share Today's Lie</div>

      <div style={{
        display: "flex",
        gap: "10px",
        justifyContent: "center",
        flexWrap: "wrap",
      }}>
        {/* X / Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?text=${twitterText}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...btnBase,
            background: "#000",
            color: "#fff",
            border: "1px solid #333",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#1a1a1a"}
          onMouseLeave={e => e.currentTarget.style.background = "#000"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.737-8.84L1.254 2.25H8.08l4.264 5.638 5.9-5.638Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Post on X
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${facebookUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...btnBase,
            background: "#1877f2",
            color: "#fff",
            border: "1px solid #1877f2",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#1565d8"}
          onMouseLeave={e => e.currentTarget.style.background = "#1877f2"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Share
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          style={{
            ...btnBase,
            background: copied ? `${accent}20` : "rgba(255,255,255,0.04)",
            color: copied ? accent : "#888",
            border: `1px solid ${copied ? accent + "60" : "rgba(255,255,255,0.1)"}`,
          }}
        >
          {copied ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              Copy Link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
