import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";

const EnteLogo = ({ height = 14, color = "#5A5550" }) => (
  <svg height={height} viewBox="0 0 844 264" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M225.65 175.02H75.0694C82.344 192.768 98.6376 201.649 123.957 201.649C139.382 201.649 152.621 196.554 163.674 186.369L216.051 223.039C194.807 250.103 163.53 263.632 122.213 263.632C85.2607 263.632 55.5763 252.861 33.1734 231.327C11.0601 209.503 0 181.998 0 148.824C0 115.651 10.9084 88.442 32.7321 66.3218C54.5558 44.2085 82.344 33.1484 116.097 33.1484C149.849 33.1484 175.603 44.0637 196.841 65.8874C218.085 87.4215 228.704 114.775 228.704 147.949C228.704 158.133 227.684 167.152 225.65 175.013V175.02ZM74.1937 124.822H157.993C152.463 104.453 138.789 94.2686 116.965 94.2686C95.1417 94.2686 80.3029 104.453 74.1937 124.822Z" fill={color}/>
    <path d="M372.127 33.1613C396.281 33.1613 415.63 41.4564 430.179 58.0397C445.018 74.3333 452.437 97.3223 452.437 127.007V257.521H379.981V136.171C379.981 125.11 377.071 116.671 371.251 110.851C365.432 104.742 357.426 101.687 347.242 101.687C335.892 101.687 327.018 105.176 320.619 112.161C314.51 118.856 311.448 128.606 311.448 141.404V257.515H238.992V39.2568H311.448V61.0805C324.542 42.4562 344.767 33.1406 372.12 33.1406L372.127 33.1613Z" fill={color}/>
    <path d="M611.041 39.2689V108.677H565.649V171.969C565.649 181.285 568.849 187.249 575.247 189.87C581.943 192.2 593.872 192.924 611.041 192.056V257.534C567.98 262.774 537.42 258.844 519.381 245.749C501.922 232.069 493.193 208.066 493.193 173.728V108.691H460.461V39.2827H493.193V0H565.649V39.2827H611.041V39.2689Z" fill={color}/>
    <path d="M840.438 175.02H689.858C697.132 192.768 713.426 201.649 738.739 201.649C754.163 201.649 767.402 196.554 778.456 186.369L830.833 223.039C809.588 250.103 778.311 263.632 736.994 263.632C700.035 263.632 670.358 252.861 647.955 231.327C625.841 209.503 614.781 181.998 614.781 148.824C614.781 115.651 625.69 88.442 647.52 66.3218C669.344 44.2085 697.132 33.1484 730.885 33.1484C764.637 33.1484 790.391 44.0637 811.629 65.8874C832.873 87.4215 843.492 114.775 843.492 147.949C843.492 158.133 842.472 167.152 840.438 175.013V175.02ZM688.982 124.822H772.781C767.258 104.453 753.577 94.2686 731.754 94.2686C709.93 94.2686 695.091 104.453 688.982 124.822Z" fill={color}/>
  </svg>
);

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
          position: "fixed", bottom: 24,
          textDecoration: "none", transition: "opacity 0.2s ease",
          display: "flex", alignItems: "center", gap: 6,
          opacity: 0.5,
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
        onMouseLeave={e => e.currentTarget.style.opacity = "0.5"}
      ><span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "#5A5550" }}>By</span> <EnteLogo height={12} /></a>
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
  const [gapsOpen, setGapsOpen] = useState(false);

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
      alignItems: "center", justifyContent: "center", padding: "40px 20px",
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

        {/* Card footer */}
        <div style={{
          marginTop: 20,
          paddingTop: 14,
          borderTop: "1px solid #2A2A2A",
          textAlign: "center",
        }}>
          <span style={{ fontSize: 11, color: "#5A5550" }}>gonetomorrow.fyi</span>
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

      {/* ===== GAPS LINK + DIALOG ===== */}
      {weakQs.length > 0 && (
        <>
          <button
            onClick={() => setGapsOpen(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13,
              color: "#5A5550",
              marginTop: 14,
              padding: 0,
            }}
            onMouseEnter={e => e.target.style.color = "#9A9590"}
            onMouseLeave={e => e.target.style.color = "#5A5550"}
          >See where the gaps are</button>

          {gapsOpen && (
            <div
              onClick={() => setGapsOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: 20,
              }}
            >
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  background: "#1A1A1A",
                  border: "1px solid #2A2A2A",
                  borderRadius: 12,
                  padding: "20px 20px",
                  width: "100%",
                  maxWidth: 400,
                  maxHeight: "80dvh",
                  overflowY: "auto",
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}>
                  <p style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 11,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "#6A6560",
                    margin: 0,
                  }}>Where the gaps are</p>
                  <button
                    onClick={() => setGapsOpen(false)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#6A6560",
                      fontSize: 18,
                      cursor: "pointer",
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >×</button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {weakQs.map(qi => (
                    <div key={qi} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                      <span style={{ color: tier.color, fontSize: 8, flexShrink: 0, marginTop: 4 }}>●</span>
                      <span style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 14,
                        color: "#D5D0CB",
                        lineHeight: 1.4,
                      }}>{QUESTIONS[qi].weakInsight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

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
          We kept hearing the same story — someone passes away and their family spends months just trying to find the passwords, the policies, the paperwork. It shouldn't be that way. So we built Ente Locker — a safe space for your most important documents, with a way to pass them on automatically in an emergency.
        </p>
        <p style={{ textAlign: "center", margin: "12px 0 0", fontSize: 13 }}>
          <a
            href="https://ente.com/locker/?ref=gonetomorrow"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#F5F0EB",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >Try Ente Locker →</a>
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
          textDecoration: "underline",
        }}>Retake the test</button>
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
