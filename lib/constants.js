// lib/constants.js

export const ELECTION_DATE = new Date("2028-11-07T00:00:00");

export const TOPICS = [
  { name: "Immigration", color: "#e05252", emoji: "🚧" },
  { name: "Economy", color: "#e07a52", emoji: "📈" },
  { name: "COVID-19", color: "#e0b452", emoji: "🦠" },
  { name: "Election Integrity", color: "#c8e052", emoji: "🗳️" },
  { name: "Climate Change", color: "#52e094", emoji: "🌡️" },
  { name: "Trade & Tariffs", color: "#52c4e0", emoji: "⚖️" },
  { name: "Foreign Policy", color: "#5270e0", emoji: "🌐" },
  { name: "Crime Statistics", color: "#9452e0", emoji: "🔢" },
  { name: "Healthcare", color: "#e052c4", emoji: "🏥" },
  { name: "Military", color: "#52e0b4", emoji: "🎖️" },
  { name: "Media & Press", color: "#e05285", emoji: "📰" },
  { name: "Tax Cuts", color: "#e0a452", emoji: "💰" },
  { name: "Jobs", color: "#7ae052", emoji: "💼" },
  { name: "Ukraine", color: "#52a4e0", emoji: "🌻" },
  { name: "NATO", color: "#5252e0", emoji: "🛡️" },
];

export function getDaysUntilElection() {
  const now = new Date();
  const diff = ELECTION_DATE - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getTopicForDay(daysLeft) {
  return TOPICS[daysLeft % TOPICS.length];
}
