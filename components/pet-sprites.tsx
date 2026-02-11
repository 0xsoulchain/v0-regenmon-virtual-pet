"use client"

interface SpriteProps {
  color: string
  size?: number
}

export function SharkSprite({ color, size = 120 }: SpriteProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      style={{ imageRendering: "pixelated" }}
      role="img"
      aria-label="Gota"
    >
      {/* Body */}
      <rect x="4" y="5" width="8" height="5" fill={color} />
      <rect x="3" y="6" width="1" height="4" fill={color} />
      <rect x="12" y="6" width="1" height="4" fill={color} />
      <rect x="5" y="4" width="6" height="1" fill={color} />
      <rect x="5" y="10" width="6" height="1" fill={color} />
      {/* Dorsal fin */}
      <rect x="7" y="2" width="2" height="2" fill={color} />
      <rect x="8" y="1" width="1" height="1" fill={color} />
      {/* Tail */}
      <rect x="13" y="5" width="1" height="1" fill={color} />
      <rect x="14" y="4" width="1" height="2" fill={color} />
      <rect x="13" y="9" width="1" height="1" fill={color} />
      <rect x="14" y="9" width="1" height="2" fill={color} />
      {/* Eye */}
      <rect x="5" y="6" width="2" height="2" fill="white" />
      <rect x="5" y="7" width="1" height="1" fill="#1a1a2e" />
      {/* Mouth */}
      <rect x="3" y="8" width="3" height="1" fill="#1a1a2e" />
      {/* Belly */}
      <rect x="5" y="9" width="6" height="1" fill="white" opacity="0.3" />
    </svg>
  )
}

export function TreeSprite({ color, size = 120 }: SpriteProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      style={{ imageRendering: "pixelated" }}
      role="img"
      aria-label="Semilla"
    >
      {/* Trunk */}
      <rect x="7" y="11" width="2" height="4" fill="#8B5E3C" />
      <rect x="6" y="14" width="4" height="1" fill="#8B5E3C" />
      {/* Leaves - bottom */}
      <rect x="3" y="8" width="10" height="3" fill={color} />
      {/* Leaves - middle */}
      <rect x="4" y="6" width="8" height="2" fill={color} />
      {/* Leaves - top */}
      <rect x="5" y="4" width="6" height="2" fill={color} />
      <rect x="6" y="3" width="4" height="1" fill={color} />
      <rect x="7" y="2" width="2" height="1" fill={color} />
      {/* Highlight */}
      <rect x="5" y="5" width="2" height="1" fill="white" opacity="0.25" />
      <rect x="4" y="7" width="2" height="1" fill="white" opacity="0.25" />
      {/* Eyes */}
      <rect x="6" y="8" width="1" height="1" fill="#1a1a2e" />
      <rect x="9" y="8" width="1" height="1" fill="#1a1a2e" />
      {/* Smile */}
      <rect x="7" y="9" width="2" height="1" fill="#1a1a2e" />
    </svg>
  )
}

export function BatterySprite({ color, size = 120 }: SpriteProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      style={{ imageRendering: "pixelated" }}
      role="img"
      aria-label="Chispa"
    >
      {/* Battery top terminal */}
      <rect x="6" y="1" width="4" height="2" fill="#888" />
      {/* Battery body outline */}
      <rect x="4" y="3" width="8" height="11" fill={color} />
      <rect x="5" y="3" width="6" height="11" fill={color} />
      {/* Inner body */}
      <rect x="5" y="4" width="6" height="9" fill="#1a1a2e" />
      {/* Energy bars */}
      <rect x="6" y="10" width="4" height="2" fill={color} />
      <rect x="6" y="7" width="4" height="2" fill={color} opacity="0.7" />
      <rect x="6" y="5" width="4" height="1" fill={color} opacity="0.4" />
      {/* Lightning bolt */}
      <rect x="8" y="5" width="1" height="1" fill="white" />
      <rect x="7" y="6" width="2" height="1" fill="white" />
      <rect x="7" y="7" width="1" height="1" fill="white" />
      <rect x="8" y="8" width="1" height="1" fill="white" />
      {/* Eyes */}
      <rect x="6" y="10" width="1" height="1" fill="#1a1a2e" />
      <rect x="9" y="10" width="1" height="1" fill="#1a1a2e" />
      {/* Smile */}
      <rect x="7" y="11" width="2" height="1" fill="#1a1a2e" />
    </svg>
  )
}
