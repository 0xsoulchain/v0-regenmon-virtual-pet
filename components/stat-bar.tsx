"use client"

interface StatBarProps {
  label: string
  emoji: string
  value: number
  color: string
}

export function StatBar({ label, emoji, value, color }: StatBarProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] md:text-[10px] text-foreground">
          {emoji} {label}
        </span>
        <span className="text-[9px] md:text-[10px] text-foreground">
          {value}/100
        </span>
      </div>
      <div
        className="w-full h-6 border-4"
        style={{
          borderColor: "#212529",
          backgroundColor: "hsl(220, 13%, 25%)",
          imageRendering: "pixelated",
        }}
      >
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${value}%`,
            backgroundColor: color,
            imageRendering: "pixelated",
          }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${value} de 100`}
        />
      </div>
    </div>
  )
}
