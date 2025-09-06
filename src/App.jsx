import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Story from "./Story";
import Initiatives from "./Services";

/* ---------- AGGRESSIVE ScrollToTop (Multiple Fallbacks) ---------- */
function ScrollToTop() {
  const { pathname } = useLocation();

  // Disable scroll restoration immediately
  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Immediate scroll reset before paint
  useLayoutEffect(() => {
    // Temporarily disable smooth scrolling
    const htmlStyle = document.documentElement.style.scrollBehavior;
    const bodyStyle = document.body.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";

    // Multiple scroll reset attempts
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.documentElement.scrollLeft = 0;
    document.body.scrollLeft = 0;

    // Restore scroll behavior after reset
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = htmlStyle;
      document.body.style.scrollBehavior = bodyStyle;
    }, 0);
  }, [pathname]);

  // Additional fallback attempts after paint
  useEffect(() => {
    // Multiple timed attempts to ensure scroll happens
    const timeouts = [
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 0),
      
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 10),
      
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 50),
      
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }, 100)
    ];

    return () => timeouts.forEach(clearTimeout);
  }, [pathname]);

  return null;
}

/* ---------- useReveal hook: fade-in on scroll ---------- */
function useReveal(selector = ".reveal", options = { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(selector));
    if (!("IntersectionObserver" in window) || els.length === 0) {
      els.forEach((el) => el.classList.add("reveal-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-in");
          io.unobserve(entry.target);
        }
      });
    }, options);
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [selector, options]);
}

/* ------------ ForexTicker ------------ */
function ForexTicker() {
  const pairs = useMemo(
    () => [
      "EUR/USD 1.1023",
      "USD/JPY 145.88",
      "GBP/USD 1.2765",
      "AUD/USD 0.6627",
      "USD/CAD 1.3421",
      "NZD/USD 0.6104",
      "USD/CHF 0.9312",
      "EUR/JPY 160.92",
    ],
    []
  );
  const items = [...pairs, ...pairs, ...pairs];
  return (
    <div className="ticker-wrap">
      <div className="ticker">
        {items.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ------------ NebulaLayer (fixed background under content) ------------ */
function NebulaLayer() {
  return (
    <div className="nebula-layer" aria-hidden="true">
      <div className="nebula-cloud n1" />
      <div className="nebula-cloud n2" />
      <div className="nebula-noise" />
    </div>
  );
}

/* ------------ VideoModal Component ------------ */
const VideoModal = ({ videoId, onClose }) => {
  if (!videoId) return null;
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="video-modal-close" onClick={onClose}>&times;</button>
        <iframe
          width="100%"
          height="100%"
          src={youtubeEmbedUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="What is Silent Equity?"
        ></iframe>
      </div>
    </div>
  );
};

/* ------------ HeroBackground (orbital glows + parallax grid + arc) ------------ */
function HeroBackground() {
  useEffect(() => {
    const root = document.documentElement;
    const onMouse = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      root.style.setProperty("--tilt-x", x.toFixed(3));
      root.style.setProperty("--tilt-y", y.toFixed(3));
    };
    const onScroll = () => {
      root.style.setProperty("--hero-scroll", String(window.scrollY * 0.02));
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return (
    <div className="hero-bg" aria-hidden="true">
      <div className="hero-orb o1" />
      <div className="hero-orb o2" />
      <div className="hero-grid" />
      <div className="hero-arc a1" />
    </div>
  );
}

/* ------------ HeroParticles (tiny drifting dots + rare arc streaks) ------------ */
function HeroParticles() {
  const N = 24;
  return (
    <div className="hero-particles" aria-hidden="true">
      {Array.from({ length: N }).map((_, i) => (
        <span key={i} className="hp" />
      ))}
      <span className="hp-streak s1" />
      <span className="hp-streak s2" />
    </div>
  );
}

/* ------------ Hero ------------ */
function Hero({ onShowVideo }) {
  useReveal(); // activate reveal on first mount
  return (
    <header className="hero section">
      <HeroBackground />
      <HeroParticles />
      <div className="hero-content container">
        <h1 className="reveal line">NO FAKE HYPE</h1>
        <h1 className="reveal line">NO GUESSING</h1>
        <p className="subtle reveal line">A focused community— Controlled growth through discipline.</p>
        <button
          className="cta-button-video reveal line"
          onClick={onShowVideo}
          aria-label="What is Silent Equity?"
          style={{ marginTop: "189px" }} // Increased from 60px to 120px
        >
          <span className="play-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </span>
          <span>What is Silent Equity?</span>
        </button>
      </div>
    </header>
  );
}


/* ------------ ShootingStars ------------ */
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
      const star = document.createElement("div");
      star.className = "shooting-star";
      const startX = Math.random() * rect.width;
      const startY = Math.random() * rect.height * 0.6;
      const length = 280 + Math.random() * 220;
      const angleDeg = -30 + Math.random() * -15;
      const angle = (angleDeg * Math.PI) / 180;
      const dx = Math.cos(angle) * length;
      const dy = Math.sin(angle) * length;
      star.style.setProperty("--sx", `${startX}px`);
      star.style.setProperty("--sy", `${startY}px`);
      star.style.setProperty("--dx", `${dx}px`);
      star.style.setProperty("--dy", `${dy}px`);
      star.style.setProperty("--rot", `${angleDeg}deg`);
      star.style.animation = `shoot ${1.4 + Math.random() * 0.8}s linear forwards`;
      layer.appendChild(star);
      setTimeout(() => star.remove(), 2600);
      const next = 500 + Math.random() * 1200;
      timer = setTimeout(spawn, next);
    }
    spawn();
    return () => {
      running = false;
      clearTimeout(timer);
    };
  }, []);
  return <div ref={ref} className="shooting-layer" />;
}

/* ------------ AboutYourself ------------ */
function AboutYourself() {
  useReveal();
  return (
    <section className="about section">
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <h2 className="reveal line">About yourself</h2>
        <p className="subtle reveal line" style={{ marginTop: 10 }}>
          The Silent Equity journey mirrors the early challenges every trader faces — uncertainty, drawdowns, and the
          grind. This space shares lessons, systems, and the mindset to navigate markets with clarity. Read this as the
          story that might be lived next — then write a better chapter here.
        </p>
        <div className="about-cta-wrap reveal line" style={{ marginTop: 12 }}>
          <Link className="readmore-cta" to="/story" aria-label="Read the full Silent Equity story">
            Read more
          </Link>
        </div>
      </div>
      <div className="css-comet c1" />
      <div className="css-comet c2" />
      <div className="css-comet c3" />
      <div className="css-comet c4" />
      <div className="css-comet c5" />
      <ShootingStars />
    </section>
  );
}

/* ------------ CommunityPrograms ------------ */
function CommunityPrograms() {
  useReveal();
  return (
    <section className="about section programs">
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <h2 className="reveal line">Community Programs</h2>
        <p className="subtle reveal line" style={{ marginTop: 10 }}>
          At Silent Equity, our commitment is to empower traders through disciplined learning and proven strategies. Our
          Community Programs are designed to guide members across all skill levels, from beginners forging their path to
          advanced traders seeking the ultimate edge. By joining our programs, you become part of a focused, supportive
          community dedicated to mastery, resilience, and consistent success.
        </p>
        <h3 className="reveal line" style={{ marginTop: 16 }}>Initiatives</h3>
        <ul className="init-list">
          <li className="reveal line">
            <strong>Code of Consistency:</strong> A structured course taking traders from beginner to professional with
            disciplined habits and a systematic trading approach.
          </li>
          <li className="reveal line">
            <strong>The Guaranteed Edge:</strong> An advanced program teaching a mathematically proven hedging method
            for high profitability and consistent returns.
          </li>
        </ul>
        <div className="about-cta-wrap reveal line" style={{ marginTop: 12 }}>
          <Link className="readmore-cta" to="/initiatives" aria-label="Join the initiatives">
            Join the initiatives
          </Link>
        </div>
      </div>
      <div className="css-comet c1" />
      <div className="css-comet c2" />
      <div className="css-comet c3" />
      <div className="css-comet c4" />
      <div className="css-comet c5" />
      <ShootingStars />
    </section>
  );
}

/* ------------ Reviews ------------ */
function Reviews() {
  useReveal();
  const data = [
    { q: '"Consistent setups, clearer rules."', a: "Aman, FX Swing" },
    { q: '"Weekly recaps changed my risk."', a: "Sara, Intraday" },
    { q: '"Accountability is the edge."', a: "Vik, Options" },
    { q: '"Clean charts. Clean mind."', a: "Rhea, Futures" },
    { q: '"Passed my eval this month."', a: "Kian, Prop FX" },
  ];
  const long = [...data, ...data, ...data];
  return (
    <section className="section">
      <div className="container reviews">
        <h2 className="reveal line">Reviews</h2>
        <div className="reviews-track" style={{ marginTop: 14 }}>
          {long.map((r, i) => (
            <div className="review-card reveal line" key={i}>
              <p style={{ fontWeight: 600 }}>{r.q}</p>
              <p className="subtle" style={{ marginTop: 8 }}>{r.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------ LeadForm ------------ */
function LeadForm() {
  useReveal();
  return (
    <section id="lead" className="section leadform-section">
      <div className="container">
        <h2 className="reveal line">Activate Your Silent Potential</h2>
        <form
          className="form reveal line"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Details submitted!");
          }}
        >
          <input className="input" placeholder="Full name" required />
          <input className="input" placeholder="Email" type="email" required />
          <textarea className="textarea" placeholder="What do you trade?" />
          <button className="button" type="submit">
            Submit details
          </button>
        </form>
      </div>
    </section>
  );
}

/* ------------ FloatingCTA (vertical only, right side) ------------ */
function FloatingCTA() {
  const [position, setPosition] = useState({ y: window.innerHeight * 0.6 });

  useEffect(() => {
    const paddingTop = 100; // Increased top padding
    const paddingBottom = 150; // Separate bottom padding to account for button height
    let y = window.innerHeight * 0.5; // Start more centered
    let vy = 0.3; // Reduced velocity for smoother movement
    let raf;
    
    const step = () => {
      const h = window.innerHeight;
      y += vy;
      
      // Better boundary checking
      if (y < paddingTop) {
        y = paddingTop;
        vy = Math.abs(vy); // Ensure positive velocity
      }
      if (y > h - paddingBottom) {
        y = h - paddingBottom;
        vy = -Math.abs(vy); // Ensure negative velocity
      }
      
      setPosition({ y });
      raf = requestAnimationFrame(step);
    };
    
    const onScroll = () => {
      // Gentler scroll influence
      y += (window.scrollY - y) * 0.0002;
    };
    
    raf = requestAnimationFrame(step);
    window.addEventListener("scroll", onScroll, { passive: true });
    
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Simple direct navigation
  const goToDiscord = () => {
    console.log("Discord button clicked!");
    window.location.href = "https://discord.gg/7gg93JBK";
  };

  return (
    <div 
      className="floating-cta" 
      style={{
        position: 'fixed',
        right: '20px',
        top: `${position.y}px`,
        zIndex: 9999,
        pointerEvents: 'auto'
      }}
    >
      <button
        onClick={goToDiscord}
        style={{
          background: 'linear-gradient(135deg,rgb(0, 101, 121) 0%,rgb(2, 74, 83) 100%)',
          border: 'none',
          borderRadius: '50px',
          padding: '9px 9px',
          color: 'white',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          fontSize: '10px',
          boxShadow: '0 4px 16px rgba(10, 69, 136, 0.3)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 20px rgba(10, 69, 136, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 16px rgba(10, 69, 136, 0.3)';
        }}
      >
        <svg width="20" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
        </svg>
        <span>JOIN DISCORD</span>
      </button>
    </div>
  );
}



/* ------------ Home wrapper for "/" route ------------ */
function Home() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const youtubeVideoId = "3aDXQZ5MKAs";
  return (
    <>
      <ForexTicker />
      <NebulaLayer />
      <Hero onShowVideo={() => setShowVideoModal(true)} />
      <AboutYourself />
      <CommunityPrograms />
      <Reviews />
      <LeadForm />
      <FloatingCTA />
      {showVideoModal && (
        <VideoModal videoId={youtubeVideoId} onClose={() => setShowVideoModal(false)} />
      )}
    </>
  );
}

/* ------------ App ------------ */
export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story" element={<Story />} />
        <Route path="initiatives" element={<Initiatives />} />
      </Routes>
    </>
  );
}
