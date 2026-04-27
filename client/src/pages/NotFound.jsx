import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

const keywords = [
  "Cr7 - A goal-scoring machine", "CR7 is the GOAT", "Messi is washed",
  "Arsenal are Premier League champions ", "Man United = Manure", "wagmi.js",
  "MU - Living on past glory",
];

export default function NotFound() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function spawnTag() {
      const tag = document.createElement("div");
      tag.textContent = keywords[Math.floor(Math.random() * keywords.length)];
      tag.style.cssText = `
        position: absolute;
        font-family: monospace;
        font-size: 11px;
        color: rgba(168, 85, 247, 0.55);
        white-space: nowrap;
        left: ${Math.random() * 90}%;
        bottom: -20px;
        pointer-events: none;
        animation: floatTag ${6 + Math.random() * 8}s linear forwards;
      `;
      el.appendChild(tag);
      setTimeout(() => tag.remove(), 15000);
    }

    for (let i = 0; i < 6; i++) setTimeout(spawnTag, i * 800);
    const interval = setInterval(spawnTag, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @keyframes floatTag {
          0%   { transform: translateY(0);      opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(-600px); opacity: 0; }
        }
        @keyframes glitchMain {
          0%, 94%, 100% { transform: translate(0); }
          95%  { transform: translate(-2px,  1px); }
          97%  { transform: translate( 2px, -1px); }
        }
        @keyframes glitchA {
          0%, 94%, 100% { transform: translate(0); opacity: 0; }
          95%  { transform: translate( 5px, 0); opacity: 1; }
          97%  { transform: translate(-5px, 0); opacity: 1; }
        }
        @keyframes glitchB {
          0%, 94%, 100% { transform: translate(0); opacity: 0; }
          96%  { transform: translate(-5px, 0); opacity: 1; }
          98%  { transform: translate( 5px, 0); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseBorder {
          0%, 100% { box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.4); }
          50%      { box-shadow: 0 0 0 8px rgba(147, 51, 234, 0); }
        }

        .nf-glitch {
          font-family: monospace;
          font-size: clamp(90px, 18vw, 150px);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -4px;
          color: #ffffff;
          position: relative;
          animation: glitchMain 3s infinite;
          user-select: none;
          text-shadow: 0 0 60px rgba(147, 51, 234, 0.6);
        }
        .nf-glitch::before,
        .nf-glitch::after {
          content: '404';
          position: absolute;
          inset: 0;
          font-family: monospace;
          font-size: clamp(90px, 18vw, 150px);
          font-weight: 800;
          letter-spacing: -4px;
        }
        .nf-glitch::before {
          color: #a855f7;
          animation: glitchA 3s infinite;
          clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%);
        }
        .nf-glitch::after {
          color: #60a5fa;
          animation: glitchB 3s infinite;
          clip-path: polygon(0 60%, 100% 60%, 100% 75%, 0 75%);
        }

        .nf-btn-primary {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 11px 28px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.15s;
          animation: pulseBorder 2.5s infinite;
        }
        .nf-btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }
        .nf-btn-primary:active { transform: scale(0.97); }

        .nf-btn-ghost {
          background: transparent;
          color: #9ca3af;
          border: 1px solid #374151;
          border-radius: 10px;
          padding: 11px 28px;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s, transform 0.15s;
        }
        .nf-btn-ghost:hover { background: rgba(255,255,255,0.05); color: #fff; transform: translateY(-1px); }
        .nf-btn-ghost:active { transform: scale(0.97); }
      `}</style>

      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "3rem 1.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow blobs — same as HomePage */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 -left-40 h-150 w-150 bg-purple-600/20 blur-[120px]"
          style={{ zIndex: 0 }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-1/2 -right-40 h-150 w-150 bg-blue-500/40 blur-[120px]"
          style={{ zIndex: 0 }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-0 -left-40 h-150 w-150 bg-purple-600/30 blur-[120px]"
          style={{ zIndex: 0 }}
        />

        {/* Floating keywords */}
        <div
          ref={containerRef}
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Doc icon */}
        <div style={{ animation: "fadeUp 0.7s ease 0.1s both", marginBottom: "1.25rem", zIndex: 2 }}>
          <svg width="60" height="72" viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="44" height="58" rx="5" fill="rgba(124,58,237,0.12)" stroke="rgba(124,58,237,0.4)" strokeWidth="1.2"/>
            <path d="M37 1v13h8" stroke="rgba(124,58,237,0.4)" strokeWidth="1.2" fill="none"/>
            <rect x="9" y="22" width="28" height="2" rx="1" fill="rgba(168,85,247,0.35)"/>
            <rect x="9" y="28" width="20" height="2" rx="1" fill="rgba(168,85,247,0.25)"/>
            <rect x="9" y="34" width="24" height="2" rx="1" fill="rgba(168,85,247,0.25)"/>
            <circle cx="46" cy="58" r="13" fill="#131722" stroke="rgba(124,58,237,0.5)" strokeWidth="1.2"/>
            <text x="46" y="63" textAnchor="middle" fontFamily="monospace" fontSize="15" fontWeight="700" fill="#e879f9">?</text>
          </svg>
        </div>

        {/* 404 glitch */}
        <div className="nf-glitch" style={{ zIndex: 2 }}>404</div>

        <p
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "4px",
            color: "rgba(168,85,247,0.7)",
            textTransform: "uppercase",
            margin: "0.5rem 0 1.5rem",
            animation: "fadeUp 0.7s ease 0.3s both",
            zIndex: 2,
          }}
        >
          page not found
        </p>

        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 0.75rem",
            animation: "fadeUp 0.7s ease 0.5s both",
            zIndex: 2,
          }}
        >
          Tài liệu đã bay mất rồi!
        </h1>

        <p
          style={{
            fontSize: "15px",
            color: "#9ca3af",
            maxWidth: "380px",
            lineHeight: 1.7,
            margin: "0 0 2.25rem",
            animation: "fadeUp 0.7s ease 0.65s both",
            zIndex: 2,
          }}
        >
          Trang bạn đang tìm không tồn tại, đã bị xóa hoặc đường dẫn bị sai.
          Thử quay lại trang chủ hoặc tìm kiếm tài liệu khác nhé.
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "fadeUp 0.7s ease 0.8s both",
            zIndex: 2,
          }}
        >
          <button className="nf-btn-primary" onClick={() => navigate("/")}>
            Về trang chủ
          </button>
          <button className="nf-btn-ghost" onClick={() => navigate(-1)}>
            Quay lại
          </button>
        </div>
      </div>
    </>
  );
}