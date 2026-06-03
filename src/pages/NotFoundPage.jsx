import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-stone-50 px-8 py-16 text-center">
      {/* Dot grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* 404 glitch number */}
      <div
        className="relative z-10 select-none font-serif text-[clamp(96px,18vw,160px)] font-normal leading-none tracking-tighter text-stone-900"
        aria-label="404"
        style={{ fontFamily: "'DM Serif Display', serif" }}
      >
        {["4", "0", "4"].map((char, i) => (
          <span
            key={i}
            data-char={char}
            className="relative inline-block"
            style={{
              "--glitch-color-top": "#D85A30",
              "--glitch-color-bot": "#378ADD",
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Error tag */}
      <p
        className="relative z-10 mb-4 rounded-lg border border-stone-200 bg-stone-100 px-3 py-1 text-[11px] uppercase tracking-widest text-stone-500"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        error / page_not_found
      </p>

      {/* Headline */}
      <h1
        className="relative z-10 mb-3 mt-1 text-2xl font-normal italic text-stone-900"
        style={{ fontFamily: "'DM Serif Display', serif" }}
      >
        This page has gone missing.
      </h1>

      {/* Subtext */}
      <p className="relative z-10 mb-8 max-w-sm text-[15px] leading-relaxed text-stone-500">
        The page you're looking for doesn't exist or has been moved to another
        address.
      </p>

      {/* Home button */}
      <Link
        to="/"
        className="relative z-10 inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-[13px] text-stone-800 transition-colors duration-150 hover:bg-stone-100 active:scale-[0.97]"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        <svg
          className="h-4 w-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Go to home
      </Link>

      {/* Animated dots */}
      <div
        className="relative z-10 mt-10 flex items-center gap-1.5"
        aria-hidden="true"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-stone-300"
            style={{
              animation: `dotPulse 2s ${i * 0.3}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Glitch + dot animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&display=swap');

        [data-char]::before,
        [data-char]::after {
          content: attr(data-char);
          position: absolute;
          top: 0; left: 0; width: 100%;
        }
        [data-char]::before {
          color: #D85A30;
          clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
          animation: glitchTop 4s infinite;
        }
        [data-char]::after {
          color: #378ADD;
          clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
          animation: glitchBot 4s infinite;
        }
        @keyframes glitchTop {
          0%,90%,100% { transform:translate(0); opacity:0; }
          92% { transform:translate(-3px,-2px); opacity:1; }
          94% { transform:translate(3px,0); opacity:1; }
          96% { transform:translate(-2px,1px); opacity:1; }
          98% { opacity:0; }
        }
        @keyframes glitchBot {
          0%,91%,100% { transform:translate(0); opacity:0; }
          93% { transform:translate(3px,2px); opacity:1; }
          95% { transform:translate(-3px,0); opacity:1; }
          97% { transform:translate(2px,-1px); opacity:1; }
          99% { opacity:0; }
        }
        @keyframes dotPulse {
          0%,100% { opacity:0.3; transform:scale(1); }
          50%      { opacity:1;   transform:scale(1.5); }
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
