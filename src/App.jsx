import React, { useEffect, useMemo, useRef } from 'react';

function ForexTicker() {
  const pairs = useMemo(() => ([
    'EUR/USD 1.1023','USD/JPY 145.88','GBP/USD 1.2765','AUD/USD 0.6627',
    'USD/CAD 1.3421','NZD/USD 0.6104','USD/CHF 0.9312','EUR/JPY 160.92',
  ]), []);
  const items = [...pairs, ...pairs, ...pairs];
  return (
    <div className="ticker-wrap">
      <div className="ticker">
        {items.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}


function FluidCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const parent = canvas.parentElement;
    let raf;

    // Offscreen used only for glow stacking
    const off = document.createElement('canvas');
    const octx = off.getContext('2d');

    function resize() {
      const r = parent.getBoundingClientRect();
      const W = Math.floor(r.width * dpr);
      const H = Math.floor(r.height * dpr);

      canvas.style.width = r.width + 'px';
      canvas.style.height = r.height + 'px';
      canvas.width = W;
      canvas.height = H;

      off.width = W;
      off.height = H;
    }

    // Ribbon parameters (water band that revolves)
    const cfg = {
      radius: 0.36,         // orbit radius as fraction of min dimension
      width: 0.08,          // ribbon thickness as fraction of min dimension
      wobbleAmp: 0.018,     // wave amplitude across ribbon edge
      wobbleFreq: 2.2,      // wave frequency around the ring
      speed: 0.22,          // revolve speed (lower = slower)
      hue: 172              // teal
    };

    function drawRibbon(time) {
      const W = canvas.width, H = canvas.height;
      const m = Math.min(W, H);
      const cx = W * 0.5, cy = H * 0.5;
      const R = cfg.radius * m;
      const half = (cfg.width * m) * 0.5;

      // Clear offscreen
      octx.clearRect(0, 0, W, H);

      // Build a closed ribbon path with inner+outer edges and slight sinusoidal wobble
      const steps = 240;
      const t = time * cfg.speed;

      function edgePath(sign) {
        octx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const a = (i / steps) * Math.PI * 2 + t;
          const wob = cfg.wobbleAmp * m * Math.sin(cfg.wobbleFreq * a - time * 0.9);
          const rr = R + sign * (half + wob);
          const x = cx + rr * Math.cos(a);
          const y = cy + rr * Math.sin(a) * 0.65; // elliptical tilt for perspective
          if (i === 0) octx.moveTo(x, y);
          else octx.lineTo(x, y);
        }
      }

      // Fill ribbon body with vertical gradient (glass water look)
      const bodyGrad = octx.createLinearGradient(cx, cy - R - half, cx, cy + R + half);
      bodyGrad.addColorStop(0.0, `hsla(${cfg.hue}, 100%, 65%, 0.10)`);
      bodyGrad.addColorStop(0.5, `hsla(${cfg.hue}, 100%, 58%, 0.22)`);
      bodyGrad.addColorStop(1.0, `hsla(${cfg.hue}, 100%, 65%, 0.10)`);

      // Construct closed shape by tracing outer then inner edge in reverse
      octx.save();
      octx.fillStyle = bodyGrad;
      edgePath(+1);
      edgePath(-1);
      octx.closePath();
      octx.fill();

      // Caustic highlights along edges
      octx.lineJoin = 'round';
      octx.lineCap = 'round';

      // Inner highlight
      octx.strokeStyle = `hsla(${cfg.hue}, 100%, 88%, 0.45)`;
      octx.lineWidth = Math.max(1, 0.008 * m);
      edgePath(-1);
      octx.stroke();

      // Outer darker rim
      octx.strokeStyle = `hsla(${cfg.hue}, 80%, 38%, 0.35)`;
      octx.lineWidth = Math.max(1, 0.006 * m);
      edgePath(+1);
      octx.stroke();

      // Soft animated caustic ripples across the ribbon
      const rippleCount = 4;
      for (let k = 0; k < rippleCount; k++) {
        const phase = time * (0.5 + 0.15 * k);
        octx.globalCompositeOperation = 'lighter';
        octx.strokeStyle = `hsla(${cfg.hue}, 100%, 75%, ${0.14 - k * 0.02})`;
        octx.lineWidth = Math.max(1, 0.004 * m);
        octx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const a = (i / steps) * Math.PI * 2 + t;
          const ripple = Math.sin(a * (cfg.wobbleFreq + k) + phase) * (half * 0.35);
          const rr = R + ripple;
          const x = cx + rr * Math.cos(a);
          const y = cy + rr * Math.sin(a) * 0.65;
          if (i === 0) octx.moveTo(x, y);
          else octx.lineTo(x, y);
        }
        octx.stroke();
        octx.globalCompositeOperation = 'source-over';
      }

      octx.restore();

      // Glow stack on main canvas
      ctx.clearRect(0, 0, W, H);

      // Base pass
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(off, 0, 0);

      // Neon blooms
      ctx.globalCompositeOperation = 'lighter';
      ctx.filter = 'blur(12px) saturate(1.15) opacity(0.65)';
      ctx.drawImage(off, 0, 0);
      ctx.filter = 'blur(24px) saturate(1.08) opacity(0.35)';
      ctx.drawImage(off, 0, 0);
      ctx.filter = 'none';
      ctx.globalCompositeOperation = 'source-over';
    }

    function loop(ts) {
      drawRibbon(ts * 0.001);
      raf = requestAnimationFrame(loop);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas className="hero-canvas" ref={ref} />;
}




function Hero() {
  return (
    <header className="hero section">
      <FluidCanvas />
      <div className="hero-content container">
        <h1>NO FAKE HYPE</h1>
        <h1>NO GUESSING</h1>
        <p className="subtle">A focused community— Controlled growth through discipline.</p>
      </div>
    </header>
  );
}
function ShootingStars() {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const layer = ref.current;
    if (!layer) return;

    let timer;
    let running = true;

    function spawn() {
      if (!running) return;

      const rect = layer.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) {
        timer = setTimeout(spawn, 300);
        return;
      }

      const star = document.createElement('div');
      star.className = 'shooting-star';

      const startX = Math.random() * rect.width;
      const startY = Math.random() * rect.height * 0.6;

      const length = 280 + Math.random() * 220;
      const angleDeg = -30 + Math.random() * -15; // -45..-30
      const angle = (angleDeg * Math.PI) / 180;
      const dx = Math.cos(angle) * length;
      const dy = Math.sin(angle) * length;

      star.style.setProperty('--sx', `${startX}px`);
      star.style.setProperty('--sy', `${startY}px`);
      star.style.setProperty('--dx', `${dx}px`);
      star.style.setProperty('--dy', `${dy}px`);
      star.style.setProperty('--rot', `${angleDeg}deg`);
      star.style.animation = `shoot ${1.4 + Math.random() * 0.8}s linear forwards`;

      layer.appendChild(star);
      setTimeout(() => star.remove(), 2600);

      // Debug
      console.log('shooting star spawned at', Math.round(startX), Math.round(startY));

      const next = 500 + Math.random() * 1200;
      timer = setTimeout(spawn, next);
    }

    spawn();
    return () => {
      running = false;
      clearTimeout(timer);
    };
  }, []);

  // Fill the about section
  return <div ref={ref} className="shooting-layer" />;
}



function AboutYourself() {
  return (
    <section className="about section">
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <h2>About yourself</h2>
        <p className="subtle" style={{ marginTop: 10 }}>
          The Silent Equity journey mirrors the early challenges every trader faces — uncertainty, drawdowns, and the grind.
          This space shares lessons, systems, and the mindset to navigate markets with clarity.
          Read this as the story that might be lived next — then write a better chapter here.
        </p>
      </div>

      {/* CSS-only moving comets (fallback and ambience) */}
      <div className="css-comet c1" />
      <div className="css-comet c2" />
      <div className="css-comet c3" />
      <div className="css-comet c4" />
      <div className="css-comet c5" />

      {/* JS random stars layered above comets */}
      <ShootingStars />
    </section>
  );
}


function Reviews() {
  const data = [
    { q: '“Consistent setups, clearer rules.”', a: 'Aman, FX Swing' },
    { q: '“Weekly recaps changed my risk.”', a: 'Sara, Intraday' },
    { q: '“Accountability is the edge.”', a: 'Vik, Options' },
    { q: '“Clean charts. Clean mind.”', a: 'Rhea, Futures' },
    { q: '“Passed my eval this month.”', a: 'Kian, Prop FX' },
  ];
  const long = [...data, ...data, ...data];
  return (
    <section className="section">
      <div className="container reviews">
        <h2>Reviews</h2>
        <div className="reviews-track" style={{marginTop: 14}}>
          {long.map((r, i) => (
            <div className="review-card" key={i}>
              <p style={{fontWeight:600}}>{r.q}</p>
              <p className="subtle" style={{marginTop:8}}>{r.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LeadForm() {
  return (
    <section className="section leadform-section">  {/* Add leadform-section */}
      <div className="container">
        <h2>Activate Your Silent Potential</h2>
        <form className="form" onSubmit={(e)=>{e.preventDefault(); alert('Details submitted!')}}>
          <input className="input" placeholder="Full name" required />
          <input className="input" placeholder="Email" type="email" required />
          <textarea className="textarea" placeholder="What do you trade?" />
          <button className="button" type="submit">Submit details</button>
        </form>
      </div>
    </section>
  );
}

function FloatingCTA() {
  // Autonomous drifting with bounce at edges + slight scroll influence
useEffect(() => {
  const paddingTop = 80;      // min distance from top
  let y = window.innerHeight * 0.6;
  let vy = 0.45;              // vertical drift speed
  let raf;

  const step = () => {
    const h = window.innerHeight;

    // Vertical drift
    y += vy;

    // Bounce only on top/bottom
    if (y < paddingTop) { y = paddingTop; vy *= -1; }
    if (y > h - paddingTop) { y = h - paddingTop; vy *= -1; }

    // Apply only Y via CSS var
    document.documentElement.style.setProperty('--cta-y', y + 'px');

    raf = requestAnimationFrame(step);
  };

  // Parallax follow on scroll (vertical only)
  const onScroll = () => { y += (window.scrollY - y) * 0.0004; };

  raf = requestAnimationFrame(step);
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); };
}, []);


  return (
    <div className="floating-cta" aria-hidden="false">
      <button
  className="cta-btn"
  onClick={()=> window.open('https://discord.com/invite/your-link', '_blank')}
  aria-label="Join Discord — $12"
>
  <span style={{display:'inline-flex',alignItems:'center',gap:8}}>
    {/* Discord SVG */}
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.369A19.791 19.791 0 0 0 16.556 3c-.2.36-.427.85-.586 1.232a17.185 17.185 0 0 0-7.94 0A8.6 8.6 0 0 0 7.444 3a19.79 19.79 0 0 0-3.761 1.369C1.612 8.053.94 11.62 1.107 15.152a19.96 19.96 0 0 0 6.075 3.11c.469-.64.888-1.322 1.247-2.04a12.9 12.9 0 0 1-1.97-.76c.165-.12.326-.245.482-.374a12.94 12.94 0 0 0 9.118 0c.157.13.318.255.482.374-.636.29-1.305.54-1.97.76.359.718.777 1.4 1.247 2.04a19.96 19.96 0 0 0 6.074-3.11c.22-4.34-.534-7.888-3.025-10.783ZM9.75 13.2c-.84 0-1.523-.76-1.523-1.693 0-.933.674-1.693 1.523-1.693.86 0 1.533.76 1.523 1.693 0 .933-.664 1.693-1.523 1.693Zm4.5 0c-.84 0-1.523-.76-1.523-1.693 0-.933.674-1.693 1.523-1.693.86 0 1.533.76 1.523 1.693 0 .933-.664 1.693-1.523 1.693Z"/>
    </svg>
    <span>JOIN DISCORD — $12</span>
  </span>
</button>

    </div>
  );
}

export default function App() {
  return (
    <>
      <ForexTicker />
      <Hero />
      <AboutYourself />
      <Reviews />
      <LeadForm />
      <FloatingCTA />
    </>
  );
}
