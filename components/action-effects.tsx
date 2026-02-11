"use client"

import { useEffect, useState } from "react"

interface ActionEffectProps {
  action: "play" | "sleep" | "eat" | null
  onComplete: () => void
}

function PlayEffect() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-play-particle"
          style={{
            animationDelay: `${i * 0.1}s`,
            transform: `rotate(${i * 60}deg) translateY(-40px)`,
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: "#4ade80",
              boxShadow: "0 0 8px 2px rgba(74, 222, 128, 0.7)",
            }}
          />
        </div>
      ))}
    </div>
  )
}

function SleepEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {["Z", "z", "Z"].map((letter, i) => (
        <span
          key={i}
          className="absolute animate-zzz text-foreground"
          style={{
            right: `${20 + i * 12}%`,
            top: "20%",
            fontSize: `${14 - i * 2}px`,
            animationDelay: `${i * 0.3}s`,
            opacity: 0,
            color: "#a78bfa",
            textShadow: "0 0 6px rgba(167, 139, 250, 0.6)",
          }}
        >
          {letter}
        </span>
      ))}
    </div>
  )
}

function EatEffect() {
  const foods = ["*", "*", "*", "*", "*"]
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {foods.map((_, i) => (
        <div
          key={i}
          className="absolute animate-eat-pop"
          style={{
            left: `${25 + Math.random() * 50}%`,
            top: `${30 + Math.random() * 30}%`,
            animationDelay: `${i * 0.15}s`,
            opacity: 0,
          }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: "#f87171",
              boxShadow: "0 0 6px 1px rgba(248, 113, 113, 0.5)",
            }}
          />
        </div>
      ))}
    </div>
  )
}

export function ActionEffect({ action, onComplete }: ActionEffectProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (action) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        onComplete()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [action, onComplete])

  if (!visible || !action) return null

  switch (action) {
    case "play":
      return <PlayEffect />
    case "sleep":
      return <SleepEffect />
    case "eat":
      return <EatEffect />
    default:
      return null
  }
}
