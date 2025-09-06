import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function Story() {
  // Force page to start at top on route entry
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }
    return () => {
      if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  // phases: halves fly-in center -> dock to top -> then cards fade in
  const [dock, setDock] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showCards, setShowCards] = useState(false); // cards appear only after title goes up

  // sentinel and flag to gate Mentor (after About)
  const afterAboutRef = useRef(null);
  const [pastAbout, setPastAbout] = useState(false);

  useEffect(() => {
    // Timing: heading plays, then docks, then cards appear
    const t1 = setTimeout(() => setDock(true), 1600);
    const t2 = setTimeout(() => {
      setShowSplash(false);
      setShowCards(true);
    }, 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Observe the sentinel after About; arm mentor only after this is in view
  useEffect(() => {
    const el = afterAboutRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting) {
          setPastAbout(true);
          io.unobserve(el); // unobserve after triggered once
        }
      },
      // Trigger as soon as sentinel touches viewport so mentor appears immediately after About
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Card content (hero carousel)
  const CARDS = [
    {
      title: "Welcome To Silent Equity",
      bullets: [
        "Three traders, one vision: disciplined, consistent, emotionally resilient participants.",
        "Anonymous by choice — focus on process, progress, and mastery.",
        "Data, discipline, development over hype.",
        "No shortcuts — trading is a craft and mirror of the mind.",
        "It’s about who is built in silence.",
      ],
    },
    {
      title: "Join the Movement",
      bullets: [
        "Challenges simulate live pressure and track with clear metrics.",
        "Routine system: daily consistency, emotional control, structured planning.",
        "With risk-managed strategies, students become traders.",
      ],
    },
    {
      title: "The Ninjas",
      bullets: [
        "Three full-time traders, anonymous to keep focus on the craft.",
        "Remove ego and noise — master the process that compounds.",
        "Proof over fame: discipline builds real success.",
      ],
    },
    {
      title: "The Story of Our Journey",
      bullets: [
        "Forged by failure, refined by years of lessons — not luck.",
        "Edge from discipline, psychology, precision — not signals.",
        "Others sell dreams; we make impact.",
        "Where the myth ends, real trading begins.",
      ],
    },
  ];

  return (
    <main className="story-root">
      {/* TOP-ONLY split halves that play once on load (no center title) */}
      {showSplash && (
        <div className={`edge-splash ${dock ? "dock" : ""}`}>
          <span className="edge half left">Silent&nbsp;Equity&nbsp;Story&nbsp;—</span>
          <span className="edge half right">“Every&nbsp;Traders&nbsp;Unspoken&nbsp;Life”</span>
        </div>
      )}

      {/* Sticky header that fades in while splash fades out */}
      <header className="topbar">
        <h1 className={`top-title ${dock ? "is-in" : ""}`}>
          <span>Silent Equity Story — </span>
          <span className="teal">“Every Traders Unspoken Life”</span>
        </h1>
      </header>

      {/* Hero with comets and revolving cards (only after title docks) */}
      <HeroCarousel visible={showCards} items={CARDS} />

      {/* About line that bounces in */}
      <AboutBounce />

      {/* sentinel placed right after About to gate the mentor line */}
      <div ref={afterAboutRef} className="after-about-sentinel" aria-hidden="true" />

      {/* Mentor line that types in (now gated) */}
      <MentorTyping armed={pastAbout} />

      {/* Revolving wheel with 8 principles and center circle */}
      <PrinciplesWheel />

      {/* Base styles */}
      <style>{`
        :root{
          --teal: #7ff7ea;
          --fg: #eafdfd;
          --bg: #101a20;
          --heading-font: 'Orbitron', 'Audiowide', 'Space Grotesk', Poppins, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        }
        .story-root{ min-height: 200vh; background: var(--bg); color: var(--fg); }

        /* edge-to-top splash (title halves from left/right at top) */
        .edge-splash{ position: fixed; inset: 0; pointer-events: none; z-index: 50; }
        .edge{
          position: fixed; top: 14px; /* aligns with header padding */
          font-family: var(--heading-font); font-weight: 800;
          font-size: clamp(1.1rem, 3.2vw, 2rem); letter-spacing: .3px;
          white-space: nowrap; opacity: 0;
          text-shadow: 0 8px 24px rgba(0,0,0,.25);
        }
        .edge.half.left{ left: 6vw; transform: translateX(-120%); animation: sweepInLeft 950ms cubic-bezier(.2,.8,.2,1) forwards; }
        .edge.half.right{ right: 6vw; transform: translateX(120%); color: var(--teal);
          text-shadow: 0 0 12px rgba(18,231,207,.45);
          animation: sweepInRight 950ms cubic-bezier(.2,.8,.2,1) forwards; animation-delay: 120ms; }
        .edge-splash.dock{ animation: fadeEdge 800ms ease 550ms forwards; }
        @keyframes sweepInLeft{
          0%{ opacity:0; transform: translateX(-120%) scale(.98); filter: blur(2px); }
          60%{ opacity:1; transform: translateX(6%)   scale(1.02); filter: blur(0); }
          100%{ opacity:1; transform: translateX(0)   scale(1); }
        }
        @keyframes sweepInRight{
          0%{ opacity:0; transform: translateX(120%)  scale(.98); filter: blur(2px); }
          60%{ opacity:1; transform: translateX(-6%)  scale(1.02); filter: blur(0); }
          100%{ opacity:1; transform: translateX(0)   scale(1); }
        }
        @keyframes fadeEdge{ to{ opacity:0; } }

        /* Top sticky title */
        .topbar{ position: sticky; top: 0; z-index: 10; display:grid; place-items:center; padding: 14px 6vw;
          background: linear-gradient(to bottom, rgba(16,26,32,.65), rgba(16,26,32,0)); backdrop-filter: blur(2px); }
        .top-title{ margin:0; font-family: var(--heading-font); font-weight:800; text-align:center;
          font-size: clamp(1.1rem, 3.2vw, 2rem); letter-spacing:.3px; opacity:0; transform: translateY(-8px);
          transition: opacity 680ms ease, transform 680ms ease; }
        .top-title.is-in{ opacity:1; transform: translateY(0); }

        /* Ensure sentinel can intersect right after About */
        .after-about-sentinel{ height: 1px; width: 100%; }

        @media (prefers-reduced-motion: reduce){
          .edge, .edge-splash.dock, .top-title{ animation:none !important; transition:none !important; opacity:1 !important; transform:none !important; }
        }
        @media (max-width: 650px){
          .topbar{ padding: 10px 4vw; }
        }
      `}</style>
    </main>
  );
}

/* ---------------- Hero with comets + revolving cards ---------------- */
function HeroCarousel({ visible, items }) {
  const isMobile = useIsMobile(650);
  const [active, setActive] = useState(0);
  const total = items.length;

  const heroClass = `hero ${visible ? "is-in" : ""}`;

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setActive((a) => (a + 1) % total), 9000);
    return () => clearInterval(id);
  }, [visible, total]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") setActive((a) => (a + 1) % total);
      if (e.key === "ArrowLeft") setActive((a) => (a - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, total]);

  const startX = useRef(0);
  const endX = useRef(0);

  // SAFELY read touch X coordinate
  const readTouchX = (e) => {
    if (!e) return undefined;
    if (e.touches && e.touches.length) return e.touches[0].clientX;
    if (e.changedTouches && e.changedTouches.length) return e.changedTouches[0].clientX;
    return undefined;
  };

  const onStart = (e) => {
    const tx = readTouchX(e);
    if (typeof tx === "number") startX.current = tx;
  };
  const onMove  = (e) => {
    const tx = readTouchX(e);
    if (typeof tx === "number") endX.current = tx;
  };
  const onEnd   = () => {
    const dx = endX.current - startX.current;
    if (Math.abs(dx) > 50) setActive((a) => dx > 0 ? (a - 1 + total) % total : (a + 1) % total);
  };

  const order = [active, (active + 1) % total, (active + 2) % total, (active + 3) % total];
  // FIX: visibleOrder must be numeric indices (no nested arrays)
  const visibleOrder = isMobile ? [ order[0], order[1] ] : order;

  return (
    <section className={heroClass}>
      {/* 5 comets, TL -> BR */}
      <div className="comets" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`comet c${i}`} />
        ))}
      </div>

      <div className="stage" onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}>
        {visibleOrder.map((idx, i) => {
          const c = items[idx];
          const layer =
            i === 0 ? "card active"
            : i === 1 ? "card next"
            : i === 2 ? "card later"
            : "card far";
          return (
            <article key={`${c.title}-${idx}`} className={layer} onClick={() => setActive((a) => (a + 1) % total)}>
              <h2 className="card-title">{c.title}</h2>
              <ul className="list">
                {c.bullets.map((b, bi) => <li key={bi} className="line">{b}</li>)}
              </ul>
            </article>
          );
        })}
      </div>

      <style>{`
        .hero{
          opacity: 0; transform: translateY(10px);
          transition: opacity 520ms ease 120ms, transform 520ms ease 120ms;
          min-height: 84vh; display:flex; align-items:center; justify-content:center;
          position: relative; overflow:hidden; background: transparent;
        }
        .hero.is-in{ opacity:1; transform: translateY(0); }

        .comets{ position:absolute; inset:0; pointer-events:none; z-index:0; }
        .comet{
          position:absolute; width:120px; height:2px; opacity:.45;
          background: linear-gradient(270deg, rgba(0,255,255,.7), transparent);
          transform: rotate(45deg);
          animation: comet-move 4.8s linear infinite;
        }
        .comet.c0{ top:8%;  left:-10%; animation-delay:-0.2s; }
        .comet.c1{ top:18%; left:-14%; animation-delay:-1.0s; }
        .comet.c2{ top:38%; left:-12%; animation-delay:-1.8s; }
        .comet.c3{ top:58%; left:-16%; animation-delay:-2.6s; }
        .comet.c4{ top:72%; left:-9%;  animation-delay:-3.4s; }
        @keyframes comet-move{
          from{ transform: translate(-10%, -10%) rotate(45deg); opacity:.55; }
          to  { transform: translate(120vw, 120vh) rotate(45deg); opacity:0; }
        }

        .stage{ position:relative; width:min(54vw, 540px); height:min(68vh, 330px);
          display:flex; align-items:center; justify-content:center; perspective: 1400px; z-index:1; }

        .card{
          position:absolute; inset:0; padding: clamp(16px, 3.5vw, 26px);
          border-radius: 21x; overflow:auto; color:#e6faff;
          background: rgba(15,25,35,.72);
          backdrop-filter: blur(14px) saturate(150%); -webkit-backdrop-filter: blur(14px) saturate(150%);
          border: 1px solid rgba(255,255,255,.08);
          box-shadow: 0 28px 60px rgba(0,0,0,.28), 0 0 40px rgba(0,255,200,.08);
          transform-style: preserve-3d;
          transition: transform .9s cubic-bezier(.76,0,.24,1), opacity .6s ease, box-shadow .3s ease;
          will-change: transform, opacity, box-shadow;
        }
        .card:hover{ box-shadow: 0 36px 80px rgba(0,0,0,.34), 0 0 52px rgba(0,255,200,.14);
          transform: translateY(-4px) rotateY(var(--tilt,0deg)) scale(1.01); }
        .card-title{ margin:0 0 .8rem; color:#9fffea; font-weight:800; font-family:'Orbitron','Space Grotesk',Poppins,sans-serif;
          font-size: clamp(1.1rem, 2.1vw, 1.6rem); text-shadow: 0 0 12px rgba(0,255,255,.28); }
        .list{ list-style:none; margin:0; padding:0; display:grid; gap:.55rem; }
        .line{ line-height:1.6; opacity:.96; }

        .card.active{ opacity:1;  transform: translateX(0) rotateY(0deg) scale(1); z-index:4; }
        .card.next  { opacity:.88; transform: translateX(38%) rotateY(-32deg) scale(.94); z-index:3; }
        .card.later { opacity:.44; transform: translateX(74%) rotateY(-60deg) scale(.88); z-index:2; }
        .card.far   { opacity:.22; transform: translateX(-46%) rotateY(36deg) scale(.9); z-index:1; }

        @media (max-width: 650px){
          .stage{ width: 96vw; height: min(64vh, 520px); }
          .card.next{ transform: translateX(14%) rotateY(-18deg) scale(.97); opacity:.42; }
          .card.later, .card.far{ display:none; }
        }
      `}</style>
    </section>
  );
}

/* ---------------- About: bounce-in line ---------------- */
function AboutBounce() {
  const lineRef = useRef(null);
  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting) {
          el.classList.add("is-in");
          io.unobserve(el);
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -12% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section className="about-wrap">
      <h2 ref={lineRef} className="about-line">
        We chose to call this section <span className="teal">About Yourself</span> instead of the usual “About Us” — because your current journey mirrors the one we’ve already walked through. This is not just our story; it's yours too.
      </h2>
      <style>{`
        .about-wrap {
          padding: clamp(28px, 7vh, 72px) 6vw clamp(28px, 8vh, 80px);
          display: grid;
          place-items: center;
          text-align: center;
        }
        .about-line {
          max-width: 1100px;
          font-size: clamp(1.05rem, 2.4vw, 1.2rem);
          line-height: 1.7;
          margin: 0;
          opacity: 0;
          transform: translateY(18px) scale(.98);
        }
        .about-line.is-in {
          animation: aboutBounceIn 820ms cubic-bezier(.2, .9, .2, 1) forwards;
          opacity: 1;
        }
        @keyframes aboutBounceIn {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(.98);
          }
          55% {
            opacity: 1;
            transform: translateY(-10px) scale(1.02);
          }
          75% {
            transform: translateY(4px) scale(1.0);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </section>
  );
}

/* ---------------- Mentor typing line (gated) ---------------- */
function MentorTyping({ armed = false }) {
  const containerRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [text, setText] = useState("");
  const full = "Not Any Another Mentor. We Were Where You Are.";

  // Only start observing when armed
  useEffect(() => {
    if (!armed) return;
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting && !started) {
          setStarted(true);
          io.unobserve(el);
        }
      },
      { threshold: 0.4, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed, started]);

  useEffect(() => {
    if (!started) return;
    let i = 0, t;
    const step = () => {
      const chunk = Math.random() < 0.35 ? 2 : 1;
      i = Math.min(i + chunk, full.length);
      setText(full.slice(0, i));
      if (i < full.length) t = setTimeout(step, 40 + Math.random() * 70);
    };
    t = setTimeout(step, 140);
    return () => clearTimeout(t);
  }, [started, full]);

  return (
    <section
      ref={containerRef}
      className={`mentor-wrap ${armed ? "" : "pre-armed"}`}
    >
      <h3 className={`type-line ${started ? "is-in" : ""}`}>
        <span className="typed">{text}</span>
        <span className={`caret ${text.length >= full.length ? "done" : ""}`} />
      </h3>
      <style>{`
        .mentor-wrap {
          padding: clamp(14px, 5vh, 36px) 6vw clamp(36px, 10vh, 90px);
          display: grid;
          place-items: center;
          text-align: center;
        }
        /* Hide completely until armed to prevent early appearance */
        .mentor-wrap.pre-armed {
          visibility: hidden;
          height: 0;
          margin: 0;
          padding: 0;
        }
        .type-line {
          margin: 0;
          font-family: 'Orbitron', 'Space Grotesk', Poppins, sans-serif;
          font-weight: 800;
          letter-spacing: .3px;
          font-size: clamp(1.02rem, 3vw, 1.2rem);
          color: #fff;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 420ms ease, transform 420ms ease;
        }
        .type-line.is-in {
          opacity: 1;
          transform: translateY(0);
        }
        .typed {
          color: #eafdfd;
        }
        .caret {
          display: inline-block;
          width: 1ch;
          margin-left: 2px;
          border-right: 2px solid #7ff7ea;
          transform: translateY(2px);
          animation: blink 900ms steps(1, end) infinite;
        }
        .caret.done {
          animation: none;
          border-right-color: transparent;
        }
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}

/* ---------------- Principles wheel (8 items orbiting) ---------------- */
function PrinciplesWheel() {
  const wrapRef = useRef(null);
  const [revealed, setRevealed] = useState(false); // controls fade-in
  const [go, setGo] = useState(false); // starts rotation after reveal

  const PRINCIPLES = [
    "Your Strategy works on backtest, but fails live.",
    "You're trading to avoid loss, not to win.",
    "You Don’t know when to start live trading.",
    "You are repeating same mistakes, again and again.",
    "You have no clue what returns are realistically possible.",
    "You Panic when trade turns red.",
    "You been Chasing “perfect consistency” which is killing you.",
    "You got tired of fake traders and fake results online.",
  ];

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting && !revealed) {
          setRevealed(true); // fade in
          setTimeout(() => setGo(true), 300); // then start spin
          io.unobserve(el);
        }
      },
      { threshold: 0.4, rootMargin: "0px 0px -18% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [revealed]);

  return (
    <section
      ref={wrapRef}
      className={`wheel-wrap ${revealed ? "reveal" : ""} ${go ? "go" : ""}`}
    >
      <div className="wheel">
        <div className="ring">
          {PRINCIPLES.map((txt, i) => (
            <div key={i} className="orbit-item" style={{ "--i": i }}>
              <div className="glass">{txt}</div>
            </div>
          ))}
        </div>
        <div className="center">
          If even 2 of these sound familiar, you belong with us.
        </div>
      </div>

      <style>{`
        .wheel-wrap {
          padding: clamp(30px, 10vh, 120px) 6vw clamp(40px, 12vh, 140px);
          display: grid;
          place-items: center;
          /* hidden until reveal */
          opacity: 0;
          transform: translateY(14px) scale(0.98);
          transition: opacity 520ms ease, transform 520ms ease;
          pointer-events: none;
        }
        .wheel-wrap.reveal {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }
        .wheel {
          --count: 8;
          --R: clamp(120px, 20vw, 200px);
          position: relative;
          width: calc(var(--R) * 2 + 180px);
          height: calc(var(--R) * 2 + 180px);
        }
        /* Ring rotates; each card counter-rotates to stay upright */
        .ring {
          position: absolute;
          inset: 0;
          animation: spin 36s linear infinite;
          animation-play-state: paused;
        }
        .wheel-wrap.go .ring { animation-play-state: running; }

        .orbit-item {
          --angle: calc(360deg / var(--count) * var(--i));
          position: absolute;
          top: 50%;
          left: 50%;
          transform: rotate(var(--angle)) translateX(var(--R));
          transform-origin: 0 0;
        }

        .glass {
          min-width: clamp(200px, 26vw, 10px);
          max-width: clamp(200px, 28vw, 190px);
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid rgba(122,255,244,.38);
          color:#e6faff;
          background: rgba(10,18,22,.24);
          backdrop-filter: blur(8px) saturate(1.05);
          box-shadow: 0 8px 28px rgba(0,0,0,.28);
          animation: spinRev 36s linear infinite;
          animation-play-state: paused;
          transform-origin: center;
        }
        .wheel-wrap.go .glass{ animation-play-state: running; }

        .center{
          position:absolute; top:50%; left:50%; transform: translate(-50%,-50%);
          width: clamp(220px, 36vw, 210px);
          padding: clamp(10px, 2.2vw, 9px) clamp(14px, 2.6vw, 22px);
          text-align:center;
          color:#0a0f14;
          background: #aaf7ee;
          border-radius: 999px;
          box-shadow: 0 18px 40px rgba(0,0,0,.25);
          font-weight: 54;
          line-height: 1.2;
        }

        @keyframes spin   { from{ transform: rotate(0deg);}   to{ transform: rotate(360deg);} }
        @keyframes spinRev{ from{ transform: rotate(0deg);}   to{ transform: rotate(-360deg);} }

        .glass:hover{ transform: translateZ(0) scale(1.02); box-shadow: 0 14px 36px rgba(0,0,0,.34); }

        @media (max-width: 650px){
          .wheel{ --R: 100px; width: calc(var(--R) * 2 + 80px); height: calc(var(--R) * 2 + 120px); }
          .glass{ min-width: 72vw; max-width: 76vw; }
          .center{ width: min(86vw, 420px); }
        }

        @media (prefers-reduced-motion: reduce){
          .ring, .glass{ animation: none !important; }
        }
      `}</style>
    </section>
  );
}

/* ---------------- Hook ---------------- */
function useIsMobile(bp = 650) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const f = () => setM(typeof window !== "undefined" && window.innerWidth < bp);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, [bp]);
  return m;
}
