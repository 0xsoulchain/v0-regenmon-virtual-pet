"use client"

import { useState, useEffect, useCallback } from "react"
import {
  type RegenmonData,
  REGENMON_TYPES,
  saveRegenmon,
  deleteRegenmon,
} from "@/lib/regenmon"
import { StatBar } from "@/components/stat-bar"
import { SharkSprite, TreeSprite, BatterySprite } from "@/components/pet-sprites"
import { RegenmonLogo } from "@/components/regenmon-logo"
import { BackgroundParticles } from "@/components/background-particles"
import { ActionEffect } from "@/components/action-effects"

interface PetScreenProps {
  data: RegenmonData
  onReset: () => void
  onUpdate: (data: RegenmonData) => void
}

function PetIllustration({ type, color }: { type: string; color: string }) {
  switch (type) {
    case "gota":
      return <SharkSprite color={color} size={140} />
    case "semilla":
      return <TreeSprite color={color} size={140} />
    case "chispa":
      return <BatterySprite color={color} size={140} />
    default:
      return null
  }
}

export function PetScreen({ data, onReset, onUpdate }: PetScreenProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [stats, setStats] = useState({
    happiness: data.happiness,
    energy: data.energy,
    hunger: data.hunger,
  })
  const [activeAction, setActiveAction] = useState<"play" | "sleep" | "eat" | null>(null)
  const [petAnim, setPetAnim] = useState("")
  const typeInfo = REGENMON_TYPES[data.type]

  const persistStats = useCallback(
    (newStats: { happiness: number; energy: number; hunger: number }) => {
      const updated: RegenmonData = { ...data, ...newStats }
      saveRegenmon(updated)
      onUpdate(updated)
    },
    [data, onUpdate],
  )

  // Automatic decay: every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => {
        const next = {
          happiness: Math.max(0, prev.happiness - 1),
          energy: Math.max(0, prev.energy - 1),
          hunger: Math.min(100, prev.hunger + 1),
        }
        const updated: RegenmonData = { ...data, ...next }
        saveRegenmon(updated)
        onUpdate(updated)
        return next
      })
    }, 60_000)

    return () => clearInterval(interval)
  }, [data, onUpdate])

  function doAction(
    action: "play" | "sleep" | "eat",
    stat: "happiness" | "energy" | "hunger",
    delta: number,
    animClass: string,
  ) {
    if (activeAction) return
    setActiveAction(action)
    setPetAnim(animClass)

    setStats((prev) => {
      const raw = prev[stat] + delta
      const clamped = Math.max(0, Math.min(100, raw))
      const next = { ...prev, [stat]: clamped }
      persistStats(next)
      return next
    })
  }

  function clearAction() {
    setActiveAction(null)
    setPetAnim("")
  }

  function handleReset() {
    deleteRegenmon()
    onReset()
  }

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background particles */}
      <BackgroundParticles type={data.type} />

      {/* Header with logo */}
      <header className="relative z-10 flex items-center justify-between p-3 md:p-4 border-b-4 border-border">
        <RegenmonLogo />
        <button
          type="button"
          className="nes-btn is-error"
          style={{ fontSize: "7px", padding: "6px 10px" }}
          onClick={() => setShowConfirm(true)}
        >
          Reiniciar
        </button>
      </header>

      {/* Pet display area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        {/* Pet name - prominent */}
        <h2
          className="text-lg md:text-xl mb-2 text-center tracking-wide"
          style={{
            color: typeInfo.color,
            textShadow: `0 0 12px ${typeInfo.color}, 0 0 24px ${typeInfo.color}40`,
          }}
        >
          {data.name}
        </h2>
        <p
          className="text-[9px] mb-4"
          style={{ color: typeInfo.color, opacity: 0.7 }}
        >
          {typeInfo.label}
        </p>

        {/* Pet card */}
        <div
          className={`relative w-full max-w-sm border-4 ${typeInfo.borderColor} ${typeInfo.bgClass} p-6 md:p-8 mb-6`}
          style={{ minHeight: "200px" }}
        >
          {/* Action effects overlay */}
          <ActionEffect action={activeAction} onComplete={clearAction} />

          {/* Pet sprite */}
          <div
            className={`flex items-center justify-center animate-float animate-pulse-glow ${petAnim}`}
            style={{ color: typeInfo.color }}
          >
            <PetIllustration type={data.type} color={typeInfo.color} />
          </div>
        </div>

        {/* Stats */}
        <div className="w-full max-w-sm">
          <div className="nes-container is-dark">
            <StatBar
              label="Felicidad"
              emoji={"<3"}
              value={stats.happiness}
              color="#4ade80"
            />
            <StatBar
              label={"Energia"}
              emoji={">>"}
              value={stats.energy}
              color="#facc15"
            />
            <StatBar
              label="Hambre"
              emoji={"!!"}
              value={stats.hunger}
              color="#f87171"
            />
          </div>
        </div>

        {/* Action buttons - redesigned */}
        <div className="w-full max-w-sm mt-5 grid grid-cols-3 gap-3">
          <button
            type="button"
            className={`action-btn action-btn-play ${activeAction === "play" ? "animate-btn-press" : ""}`}
            onClick={() => doAction("play", "happiness", 1, "animate-pet-bounce")}
            disabled={stats.happiness >= 100 || activeAction !== null}
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" style={{ imageRendering: "pixelated" }} aria-hidden="true">
              <rect x="3" y="2" width="2" height="12" fill="#4ade80" />
              <rect x="5" y="4" width="2" height="8" fill="#4ade80" />
              <rect x="7" y="5" width="2" height="6" fill="#4ade80" />
              <rect x="9" y="6" width="2" height="4" fill="#4ade80" />
              <rect x="11" y="7" width="2" height="2" fill="#4ade80" />
            </svg>
            <span>Jugar</span>
          </button>
          <button
            type="button"
            className={`action-btn action-btn-sleep ${activeAction === "sleep" ? "animate-btn-press" : ""}`}
            onClick={() => doAction("sleep", "energy", 1, "animate-pet-breathe")}
            disabled={stats.energy >= 100 || activeAction !== null}
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" style={{ imageRendering: "pixelated" }} aria-hidden="true">
              <rect x="4" y="3" width="4" height="2" fill="#a78bfa" />
              <rect x="6" y="5" width="2" height="1" fill="#a78bfa" />
              <rect x="4" y="6" width="4" height="2" fill="#a78bfa" />
              <rect x="8" y="8" width="6" height="2" fill="#a78bfa" />
              <rect x="10" y="10" width="2" height="1" fill="#a78bfa" />
              <rect x="8" y="11" width="6" height="2" fill="#a78bfa" />
            </svg>
            <span>Dormir</span>
          </button>
          <button
            type="button"
            className={`action-btn action-btn-eat ${activeAction === "eat" ? "animate-btn-press" : ""}`}
            onClick={() => doAction("eat", "hunger", -1, "animate-pet-munch")}
            disabled={stats.hunger <= 0 || activeAction !== null}
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" style={{ imageRendering: "pixelated" }} aria-hidden="true">
              <rect x="6" y="1" width="4" height="2" fill="#22c55e" />
              <rect x="5" y="3" width="6" height="1" fill="#22c55e" />
              <rect x="3" y="4" width="10" height="3" fill="#f87171" />
              <rect x="3" y="7" width="10" height="2" fill="#ef4444" />
              <rect x="3" y="9" width="10" height="2" fill="#dc2626" />
              <rect x="4" y="11" width="8" height="2" fill="#dc2626" />
              <rect x="5" y="13" width="6" height="1" fill="#b91c1c" />
              {/* Seeds */}
              <rect x="5" y="5" width="1" height="1" fill="#facc15" />
              <rect x="8" y="6" width="1" height="1" fill="#facc15" />
              <rect x="10" y="5" width="1" height="1" fill="#facc15" />
            </svg>
            <span>Comer</span>
          </button>
        </div>

        {/* Created date */}
        <p className="text-[7px] md:text-[8px] text-muted-foreground mt-5 text-center">
          Creado el{" "}
          {new Date(data.createdAt).toLocaleDateString("es", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Confirm dialog */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.80)" }}
        >
          <div className="nes-container is-dark with-title w-full max-w-xs">
            <p className="title text-[8px]">Cuidado</p>
            <p className="text-[9px] mb-6 text-foreground leading-relaxed">
              {"Seguro que quieres reiniciar? Se perdera tu Regenmon para siempre."}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className="nes-btn is-error flex-1"
                style={{ fontSize: "8px", padding: "8px" }}
                onClick={handleReset}
              >
                {"Si, borrar"}
              </button>
              <button
                type="button"
                className="nes-btn flex-1"
                style={{
                  fontSize: "8px",
                  padding: "8px",
                  backgroundColor: "hsl(220, 13%, 25%)",
                  color: "hsl(0, 0%, 95%)",
                }}
                onClick={() => setShowConfirm(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
