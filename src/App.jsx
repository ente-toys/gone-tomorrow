import { useState, useEffect, useRef } from "react";

const QUESTIONS = [
  { question: "Could your family log into your bank accounts and pay next month's rent?", weakInsight: "Your family could lose access to money when they need it most." },
  { question: "Would they know about all your debts — loans, credit cards, anything owed?", weakInsight: "Debts they don't know about could spiral." },
  { question: "Could they find your insurance policies?", weakInsight: "Critical insurance policies may be unfindable." },
  { question: "Do they know where your will is?", weakInsight: "Your family wouldn't know where your will is — or if one exists." },
  { question: "Could they access your phone?", weakInsight: "Your phone and everything on it would be locked." },
  { question: "Could they access your email?", weakInsight: "Your email — and every account tied to it — would be inaccessible." },
  { question: "Could they access your computer?", weakInsight: "Your computer and its files would be locked." },
  { question: "Would they know which subscriptions and services to cancel?", weakInsight: "Subscriptions and services would keep charging with no one to cancel them." },
  { question: "Would they know about all your investment or retirement accounts?", weakInsight: "Investment or retirement accounts could go unnoticed." },
  { question: "Have you told someone specific where to find the important stuff?", weakInsight: "No one has been told what to do or where to look." },
  { question: "Is any of this written down somewhere your family could find?", weakInsight: "Nothing is written down — it all disappears with you." },
  { question: "Have you actually had the conversation — what to do if something happens to you?", weakInsight: "The most important conversation hasn't happened yet." },
];

function getTier(score) {
  if (score >= 11) return { label: "They'd be okay", color: "#6BCB77", desc: "Your family could carry on. You've done the work." };
  if (score >= 8) return { label: "Some loose ends", color: "#E8A838", desc: "Most things are covered. A few gaps would hurt." };
  if (score >= 4) return { label: "Too much in your head", color: "#E07A4A", desc: "Your family would figure it out — but it would take months." };
  return { label: "They'd be starting over", color: "#D95555", desc: "Almost everything your family needs is locked in your head." };
}

const FONTS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');
`;

// Landing screen
function Landing({ onStart }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  return (
    <div style={{
      minHeight: "100dvh", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center", padding: "40px 24px",
      opacity: visible ? 1 : 0, transition: "opacity 0.6s ease",
    }}>
      <div style={{ maxWidth: 520, textAlign: "center" }}>
        <p style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500,
          letterSpacing: "0.15em", textTransform: "uppercase", color: "#E8A838",
          marginBottom: 28,
        }}>Gone Tomorrow</p>

        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 7vw, 44px)",
          fontWeight: 600, lineHeight: 1.2, color: "#F5F0EB", margin: "0 0 24px 0",
        }}>
          If something happened to you tomorrow, would your family know what to do?
        </h1>

        <p style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 17, color: "#9A9590",
          lineHeight: 1.6, margin: "0 0 48px 0",
        }}>
          12 questions. 90 seconds. Find the gaps before they matter.
        </p>

        <button onClick={onStart} style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 500,
          background: "#E8A838", color: "#0F0F0F", border: "none",
          padding: "16px 48px", borderRadius: 8, cursor: "pointer",
          letterSpacing: "0.02em", transition: "transform 0.15s ease, box-shadow 0.15s ease",
        }}
          onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 4px 20px rgba(232,168,56,0.3)"; }}
          onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = ""; }}
        >
          Take the Test
        </button>
      </div>

      <a href="https://ente.com/locker/?ref=gonetomorrow" target="_blank" rel="noopener noreferrer"
        style={{
          position: "fixed", bottom: 24, fontFamily: "'Outfit', sans-serif",
          fontSize: 12, color: "#5A5550", letterSpacing: "0.03em",
          textDecoration: "none", transition: "color 0.2s ease",
        }}
        onMouseEnter={e => e.target.style.color = "#9A9590"}
        onMouseLeave={e => e.target.style.color = "#5A5550"}
      >Toy by <span style={{ fontWeight: 600 }}>Ente</span></a>
    </div>
  );
}

// Quiz screen
function Quiz({ onComplete }) {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState([]);
  const [flash, setFlash] = useState(false);

  const handleAnswer = (pts) => {
    const newScores = [...scores, pts];
    if (current < 11) {
      setScores(newScores);
      setCurrent(c => c + 1);
      setFlash(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setFlash(false)));
    } else {
      onComplete(newScores);
    }
  };

  const q = QUESTIONS[current];

  const btnStyle = {
    fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 500,
    flex: 1, padding: "16px 12px", borderRadius: 10, cursor: "pointer",
    textAlign: "center", transition: "all 0.15s ease",
    color: "#D5D0CB", background: "#1A1A1A",
    border: "1px solid #2A2A2A",
  };

  return (
    <div style={{
      minHeight: "100dvh", display: "flex", flexDirection: "column",
      justifyContent: "center", padding: "40px 24px",
    }}>
      {/* Dot indicator */}
      <div style={{
        display: "flex", gap: 6, justifyContent: "center", marginBottom: 48, flexWrap: "wrap",
      }}>
        {QUESTIONS.map((_, i) => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: "50%",
            background: i <= current ? "#E8A838" : "#2A2A2A",
            transition: "background 0.3s ease",
          }} />
        ))}
      </div>

      <div style={{
        maxWidth: 520, margin: "0 auto", width: "100%",
        opacity: flash ? 0.6 : 1, transition: "opacity 80ms ease",
      }}>
        <p style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500,
          color: "#5A5550", letterSpacing: "0.1em", textTransform: "uppercase",
          marginBottom: 16, textAlign: "center",
        }}>Question {current + 1} of 12</p>

        <h2 style={{
          fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 5vw, 26px)",
          fontWeight: 600, color: "#F5F0EB", lineHeight: 1.35,
          textAlign: "center", margin: "0 0 36px 0",
        }}>{q.question}</h2>

        <div style={{ display: "flex", gap: 14 }}>
          <button onClick={() => handleAnswer(1)} style={btnStyle}
            onMouseEnter={e => { e.target.style.borderColor = "#3A3A3A"; e.target.style.background = "#222"; }}
            onMouseLeave={e => { e.target.style.borderColor = "#2A2A2A"; e.target.style.background = "#1A1A1A"; }}
          >Yes</button>
          <button onClick={() => handleAnswer(0)} style={btnStyle}
            onMouseEnter={e => { e.target.style.borderColor = "#3A3A3A"; e.target.style.background = "#222"; }}
            onMouseLeave={e => { e.target.style.borderColor = "#2A2A2A"; e.target.style.background = "#1A1A1A"; }}
          >Not really</button>
        </div>
      </div>
    </div>
  );
}

// Score bar with fill animation
function ScoreBar({ score, color, animate }) {
  const pct = Math.round((score / 12) * 100);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setWidth(pct), 100);
      return () => clearTimeout(t);
    } else {
      setWidth(pct);
    }
  }, [pct, animate]);

  return (
    <div style={{
      width: "100%", height: 10, background: "#2A2A2A", borderRadius: 5, overflow: "hidden",
    }}>
      <div style={{
        width: `${width}%`, height: "100%", background: color,
        borderRadius: 5, transition: animate ? "width 1s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
      }} />
    </div>
  );
}

// Results screen
function Results({ scores, onRetake }) {
  const total = scores.reduce((a, b) => a + b, 0);
  const tier = getTier(total);
  const riskAreas = scores.filter(s => s === 0).length;
  const weakQs = scores.map((s, i) => s === 0 ? i : -1).filter(i => i >= 0);
  const [visible, setVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  const handleShare = async () => {
    const url = "https://gonetomorrow.fyi";
    if (navigator.share) {
      try {
        await navigator.share({ title: "Gone Tomorrow", text: `I scored ${total}/12 on the Gone Tomorrow test. "${tier.label}" — ${tier.desc}`, url });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(`I scored ${total}/12 on the Gone Tomorrow test. "${tier.label}" — ${tier.desc}\n${url}`);
        alert("Copied to clipboard!");
      } catch {}
    }
  };

  return (
    <div style={{
      minHeight: "100dvh", padding: "24px 16px 60px",
      opacity: visible ? 1 : 0, transition: "opacity 0.5s ease",
    }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>

        {/* ===== SCORE CARD ===== */}
        <div ref={cardRef} style={{
          background: "#1A1A1A", borderRadius: 16, padding: "32px 24px 20px",
          border: "1px solid #2A2A2A",
        }}>
          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600,
            letterSpacing: "0.2em", textTransform: "uppercase", color: "#E8A838",
            margin: "0 0 6px 0",
          }}>Gone Tomorrow</p>
          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 400,
            color: "#D5D0CB", margin: "0 0 28px 0", lineHeight: 1.45,
          }}>Could your family access everything without you?</p>

          {/* Score */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 10 }}>
            <span style={{
              fontFamily: "'Playfair Display', serif", fontSize: "clamp(72px, 18vw, 96px)", fontWeight: 700,
              color: tier.color, lineHeight: 1,
            }}>{total}</span>
            <span style={{
              fontFamily: "'Outfit', sans-serif", fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 300,
              color: "#5A5550",
            }}>/12</span>
          </div>

          <ScoreBar score={total} color={tier.color} animate={true} />

          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 600,
            color: tier.color, margin: "20px 0 4px 0",
          }}>{tier.label}</p>
          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "#9A9590",
            margin: "0 0 20px 0", lineHeight: 1.5,
          }}>{tier.desc}</p>

          <div style={{
            paddingTop: 16, marginTop: 4, borderTop: "1px solid #2A2A2A",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500,
              color: "#E8A838", letterSpacing: "0.01em",
            }}>gonetomorrow.fyi</span>
            <a href="https://ente.com/locker/?ref=gonetomorrow" target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "#7A7570",
                textDecoration: "none", letterSpacing: "0.03em",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#B0A8A0"}
              onMouseLeave={e => e.currentTarget.style.color = "#7A7570"}
            >Toy by <span style={{ fontWeight: 600 }}>Ente</span></a>
          </div>
        </div>

        {/* ===== SHARE CTA (immediately after card) ===== */}
        <button onClick={handleShare} style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600,
          color: "#1A1A1A", background: "#E8A838", border: "none",
          padding: "14px 24px", borderRadius: 10, cursor: "pointer",
          width: "100%", marginTop: 20,
          transition: "background 0.2s, transform 0.1s",
        }}
          onMouseEnter={e => e.target.style.background = "#F0B848"}
          onMouseLeave={e => e.target.style.background = "#E8A838"}
          onTouchStart={e => e.target.style.transform = "scale(0.98)"}
          onTouchEnd={e => e.target.style.transform = "scale(1)"}
        >Share your results</button>

        {/* ===== BREAKDOWN ===== */}
        {weakQs.length > 0 ? (
          <div style={{ marginTop: 36 }}>
            <h3 style={{
              fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600,
              color: "#F5F0EB", margin: "0 0 12px 0",
            }}>Where the gaps are</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {weakQs.map(qi => (
                <div key={qi} style={{
                  background: "#161616", border: "1px solid #222",
                  borderRadius: 6, padding: "8px 12px",
                  borderLeft: "3px solid " + tier.color,
                }}>
                  <p style={{
                    fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#D5D0CB",
                    margin: 0, lineHeight: 1.4, whiteSpace: "nowrap", overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>{QUESTIONS[qi].weakInsight}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            marginTop: 36, background: "#161616", border: "1px solid #222",
            borderRadius: 12, padding: "24px", borderLeft: "3px solid #6BCB77",
          }}>
            <p style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "#D5D0CB",
              margin: 0, lineHeight: 1.6,
            }}>
              You've done the work most people haven't. Your family would have access,
              information, and a clear path forward. That's rare — and it matters.
            </p>
          </div>
        )}

        {/* ===== RETAKE ===== */}
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <button onClick={onRetake} style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 400,
            color: "#6A6560", background: "transparent", border: "none",
            padding: "10px 12px", cursor: "pointer", textDecoration: "underline",
            textUnderlineOffset: 3,
          }}>Retake</button>
        </div>
      </div>
    </div>
  );
}

// Main App
export default function GoneTomorrow() {
  const [screen, setScreen] = useState("landing"); // landing | quiz | results
  const [scores, setScores] = useState([]);

  const startQuiz = () => setScreen("quiz");
  const finishQuiz = (s) => { setScores(s); setScreen("results"); window.scrollTo(0, 0); };
  const retake = () => { setScores([]); setScreen("landing"); window.scrollTo(0, 0); };

  return (
    <>
      <style>{FONTS_CSS}{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0F0F0F; -webkit-font-smoothing: antialiased; }
      `}</style>
      <div style={{ background: "#0F0F0F", minHeight: "100dvh", color: "#F5F0EB" }}>
        {screen === "landing" && <Landing onStart={startQuiz} />}
        {screen === "quiz" && <Quiz onComplete={finishQuiz} />}
        {screen === "results" && <Results scores={scores} onRetake={retake} />}
      </div>
    </>
  );
}
