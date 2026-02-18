"use client"

import { useEffect, useState } from "react"

interface LevelUpAnimationProps {
  level: number
  onComplete?: () => void
}

export function LevelUpAnimation({ level, onComplete }: LevelUpAnimationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [stars, setStars] = useState<Array<{ id: number; left: string; delay: string }>>([])

  useEffect(() => {
    // Generate random stars
    const newStars = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 80 + 10}%`,
      delay: `${Math.random() * 0.4}s`,
    }))
    setStars(newStars)

    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 1800)

    return () => clearTimeout(timer)
  }, [level, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {/* Background shine effect */}
      <div className="absolute inset-0 animate-level-up-shine" style={{
        background: "radial-gradient(circle at center, rgba(250, 204, 21, 0.2) 0%, transparent 70%)"
      }} />

      {/* Main text container */}
      <div className="relative animate-level-up-pop">
        <div className="text-center">
          <div className="font-bold mb-4" style={{
            fontSize: "48px",
            color: "#facc15",
            textShadow: "0 0 20px rgba(250, 204, 21, 0.8), 0 4px 12px rgba(0, 0, 0, 0.4)",
            fontFamily: '"Press Start 2P", monospace',
            letterSpacing: "2px",
          }}>
            ¡NIVEL UP!
          </div>
          <div style={{
            fontSize: "32px",
            color: "#fef3c7",
            textShadow: "0 0 12px rgba(250, 204, 21, 0.6), 0 2px 8px rgba(0, 0, 0, 0.3)",
            fontFamily: '"Press Start 2P", monospace',
            letterSpacing: "1px",
          }}>
            NIVEL {level}
          </div>
        </div>
      </div>

      {/* Decorative stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute animate-level-up-star"
          style={{
            left: star.left,
            top: "50%",
            animationDelay: star.delay,
            fontSize: "24px",
          }}
        >
          ✨
        </div>
      ))}
    </div>
  )
}
