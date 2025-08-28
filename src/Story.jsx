import { useState } from "react";

const cards = [
  { title: "Welcome To Silent Equity", text: <>Silent Equity is a collective of three experienced traders united by one vision — to build a new generation of disciplined, consistent, and emotionally resilient market participants.<br/><br/>We choose to stay anonymous, not because we seek secrecy, but because we believe your focus should be on <strong>process, progress, and personal mastery</strong> — not personalities. In an age where most chase faces, we shift your attention to <strong>data, discipline, and development</strong>.<br/><br/>We don’t sell shortcuts. We don’t glorify overnight success. We guide you to see trading as it is — a craft, a journey, and a mirror of your mind.<br/><br/>Silent Equity isn’t about us.<br/><strong>It’s about what you become in silence.</strong></> },
  { title: "Join the Movement", text: <>At Silent Equity, we conduct regular trade challenges within our community to push students beyond their comfort zones and strengthen their execution under real conditions.<br/><br/>These challenges are designed to simulate live trading pressure, develop discipline, and track performance with clear metrics.<br/><br/>Alongside this, we implement a habit-building and routine system that focuses on daily consistency, emotional control, and structured planning—essential traits of a profitable trader.<br/><br/>Combined with our proven, risk-managed strategies, students don’t just learn to trade—they evolve into traders.</> },
  { title: "The Ninjas", text: <>Our team at Silent Equity consists of three passionate full-time traders who choose to remain anonymous. This isn’t about secrecy—it's about shifting the focus entirely onto the craft of trading.<br/><br/>We believe that personalities and faces shouldn’t distract from the real goal: mastering the process. Our anonymity allows us to lead by example, proving that consistent discipline, not individual fame, is what builds real trading success.</> },
  { title: "The Story of Our Journey", text: <>We are Silent Equity.<br/>Three traders forged in the fire of failure, shaped by two relentless years of non-profitability. No shortcuts. No hype. Just brutal lessons, sleepless nights, and the silent grind that led us to our edge.<br/><br/>We stay anonymous—not to hide, but to shift the spotlight from ego to process. Trading isn’t about faces or fame. It’s about discipline, psychology, and precision.<br/><br/>While others sell dreams, we expose truth.<br/>While others make noise, we make impact.<br/><br/>Welcome to Silent Equity—<br/><strong>Where the myth ends, and real trading begins.</strong></> },
];

export default function Story() {
  const [active, setActive] = useState(0);
  const total = cards.length;
  const prev = () => setActive(a => (a - 1 + total) % total);
  const next = () => setActive(a => (a + 1) % total);

  const order = [active, (active + 1) % total, (active + 2) % total];

  return (
    <main className="door-main">
      {/* Gentle diagonal comet rain */}
      <div className="door-comets rain">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className={`css-comet rain-${i+1}`} />
        ))}
      </div>

      <div className="door-wrap">
        {order.map((idx, layer) => {
          const c = cards[idx];
          const cls = layer === 0 ? "card active" : layer === 1 ? "card next" : "card later";
          return (
            <section key={c.title} className={cls} onClick={() => next()}>
              <h2>{c.title}</h2>
              <div className="card-text">{c.text}</div>
            </section>
          );
        })}
      </div>

      {/* Optional tiny controls: click card to advance; use keyboard as well */}
      <div className="door-hint" aria-hidden="true">Tap card to continue →</div>
    </main>
  );
}
