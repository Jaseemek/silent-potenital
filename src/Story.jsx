import { useState } from "react";

const cards = [
  {
    title: "Welcome To Silent Equity",
    bullets: [
      "Three traders, one vision: disciplined, consistent, emotionally resilient participants.",
      "Anonymous by choice — focus on process, progress, and mastery.",
      "Data, discipline, development over hype.",
      "No shortcuts — trading is a craft and mirror of the mind.",
      "It’s about who is built in silence."
    ],
  },
  {
    title: "Join the Movement",
    bullets: [
      "Challenges simulate live pressure and track with clear metrics.",
      "Routine system: daily consistency, emotional control, structured planning.",
      "With risk‑managed strategies, students become traders."
    ],
  },
  {
    title: "The Ninjas",
    bullets: [
      "Three full‑time traders, anonymous to keep focus on the craft.",
      "Remove ego and noise — master the process that compounds.",
      "Proof over fame: discipline builds real success."
    ],
  },
  {
    title: "The Story of Our Journey",
    bullets: [
      "Forged by failure, refined by years of lessons — not luck.",
      "Edge from discipline, psychology, precision — not signals.",
      "Others sell dreams; we make impact.",
      "Where the myth ends, real trading begins."
    ],
  },
];

export default function Story() {
  const [active, setActive] = useState(0);
  const total = cards.length;
  const next = () => setActive(a => (a + 1) % total);
  const prev = () => setActive(a => (a - 1 + total) % total);

  const order = [active, (active + 1) % total, (active + 2) % total];

  return (
    <main className="door-main">
      {/* Gentle diagonal comet rain (kept) */}
      <div className="door-comets rain">
        {Array.from({ length: 64 }).map((_, i) => (
          <span key={i} className={`css-comet rain-${i+1}`} />
        ))}
      </div>

      <div className="door-wrap">
   {order.map((idx, layer) => {
  // Hide non-active cards on mobile (window check in useEffect or safer env check needed)
  // For simplicity, example directly uses window.innerWidth
  if (typeof window !== "undefined" && window.innerWidth < 650 && layer !== 0) return null;

  const c = cards[idx];
  const cls = layer === 0 ? "card active" : layer === 1 ? "card next" : "card later";
  return (
    <section key={`${c.title}-${idx}`} className={cls} onClick={next}>
      <h2>{c.title}</h2>
      <ul className="bullet-list">
        {c.bullets.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
    </section>
  );
})}

      </div>

      {/* Optional hidden controls for keyboard users */}
      <div className="door-controls" aria-hidden="true">
        <button onClick={prev} className="ghost-btn">Prev</button>
        <button onClick={next} className="ghost-btn">Next</button>
      </div>
    </main>
  );
}
