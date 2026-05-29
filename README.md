# 📋 Lie of the Day

> One documented Trump falsehood per day — counting down to the 2028 presidential election.

A Next.js website that serves a single, fact-checked lie from Donald Trump each day, keyed to the number of days remaining until the **November 7, 2028** presidential election. Inspired by the daily verse concept at [tablespoonofgod.com](https://tablespoonofgod.com).

---

## ✨ Features

- **Daily countdown** — live ticker showing days, hours, minutes, seconds to Nov 7, 2028
- **AI-powered content** — Claude API retrieves a documented, fact-checked falsehood each day, matched to the day's topic
- **15 rotating topics** — Immigration, Economy, Election Integrity, Climate Change, and more
- **Daily caching** — same lie served to all visitors on a given day (no per-visitor API costs)
- **Social sharing** — one-click share to X (Twitter), Facebook, and copy link
- **Refined dark design** — editorial aesthetic with Playfair Display typography and animated accents
- **Fully responsive** — works great on mobile

---

## 🚀 Getting Started

### 1. Clone and install

```bash
git clone https://github.com/yourusername/lie-of-the-day.git
cd lie-of-the-day
npm install
```

### 2. Set up your API key

```bash
cp .env.local.example .env.local
```

Open `.env.local` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=sk-ant-...your-key-here...
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

Get your key at [console.anthropic.com](https://console.anthropic.com).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🌐 Deploying to Vercel (Recommended)

Vercel is the easiest way to deploy a Next.js app — free tier works fine.

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual steps

1. Push your code to a GitHub repo (make sure `.env.local` is in `.gitignore` — it already is)
2. Go to [vercel.com](https://vercel.com) → Import Project → select your repo
3. Under **Environment Variables**, add:
   - `ANTHROPIC_API_KEY` = your key
   - `NEXT_PUBLIC_SITE_URL` = your domain (e.g. `https://lieoftheday.com`)
4. Click Deploy

### Custom domain

In Vercel → your project → Settings → Domains, add your domain. DNS propagation takes a few minutes.

---

## 🏗️ Project Structure

```
lie-of-the-day/
├── pages/
│   ├── index.js          # Main page
│   ├── _app.js           # App wrapper
│   └── api/
│       └── lie.js        # Server-side API route (keeps API key secret)
├── components/
│   ├── Countdown.js      # Live days/hrs/min/sec ticker
│   ├── LieCard.js        # Quote, context, truth, rating display
│   └── ShareBar.js       # X, Facebook, copy link buttons
├── lib/
│   └── constants.js      # Election date, topics list, utility functions
├── public/               # Favicon, OG image
├── .env.local.example    # Template — copy to .env.local
├── .gitignore
├── next.config.js
└── package.json
```

---

## 🔑 API Key Security

The Anthropic API key is **only used server-side** in `pages/api/lie.js`. It is never sent to the browser. As long as `.env.local` stays out of your git repo (`.gitignore` handles this), you're safe.

---

## 💰 Cost Estimate

The `/api/lie` endpoint caches the response per day in memory. In production with Vercel serverless functions, add a persistent cache (Redis via Upstash, or Vercel KV) to avoid repeated API calls across cold starts.

Rough cost: ~1,000 tokens per call × ~$3/M tokens (Sonnet) = **fractions of a cent per day**.

---

## 🗓️ Customizing Topics

Edit `lib/constants.js` to change the topic rotation, colors, or emojis:

```js
export const TOPICS = [
  { name: "Immigration", color: "#e05252", emoji: "🚧" },
  // add/remove topics here
];
```

Topics cycle by: `daysLeft % TOPICS.length`, so day 0 = topic 0, day 1 = topic 1, etc.

---

## 📦 Upgrading the Cache (Production)

For production with multiple serverless instances, replace the in-memory cache in `pages/api/lie.js` with [Vercel KV](https://vercel.com/docs/storage/vercel-kv):

```bash
npm install @vercel/kv
```

```js
import { kv } from "@vercel/kv";

const cached = await kv.get(`lie:${todayKey()}`);
if (cached) return res.json(cached);
// ... generate lie ...
await kv.set(`lie:${todayKey()}`, payload, { ex: 86400 }); // expires in 24h
```

---

## 📄 License

MIT — use freely. Democracy requires an informed citizenry.
