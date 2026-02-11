"use client"

export function RegenmonLogo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <svg
        width="32"
        height="32"
        viewBox="0 0 16 16"
        fill="none"
        style={{ imageRendering: "pixelated" }}
        aria-hidden="true"
      >
        {/* Egg shape */}
        <rect x="5" y="2" width="6" height="1" fill="#4ade80" />
        <rect x="4" y="3" width="8" height="1" fill="#4ade80" />
        <rect x="3" y="4" width="10" height="2" fill="#4ade80" />
        <rect x="3" y="6" width="10" height="2" fill="#60a5fa" />
        <rect x="3" y="8" width="10" height="2" fill="#facc15" />
        <rect x="4" y="10" width="8" height="2" fill="#facc15" />
        <rect x="5" y="12" width="6" height="1" fill="#60a5fa" />
        {/* Crack */}
        <rect x="6" y="5" width="1" height="1" fill="#1a1a2e" />
        <rect x="7" y="6" width="2" height="1" fill="#1a1a2e" />
        <rect x="8" y="5" width="1" height="1" fill="#1a1a2e" />
        <rect x="5" y="7" width="1" height="1" fill="#1a1a2e" />
        <rect x="9" y="7" width="1" height="1" fill="#1a1a2e" />
        {/* Sparkle top-right */}
        <rect x="13" y="1" width="1" height="3" fill="#facc15" opacity="0.8" />
        <rect x="12" y="2" width="3" height="1" fill="#facc15" opacity="0.8" />
        {/* Sparkle top-left */}
        <rect x="1" y="3" width="1" height="2" fill="#4ade80" opacity="0.6" />
        <rect x="0" y="4" width="3" height="1" fill="#4ade80" opacity="0.6" />
      </svg>
      <div className="flex flex-col items-start">
        <span
          className="text-sm md:text-base font-bold tracking-wider"
          style={{
            background: "linear-gradient(90deg, #4ade80, #60a5fa, #facc15)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 8px rgba(74, 222, 128, 0.4))",
          }}
        >
          REGENMON
        </span>
      </div>
    </div>
  )
}
