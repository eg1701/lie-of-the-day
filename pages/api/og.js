// pages/api/og.js
// Generates a dynamic Open Graph image for social sharing

export default function handler(req, res) {
  const { quote, topic, rating, days } = req.query;

  const safeQuote = (quote || "One documented Trump falsehood per day.").slice(0, 120);
  const safeTopic = topic || "Politics";
  const safeRating = rating || "FALSE";
  const safeDays = days || "886";

  const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0d1a"/>
      <stop offset="100%" stop-color="#0d1530"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Red top bar -->
  <rect width="1200" height="8" fill="#BF0A30"/>

  <!-- Blue bottom bar -->
  <rect y="622" width="1200" height="8" fill="#002868"/>

  <!-- Left red accent bar -->
  <rect x="60" y="80" width="6" height="470" fill="#BF0A30" rx="3"/>

  <!-- Days countdown -->
  <text x="90" y="140" font-family="Georgia, serif" font-size="28" fill="#4a6fa5" letter-spacing="3">⏳ ${safeDays} DAYS UNTIL 2028 ELECTION</text>

  <!-- Title -->
  <text x="90" y="220" font-family="Georgia, serif" font-size="72" font-weight="900" fill="#BF0A30">LIE OF THE DAY</text>

  <!-- Topic | Rating -->
  <text x="90" y="280" font-family="Georgia, serif" font-size="28" fill="#8899bb">${safeTopic}  |  ${safeRating}</text>

  <!-- Divider -->
  <rect x="90" y="300" width="1020" height="2" fill="#002868" opacity="0.5"/>

  <!-- Quote -->
  <foreignObject x="90" y="320" width="1020" height="220">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Georgia, serif; font-size: 32px; color: #e8eaf0; line-height: 1.5; font-style: italic;">
      &ldquo;${safeQuote}${safeQuote.length >= 120 ? '…' : ''}&rdquo;
    </div>
  </foreignObject>

  <!-- Domain -->
  <text x="90" y="590" font-family="Georgia, serif" font-size="24" fill="#4a6fa5">trumplieoftheday.com</text>
</svg>`;

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(svg);
}
