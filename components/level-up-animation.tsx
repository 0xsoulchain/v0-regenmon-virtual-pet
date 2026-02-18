"use client"

import { useEffect, useState } from "react"

interface LevelUpAnimationProps {
  level: number
  onComplete?: () => void
}

export function LevelUpAnimation({ level, onComplete }: LevelUpAnimationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 2000)

    return () => clearTimeout(timer)
  }, [level, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
      <div className="relative">
        {/* Círculo de fondo */}
        <div className="absolute inset-0 rounded-full bg-yellow-400/30 animate-pulse blur-3xl" />

        {/* Texto principal */}
        <div className="relative animate-level-up text-center">
          <div className="text-6xl font-black text-yellow-300 drop-shadow-lg" style={{
            textShadow: "0 0 20px rgba(253, 224, 71, 0.8)",
          }}>
            LEVEL UP!
          </div>
          <div className="text-4xl font-black text-white drop-shadow-lg mt-2">
            NIVEL {level}
          </div>
        </div>

        {/* Estrellas decorativas */}
        <div className="absolute top-0 left-0 text-2xl animate-bounce" style={{ animationDelay: "0s" }}>
          ✨
        </div>
        <div className="absolute top-0 right-0 text-2xl animate-bounce" style={{ animationDelay: "0.2s" }}>
          ✨
        </div>
        <div className="absolute bottom-0 left-0 text-2xl animate-bounce" style={{ animationDelay: "0.4s" }}>
          ⭐
        </div>
        <div className="absolute bottom-0 right-0 text-2xl animate-bounce" style={{ animationDelay: "0.6s" }}>
          ⭐
        </div>
      </div>
    </div>
  )
}
