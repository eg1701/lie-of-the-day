// pages/api/tweet.js
// Called daily by Vercel cron to post today's lie to X (@eg1701)

import { TwitterApi } from "twitter-api-v2";

export default async function handler(req, res) {
  // Only allow GET (from cron) or POST with secret token
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

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

${emoji} ${topic} | ${rating}

"${quote}"

📋 Source: ${source}
🔗 ${siteUrl}`;

    // Post to X
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });

    const result = await client.v2.tweet(tweet);

    return res.status(200).json({ success: true, tweetId: result.data.id });
  } catch (err) {
    console.error("Tweet error:", err);
    return res.status(500).json({ error: err.message });
  }
}
