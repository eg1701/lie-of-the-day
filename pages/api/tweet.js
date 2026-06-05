// pages/api/tweet.js
// Called daily by Vercel cron to post today's lie to X (@eg1701)

import { TwitterApi } from "twitter-api-v2";

export default async function handler(req, res) {
  // Vercel cron jobs send the CRON_SECRET automatically
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;

  // Allow if: Vercel cron auth matches, or no secret is set (for testing)
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    console.log("Auth failed. Header received:", authHeader);
    return res.status(401).json({ error: "Unauthorized" });
  }

  console.log("Auth passed, proceeding to tweet...");

  try {
    // Fetch today's lie from our own API
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trumplieoftheday.com";
    const lieRes = await fetch(`${siteUrl}/api/lie`);
    const lie = await lieRes.json();

    if (!lie.quote) {
      return res.status(500).json({ error: "No lie data available" });
    }

    // Build the tweet
    const daysLeft = lie.daysLeft?.toLocaleString() || "?";
    const rating = lie.rating || "FALSE";
    const topic = lie.topic || "";
    const emoji = lie.topicEmoji || "🇺🇸";
    const source = lie.source || "Fact-checkers";

    // Truncate quote if needed to fit in tweet
    const maxQuoteLen = 200;
    const quote = lie.quote.length > maxQuoteLen
      ? lie.quote.slice(0, maxQuoteLen - 1) + "…"
      : lie.quote;

    const tweet = `⏳ ${daysLeft} days until the 2028 Presidential Election

${emoji} Today's Topic: ${topic}
🏷️ Verdict: ${rating}

❝${quote}❞

— ${source}

🔗 ${siteUrl} | #TrumpLie #FactCheck #2028Election`;

    // Debug: log key previews to verify correct keys are loaded
    console.log("Key previews:", {
      appKey: process.env.TWITTER_API_KEY?.slice(0, 6),
      appSecret: process.env.TWITTER_API_SECRET?.slice(0, 6),
      accessToken: process.env.TWITTER_ACCESS_TOKEN?.slice(0, 6),
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET?.slice(0, 6),
    });

    // Post to X
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY?.trim(),
      appSecret: process.env.TWITTER_API_SECRET?.trim(),
      accessToken: process.env.TWITTER_ACCESS_TOKEN?.trim(),
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET?.trim(),
    });

    const result = await client.v2.tweet(tweet);

    return res.status(200).json({ success: true, tweetId: result.data.id });
  } catch (err) {
    console.error("Tweet error:", err);
    return res.status(500).json({ error: err.message });
  }
}
