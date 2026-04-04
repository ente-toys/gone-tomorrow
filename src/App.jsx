import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";

const QUESTIONS = [
  { question: "Could your family access your phone?", weakInsight: "Your phone and everything on it would be locked." },
  { question: "Could they access your email?", weakInsight: "Your email — and every account tied to it — would be inaccessible." },
  { question: "Could they access your computer?", weakInsight: "Your computer and its files would be locked." },
  { question: "Could they access your saved photos and documents?", weakInsight: "Your photos and documents could be lost forever." },
  { question: "Could your family log into your bank accounts and pay next month's rent?", weakInsight: "Your family could lose access to money when they need it most." },
  { question: "Could they find your insurance policies?", weakInsight: "Critical insurance policies may be unfindable." },
  { question: "Would they know about all your debts — loans, credit cards, anything owed?", weakInsight: "Debts they don't know about could spiral." },
  { question: "Would they know about all your investment or retirement accounts?", weakInsight: "Investment or retirement accounts could go unnoticed." },
  { question: "Do they know where your will is?", weakInsight: "Your family wouldn't know where your will is — or if one exists." },
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

function getShareCopy(score) {
  if (score <= 3) return `Just got ${score}/12 on this. Brutal. gonetomorrow.fyi`;
  if (score <= 7) return `Got ${score}/12 on this. More gaps than I expected. gonetomorrow.fyi`;
  if (score <= 10) return `Scored ${score}/12. Curious where you'd land. gonetomorrow.fyi`;
  return `Got ${score}/12 on this. Curious where you'd land. gonetomorrow.fyi`;
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
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 768px)").matches);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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

  const buttons = (
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
  );

  if (!isMobile) {
    // Desktop/tablet: everything centered together, original layout
    return (
      <div style={{
        minHeight: "100dvh", display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "40px 24px",
      }}>
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

          {buttons}
        </div>
      </div>
    );
  }

  // Mobile: question centered, buttons pinned to bottom
  return (
    <div style={{
      minHeight: "100dvh", display: "flex", flexDirection: "column",
      padding: "40px 24px",
    }}>
      <div style={{
        display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap",
        paddingTop: "env(safe-area-inset-top, 0px)",
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
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          maxWidth: 520, width: "100%",
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
            textAlign: "center", margin: 0,
          }}>{q.question}</h2>
        </div>
      </div>

      <div style={{
        maxWidth: 520, margin: "0 auto", width: "100%",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        opacity: flash ? 0.6 : 1, transition: "opacity 80ms ease",
      }}>
        {buttons}
      </div>
    </div>
  );
}

// Results screen
function Results({ scores, onRetake }) {
  const total = scores.reduce((a, b) => a + b, 0);
  const tier = getTier(total);
  const weakQs = scores.map((s, i) => s === 0 ? i : -1).filter(i => i >= 0);
  const [visible, setVisible] = useState(false);
  const cardRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 768px)").matches);

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const [sharing, setSharing] = useState(false);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const renderCard = async () => {
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 3,
      useCORS: true,
    });
    return new Promise(resolve => canvas.toBlob(resolve, "image/png"));
  };

  const handleShare = async () => {
    if (!cardRef.current || sharing) return;
    setSharing(true);
    try {
      const blob = await renderCard();
      if (isMobile) {
        const file = new File([blob], "gone-tomorrow-score.png", { type: "image/png" });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file] });
        } else {
          downloadBlob(blob);
        }
      } else {
        downloadBlob(blob);
      }
    } catch (e) {
      if (e.name !== "AbortError") console.error("Share failed:", e);
    } finally {
      setSharing(false);
    }
  };

  const downloadBlob = (blob) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "gone-tomorrow-score.png";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleSend = async () => {
    if (!cardRef.current || sending) return;
    setSending(true);
    try {
      const blob = await renderCard();
      const file = new File([blob], "gone-tomorrow.png", { type: "image/png" });
      const text = getShareCopy(total);

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ text, files: [file] });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      if (e.name !== "AbortError") console.error("Send failed:", e);
    } finally {
      setSending(false);
    }
  };

  const shareBtnStyle = {
    flex: 1,
    background: "#1A1A1A",
    border: "1px solid #2A2A2A",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#F5F0EB",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'Outfit', sans-serif",
  };

  return (
    <div style={{
      minHeight: "100dvh", display: "flex", flexDirection: "column",
      alignItems: "center", padding: "40px 20px",
      fontFamily: "'Outfit', sans-serif",
      opacity: visible ? 1 : 0, transition: "opacity 0.5s ease",
    }}>

      {/* ===== SCORE CARD (html2canvas capture area) ===== */}
      <div ref={cardRef} style={{
        background: "#1A1A1A",
        border: "1px solid #2A2A2A",
        borderRadius: 12,
        padding: "28px 24px 20px",
        textAlign: "center",
        width: "100%",
        maxWidth: 400,
      }}>
        {/* Card header */}
        <p style={{
          fontSize: 11,
          letterSpacing: 2.5,
          textTransform: "uppercase",
          color: "#6A6560",
          margin: "0 0 6px",
        }}>Gone Tomorrow</p>
        <p style={{
          fontSize: 13,
          color: "#9A9590",
          margin: "0 0 16px",
          lineHeight: 1.45,
        }}>Could your family access everything without you?</p>

        {/* Score */}
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 64,
          fontWeight: 700,
          color: tier.color,
          margin: 0,
          lineHeight: 1,
        }}>
          {total}
          <span style={{ fontSize: 28, color: "#6A6560", fontWeight: 400 }}>/12</span>
        </p>

        {/* Tier label + description */}
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 20,
          color: "#F5F0EB",
          margin: "12px 0 6px",
          fontWeight: 600,
        }}>{tier.label}</p>
        <p style={{
          fontSize: 13,
          color: "#9A9590",
          margin: "0 0 20px",
          lineHeight: 1.5,
        }}>{tier.desc}</p>

        {/* Gaps breakdown (inside card for PNG) */}
        {weakQs.length > 0 && (
          <div style={{
            borderTop: "1px solid #2A2A2A",
            paddingTop: 16,
            textAlign: "left",
          }}>
            <p style={{
              fontSize: 11,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "#6A6560",
              margin: "0 0 12px",
            }}>Where the gaps are</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {weakQs.map(qi => (
                <div key={qi} style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                  <span style={{ color: tier.color, fontSize: 8, marginTop: 4 }}>●</span>
                  <span style={{ fontSize: 13, color: "#D5D0CB", lineHeight: 1.4 }}>{QUESTIONS[qi].weakInsight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Card footer */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20,
          paddingTop: 14,
          borderTop: "1px solid #2A2A2A",
        }}>
          <span style={{ fontSize: 11, color: "#5A5550" }}>gonetomorrow.fyi</span>
          <a
            href="https://ente.com/locker/?ref=gonetomorrow"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 11, color: "#5A5550", textDecoration: "none" }}
          >Toy by Ente</a>
        </div>
      </div>

      {/* ===== SHARE BUTTONS ===== */}
      <div style={{
        display: "flex",
        gap: 10,
        marginTop: 16,
        width: "100%",
        maxWidth: 400,
      }}>
        <button onClick={handleShare} disabled={sharing} style={{
          ...shareBtnStyle,
          cursor: sharing ? "wait" : "pointer",
          opacity: sharing ? 0.8 : 1,
        }}>{sharing ? "Generating..." : "Share card"}</button>
        <button onClick={handleSend} disabled={sending} style={{
          ...shareBtnStyle,
          color: copied ? "#6BCB77" : "#F5F0EB",
          borderColor: copied ? "#6BCB77" : "#2A2A2A",
          cursor: sending ? "wait" : "pointer",
          opacity: sending ? 0.8 : 1,
        }}>{copied ? "Copied!" : sending ? "Generating..." : "Send to someone"}</button>
      </div>

      {/* ===== WHY WE BUILT THIS (never in PNG) ===== */}
      <div style={{
        marginTop: 32,
        paddingTop: 24,
        borderTop: "1px solid #1A1A1A",
        width: "100%",
        maxWidth: 400,
      }}>
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 18,
          color: "#F5F0EB",
          margin: "0 0 8px",
          lineHeight: 1.4,
          textAlign: "center",
        }}>
          Why we built this
        </p>
        <p style={{
          fontSize: 13,
          color: "#9A9590",
          textAlign: "center",
          margin: 0,
          lineHeight: 1.5,
        }}>
          We kept hearing the same story — someone passes away and their family spends months just trying to find the passwords, the policies, the paperwork. It shouldn't be that way. So we built{" "}
          <a
            href="https://ente.com/locker/?ref=gonetomorrow"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#D5D0CB", textDecoration: "none" }}
          >Ente Locker</a>
          {" "}— a safe space for your most important documents, with a way to pass them on automatically in an emergency.
        </p>
      </div>

      {/* ===== RETAKE ===== */}
      <div style={{ textAlign: "center", marginTop: 32 }}>
        <button onClick={onRetake} style={{
          background: "none",
          border: "none",
          fontSize: 13,
          color: "#5A5550",
          cursor: "pointer",
          fontFamily: "'Outfit', sans-serif",
        }}>↻ Retake the test</button>
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
