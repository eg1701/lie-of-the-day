// pages/api/lie.js
// Server-side route — API key stays secret, never exposed to browser

import Anthropic from "@anthropic-ai/sdk";
import { getDaysUntilElection, getTopicForDay } from "../../lib/constants";

// Cache: stores today's lie and a history of shown lies to avoid repeats
let cache = null;
let shownQuotes = [];

function todayKey() {
  return new Date().toISOString().slice(0, 10); // "2026-05-29"
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const forceRefresh = req.query.refresh === "1";
  const today = todayKey();

  // Serve cached lie for today (unless force-refresh requested)
  if (!forceRefresh && cache && cache.date === today) {
    res.setHeader("X-Cache", "HIT");
    return res.status(200).json(cache.data);
  }

  const daysLeft = getDaysUntilElection();
  const topic = getTopicForDay(daysLeft);

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
      system: `You are a political fact-checker specializing in documenting false or misleading statements made by Donald Trump during his political career and presidencies. You present verified, documented falsehoods with citations. Be concise, factual, and cite real documented instances only. Never invent quotes — only reference statements that were actually fact-checked and documented by reputable sources like PolitiFact, Washington Post Fact Checker, or FactCheck.org. Return ONLY valid JSON with no markdown or code fences.`,
      messages: [
        {
          role: "user",
          content: `Days until 2028 election: ${daysLeft}. Topic: ${topic.name}
${shownQuotes.length > 0 ? `\nIMPORTANT: Do NOT repeat any of these already-shown quotes:\n${shownQuotes.map((q, i) => `${i + 1}. "${q}"`).join("\n")}\nPick a completely different documented falsehood.\n` : ""}
Return a JSON object with exactly these fields:
{
  "quote": "The exact or close paraphrase of something false Trump actually said on this topic",
  "topic": "${topic.name}",
  "topicEmoji": "${topic.emoji}",
  "context": "Brief context: when and where he said it (1-2 sentences)",
  "verdict": "The factual truth in 2-3 sentences",
  "rating": "The fact-checker's rating label, e.g. 'FALSE', 'PANTS ON FIRE', 'MOSTLY FALSE'",
  "source": "Name of fact-checking organization (e.g. PolitiFact, Washington Post Fact Checker)"
}

Return only the JSON object. No markdown, no backticks.`,
        },
      ],
    });

    const text = message.content.find((b) => b.type === "text")?.text || "{}";
    const clean = text.replace(/```json|```/g, "").trim();
    const lieData = JSON.parse(clean);

    const payload = {
      ...lieData,
      daysLeft,
      topicColor: topic.color,
      generatedAt: new Date().toISOString(),
    };

    // Track shown quotes to avoid repeats (keep last 10)
    if (lieData.quote) {
      shownQuotes.push(lieData.quote);
      if (shownQuotes.length > 10) shownQuotes.shift();
    }

    // Only cache the first lie of the day (not refreshes)
    if (!forceRefresh) {
      cache = { date: today, data: payload };
    }

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.setHeader("X-Cache", "MISS");
    return res.status(200).json(payload);
  } catch (err) {
    console.error("Anthropic API error:", err);
    return res.status(500).json({ error: "Failed to fetch today's lie. Please try again." });
  }
}
