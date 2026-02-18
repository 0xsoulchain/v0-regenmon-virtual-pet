"use client"

interface XpBarProps {
  xpActual: number
  xpRequired: number
  level: number
  isLevelingUp?: boolean
}

export function XpBar({ xpActual, xpRequired, level, isLevelingUp }: XpBarProps) {
  const percentage = xpRequired > 0 ? (xpActual / xpRequired) * 100 : 0
  const displayPercentage = Math.round(percentage)

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="text-foreground">NIVEL {level}</span>
        <span className={`text-foreground ${isLevelingUp ? "animate-pulse" : ""}`}>
          {xpActual}/{xpRequired} XP
        </span>
      </div>
      <div className="relative w-full h-4 bg-black border-2 border-white overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300 ${
            isLevelingUp ? "animate-pulse" : ""
          }`}
          style={{ width: `${displayPercentage}%` }}
        />
        <div className="absolute inset-0 pointer-events-none border-l border-white/50" />
      </div>
      <div className="text-xs text-center text-foreground/60">{displayPercentage}%</div>
    </div>
  )
}
