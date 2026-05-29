// components/Countdown.js
import { useState, useEffect } from "react";
import { getDaysUntilElection } from "../lib/constants";

export default function Countdown({ accent }) {
  const [daysLeft, setDaysLeft] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setDaysLeft(getDaysUntilElection());

    const tick = () => {
      const now = new Date();
      const election = new Date("2028-11-07T00:00:00");
      const diff = election - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setDaysLeft(days);
      setTimeLeft({ hours, minutes, seconds });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (daysLeft === null) return null;

  const units = [
    { label: "DAYS", value: daysLeft.toLocaleString() },
    { label: "HRS", value: String(timeLeft.hours).padStart(2, "0") },
    { label: "MIN", value: String(timeLeft.minutes).padStart(2, "0") },
    { label: "SEC", value: String(timeLeft.seconds).padStart(2, "0") },
  ];

  return (
    <div style={{
      display: "flex",
      gap: "12px",
      justifyContent: "center",
      flexWrap: "wrap",
    }}>
      {units.map(({ label, value }) => (
        <div key={label} style={{
          textAlign: "center",
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${accent}25`,
          borderRadius: "10px",
          padding: "16px 20px",
          minWidth: label === "DAYS" ? "110px" : "72px",
          transition: "border-color 0.8s ease",
        }}>
          <div style={{
            fontSize: label === "DAYS" ? "clamp(2.2rem,6vw,3.2rem)" : "clamp(1.4rem,4vw,2rem)",
            fontWeight: "900",
            lineHeight: 1,
            color: accent,
            fontFamily: "'Georgia', serif",
            transition: "color 0.8s ease",
            fontVariantNumeric: "tabular-nums",
          }}>{value}</div>
          <div style={{
            fontSize: "9px",
            letterSpacing: "0.3em",
            color: "#555",
            marginTop: "6px",
          }}>{label}</div>
        </div>
      ))}
      <div style={{
        width: "100%",
        textAlign: "center",
        fontSize: "11px",
        color: "#444",
        letterSpacing: "0.25em",
        marginTop: "4px",
      }}>
        UNTIL NOV 7, 2028 · PRESIDENTIAL ELECTION
      </div>
    </div>
  );
}
