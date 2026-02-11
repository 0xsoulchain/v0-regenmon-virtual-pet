"use client"

import { useMemo } from "react"
import type { RegenmonType } from "@/lib/regenmon"

interface ParticleProps {
  type: RegenmonType
}

function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 6,
    duration: 4 + Math.random() * 4,
    size: 4 + Math.random() * 6,
    opacity: 0.15 + Math.random() * 0.25,
  }))
}

function WaterDrops() {
  const particles = useMemo(() => generateParticles(12), [])
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-rain-drop"
          style={{
            left: `${p.left}%`,
            top: "-10px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
          }}
        >
          <svg width={p.size} height={p.size * 1.4} viewBox="0 0 10 14" fill="none">
            <path d="M5 0 L9 8 Q9 13 5 13 Q1 13 1 8 Z" fill="#60a5fa" />
          </svg>
        </div>
      ))}
    </div>
  )
}

function FallingLeaves() {
  const particles = useMemo(() => generateParticles(10), [])
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-fall-leaf"
          style={{
            left: `${p.left}%`,
            top: "-10px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration + 2}s`,
            opacity: p.opacity,
          }}
        >
          <svg width={p.size} height={p.size} viewBox="0 0 12 12" fill="none">
            <ellipse cx="6" cy="6" rx="5" ry="3" fill="#4ade80" transform="rotate(-30 6 6)" />
            <line x1="6" y1="3" x2="6" y2="9" stroke="#2d8a4e" strokeWidth="0.5" />
          </svg>
        </div>
      ))}
    </div>
  )
}

function ElectricSparks() {
  const particles = useMemo(() => generateParticles(14), [])
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-spark"
          style={{
            left: `${p.left}%`,
            top: `${10 + Math.random() * 80}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${1 + Math.random() * 2}s`,
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: `${p.size * 0.6}px`,
              height: `${p.size * 0.6}px`,
              backgroundColor: "#facc15",
              boxShadow: "0 0 6px 2px rgba(250, 204, 21, 0.6)",
              opacity: p.opacity + 0.2,
            }}
          />
        </div>
      ))}
    </div>
  )
}

export function BackgroundParticles({ type }: ParticleProps) {
  switch (type) {
    case "gota":
      return <WaterDrops />
    case "semilla":
      return <FallingLeaves />
    case "chispa":
      return <ElectricSparks />
    default:
      return null
  }
}
