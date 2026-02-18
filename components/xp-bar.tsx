"use client"

interface XpBarProps {
  current: number
  required: number
}

export function XpBar({ current, required }: XpBarProps) {
  const percentage = required > 0 ? (current / required) * 100 : 0
  const displayPercentage = Math.round(percentage)

  return (
    <div className="relative w-full h-3 bg-background/30 border border-border/50 rounded-lg overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-300"
        style={{ width: `${displayPercentage}%` }}
      />
      <div className="absolute inset-0 pointer-events-none opacity-40" style={{
        backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)"
      }} />
    </div>
  )
}
