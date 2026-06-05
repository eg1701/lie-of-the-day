// pages/index.js
import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import Countdown from "../components/Countdown";
import LieCard from "../components/LieCard";
import ShareBar from "../components/ShareBar";
import { getDaysUntilElection, getTopicForDay } from "../lib/constants";

const BG_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i / 18) * 100 + (Math.sin(i * 2.4) * 5)}%`,
  delay: `${(i * 0.7) % 9}s`,
  duration: `${8 + (i % 5) * 2.5}s`,
  size: `${4 + (i % 3) * 2}px`,
  opacity: 0.06 + (i % 4) * 0.03,
}));

export default function Home() {
  const [daysLeft, setDaysLeft] = useState(null);
  const [topic, setTopic] = useState(null);
  const [lie, setLie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const d = getDaysUntilElection();
    setDaysLeft(d);
    setTopic(getTopicForDay(d));
  }, []);

  const fetchLie = useCallback(async (refresh = false) => {
    setLoading(true);
    setError(null);
    setLie(null);
    setRevealed(false);
    try {
      const url = `/api/lie${refresh ? "?refresh=1" : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setLie(data);
      setTimeout(() => setRevealed(true), 80);
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (topic) fetchLie();
  }, [topic]);

  const accent = "#BF0A30"; // Republican red — dominant accent

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lieoftheday.com";
  const ogTitle = lie
    ? `Lie of the Day — ${daysLeft} days to 2028 · ${lie.topic}`
    : "Lie of the Day — Counting Down to 2028";
  const ogDesc = lie
    ? `"${lie.quote?.slice(0, 120)}${lie.quote?.length > 120 ? "…" : ""}" — ${lie.verdict?.slice(0, 100)}…`
    : "One documented Trump falsehood per day until the 2028 presidential election.";

  return (
    <>
      <Head>
        <title>{ogTitle}</title>
        <meta name="description" content={ogDesc} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDesc} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDesc} />
        <meta name="twitter:image" content={`${siteUrl}/api/og?days=${daysLeft}&topic=${encodeURIComponent(lie?.topic||'')}&rating=${encodeURIComponent(lie?.rating||'')}&quote=${encodeURIComponent(lie?.quote||'Trump Lie of the Day — Counting down to 2028')}`} />
        <meta property="og:image" content={`${siteUrl}/api/og?days=${daysLeft}&topic=${encodeURIComponent(lie?.topic||'')}&rating=${encodeURIComponent(lie?.rating||'')}&quote=${encodeURIComponent(lie?.quote||'Trump Lie of the Day — Counting down to 2028')}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,300;1,8..60,400&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="root">
        {/* Floating particles */}
        {BG_PARTICLES.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: p.duration,
              animationDelay: p.delay,
              background: accent,
              opacity: p.opacity,
            }}
          />
        ))}

        {/* Radial glow */}
        <div className="glow" style={{ background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${accent}12 0%, transparent 70%)` }} />

        <main className="main">
          {/* Header */}
          <header className="header">
            <div className="eyebrow">A Daily Record of Documented Falsehood</div>
            <h1 className="title">
              <span className="title-one">One</span>
              <br />
              <span className="title-lie" style={{ color: accent }}>Lie</span>
              <br />
              <span className="title-per">Per Day</span>
            </h1>
            <div className="rule" style={{ background: accent }} />
            <p className="subtitle">
              Every documented falsehood has a cost. This site counts down to{" "}
              <em>November 7, 2028</em> — one verified Trump lie per day,
              sourced from independent fact-checkers.
            </p>
          </header>

          {/* Countdown */}
          {daysLeft !== null && (
            <section className="countdown-section">
              <Countdown accent={accent} />
            </section>
          )}

          {/* Topic Badge */}
          {topic && (
            <div className="topic-row">
              <span className="topic-badge" style={{
                background: `${accent}15`,
                border: `1px solid ${accent}45`,
                color: accent,
              }}>
                {topic.emoji} Today's Topic: {topic.name}
              </span>
            </div>
          )}

          {/* Card */}
          <article className="card" style={{ borderTopColor: accent }}>
            {loading && (
              <div className="loading-state">
                <div className="spinner" style={{ borderTopColor: accent }} />
                <div className="loading-text">Retrieving today's documented falsehood…</div>
              </div>
            )}

            {error && !loading && (
              <div className="error-state">
                <div className="error-msg">{error}</div>
                <button className="retry-btn" onClick={() => fetchLie()} style={{ borderColor: accent, color: accent }}>
                  Try Again
                </button>
              </div>
            )}

            {lie && !loading && (
              <div className="card-content">
                <LieCard lie={lie} accent={accent} revealed={revealed} />
              </div>
            )}
          </article>

          {/* Actions row */}
          {lie && !loading && (
            <div className="actions">
              <ShareBar lie={lie} daysLeft={daysLeft} accent={accent} />

              <button
                className="refresh-btn"
                onClick={() => fetchLie(true)}
                style={{ "--accent": accent }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M23 4v6h-6M1 20v-6h6"/>
                  <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                </svg>
                Show Another Lie
              </button>
            </div>
          )}

          {/* About Section */}
          <section className="about-section">
            <h2 className="about-title">About Trump Lie of the Day</h2>
            <p className="about-text">
              Trump Lie of the Day documents statements made by Donald Trump that have been independently
              assessed and rated by established, nonpartisan fact-checking organizations, including{" "}
              <a href="https://www.politifact.com/personalities/donald-trump/" target="_blank" rel="noopener noreferrer" style={{ color: "#4a6fa5" }}>PolitiFact</a>,{" "}
              <a href="https://www.factcheck.org/person/donald-trump/" target="_blank" rel="noopener noreferrer" style={{ color: "#4a6fa5" }}>FactCheck.org</a>, and the{" "}
              <a href="https://www.washingtonpost.com/news/fact-checker/" target="_blank" rel="noopener noreferrer" style={{ color: "#4a6fa5" }}>Washington Post Fact Checker</a>.
            </p>
            <p className="about-text">
              All content presented on this site is sourced from publicly available fact-checks and
              supporting documentation published by third-party organizations. This site does not
              originate, create, or independently verify any factual claims. Each entry is attributed
              to its source, and visitors are encouraged to follow the links and review the underlying
              evidence directly.
            </p>
            <p className="about-text">
              This site is intended solely for educational and informational purposes, to promote
              transparency and an informed electorate regarding statements made by public officials.
              Nothing on this site should be construed as legal advice, defamatory, or as an expression
              of personal opinion beyond the curated presentation of third-party fact-checks.
            </p>
            <p className="about-text">
              Democracy depends on an informed citizenry. Visitors are encouraged to review all
              underlying sources and draw their own conclusions.
            </p>
          </section>

          {/* Footer */}
          <footer className="footer">
            <p className="footer-text">
              All statements documented by independent fact-checkers including{" "}
              <a href="https://www.politifact.com/personalities/donald-trump/" target="_blank" rel="noopener noreferrer" style={{ color: "#4a6fa5" }}>PolitiFact</a>,{" "}
              <a href="https://www.washingtonpost.com/news/fact-checker/" target="_blank" rel="noopener noreferrer" style={{ color: "#4a6fa5" }}>Washington Post Fact Checker</a>, and{" "}
              <a href="https://www.factcheck.org/person/donald-trump/" target="_blank" rel="noopener noreferrer" style={{ color: "#4a6fa5" }}>FactCheck.org</a>.
              Democracy requires an informed citizenry.
            </p>
            <div className="footer-tagline">ELECTION DAY · NOVEMBER 7, 2028</div>
            <div className="footer-contact">
              Questions or tips?{" "}
              <a href="mailto:contact@trumplieoftheday.com" style={{ color: "#BF0A30" }}>
                contact@trumplieoftheday.com
              </a>
            </div>
          </footer>
        </main>
      </div>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: #0a0d1a;
          color: #e8eaf0;
          font-family: 'Source Serif 4', 'Georgia', serif;
          -webkit-font-smoothing: antialiased;
        }
        a { color: inherit; }
        @keyframes rise {
          0%   { transform: translateY(0) scale(1); opacity: inherit; }
          80%  { opacity: calc(inherit * 0.5); }
          100% { transform: translateY(-100vh) scale(0.4); opacity: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <style jsx>{`
        .root {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }
        .particle {
          position: fixed;
          bottom: -12px;
          border-radius: 50%;
          animation: rise linear infinite;
          pointer-events: none;
          z-index: 0;
        }
        .glow {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          transition: background 1s ease;
        }
        .main {
          position: relative;
          z-index: 1;
          max-width: 740px;
          margin: 0 auto;
          padding: 56px 24px 100px;
        }
        .header {
          text-align: center;
          margin-bottom: 56px;
          animation: fadeSlideIn 0.9s ease both;
        }
        .eyebrow {
          font-size: 10px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: #4a6fa5;
          margin-bottom: 20px;
        }
        .title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(3.5rem, 12vw, 7rem);
          font-weight: 900;
          line-height: 0.95;
          margin-bottom: 0;
        }
        .title-one  { color: #e8eaf0; }
        .title-lie  { color: #BF0A30; }
        .title-per  { color: #002868; font-weight: 400; font-style: italic; font-size: 0.65em; }
        .rule {
          width: 48px;
          height: 3px;
          margin: 24px auto;
          transition: background 0.8s ease;
        }
        .subtitle {
          font-size: 1rem;
          color: #8899bb;
          max-width: 420px;
          margin: 0 auto;
          line-height: 1.8;
        }
        .countdown-section {
          margin-bottom: 40px;
          animation: fadeSlideIn 0.9s 0.15s ease both;
        }
        .topic-row {
          text-align: center;
          margin-bottom: 28px;
          animation: fadeSlideIn 0.9s 0.25s ease both;
        }
        .topic-badge {
          display: inline-block;
          border-radius: 40px;
          padding: 7px 22px;
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          transition: all 0.8s ease;
        }
        .card {
          background: rgba(0, 40, 104, 0.15);
          border: 1px solid rgba(0, 40, 104, 0.35);
          border-top: 3px solid #BF0A30;
          border-radius: 16px;
          overflow: hidden;
          min-height: 300px;
          transition: border-top-color 0.8s ease;
          animation: fadeSlideIn 0.9s 0.3s ease both;
        }
        .card-content {
          padding: 40px;
        }
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 40px;
          gap: 20px;
        }
        .spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(255,255,255,0.06);
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
          transition: border-top-color 0.8s ease;
        }
        .loading-text {
          color: #555;
          font-size: 13px;
          letter-spacing: 0.08em;
          font-style: italic;
        }
        .error-state {
          padding: 48px 40px;
          text-align: center;
        }
        .error-msg {
          color: #BF0A30;
          margin-bottom: 20px;
          font-size: 0.95rem;
        }
        .retry-btn {
          background: transparent;
          border: 1px solid;
          padding: 9px 28px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          letter-spacing: 0.1em;
          font-family: 'Source Serif 4', Georgia, serif;
        }
        .actions {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-top: 32px;
          align-items: center;
          animation: fadeSlideIn 0.9s 0.4s ease both;
        }
        .refresh-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: #666;
          padding: 10px 28px;
          border-radius: 40px;
          cursor: pointer;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: all 0.25s ease;
          font-family: 'Source Serif 4', Georgia, serif;
        }
        .refresh-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
        }
        .about-section {
          margin-top: 72px;
          padding: 36px 40px;
          background: rgba(0, 40, 104, 0.1);
          border: 1px solid rgba(0, 40, 104, 0.25);
          border-left: 3px solid #002868;
          border-radius: 16px;
        }
        .about-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: #e8eaf0;
          margin-bottom: 20px;
          letter-spacing: 0.02em;
        }
        .about-text {
          font-size: 0.88rem;
          color: #8899bb;
          line-height: 1.85;
          margin-bottom: 14px;
        }
        .about-text:last-child {
          margin-bottom: 0;
          color: #aabbdd;
          font-style: italic;
          font-size: 0.97rem;
        }
        .footer {
          margin-top: 72px;
          padding-top: 32px;
          border-top: 1px solid rgba(0, 40, 104, 0.3);
          text-align: center;
        }
        .footer-text {
          font-size: 12px;
          color: #4a6fa5;
          line-height: 1.9;
          max-width: 500px;
          margin: 0 auto;
          font-style: italic;
        }
        .footer-contact {
          margin-top: 16px;
          font-size: 12px;
          color: #8899bb;
        }
        .footer-tagline {
          margin-top: 16px;
          font-size: 10px;
          color: #002868;
          letter-spacing: 0.3em;
        }
        @media (max-width: 480px) {
          .card-content { padding: 28px 20px; }
          .main { padding: 40px 16px 80px; }
        }
      `}</style>
    </>
  );
}
