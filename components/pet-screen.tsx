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

interface PetScreenProps {
  data: RegenmonData
  onReset: () => void
  onUpdate: (data: RegenmonData) => void
}

function PetIllustration({ type, color }: { type: string; color: string }) {
  switch (type) {
    case "gota":
      return <SharkSprite color={color} size={120} />
    case "semilla":
      return <TreeSprite color={color} size={120} />
    case "chispa":
      return <BatterySprite color={color} size={120} />
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

  function adjustStat(stat: "happiness" | "energy" | "hunger", delta: number) {
    setStats((prev) => {
      const raw = prev[stat] + delta
      const clamped = Math.max(0, Math.min(100, raw))
      const next = { ...prev, [stat]: clamped }
      persistStats(next)
      return next
    })
  }

  function handleReset() {
    deleteRegenmon()
    onReset()
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-3 md:p-4 border-b-4 border-border">
        <h1 className="text-[10px] md:text-xs text-foreground">
          {"🥚"} Regenmon
        </h1>
        <button
          type="button"
          className="nes-btn is-error"
          style={{ fontSize: "8px", padding: "6px 10px" }}
          onClick={() => setShowConfirm(true)}
        >
          Reiniciar
        </button>
      </header>

      {/* Pet display area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        {/* Pet card */}
        <div
          className={`w-full max-w-sm border-4 ${typeInfo.borderColor} ${typeInfo.bgClass} p-6 md:p-8 mb-6 text-center`}
        >
          <p className="text-[10px] md:text-xs mb-4 text-foreground font-bold">
            {data.name}
          </p>
          <div className="animate-float animate-pulse-glow flex items-center justify-center" style={{ color: typeInfo.color }}>
            <PetIllustration type={data.type} color={typeInfo.color} />
          </div>
          <p
            className="mt-4 text-[8px]"
            style={{ color: typeInfo.color }}
          >
            {typeInfo.label}
          </p>
        </div>

        {/* Stats */}
        <div className="w-full max-w-sm">
          <div className="nes-container is-dark">
            <StatBar
              label="Felicidad"
              emoji={"💚"}
              value={stats.happiness}
              color="#4ade80"
            />
            <StatBar
              label={"Energia"}
              emoji={"⚡️"}
              value={stats.energy}
              color="#facc15"
            />
            <StatBar
              label="Hambre"
              emoji={"🍎"}
              value={stats.hunger}
              color="#f87171"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="w-full max-w-sm mt-4 grid grid-cols-3 gap-2">
          <button
            type="button"
            className="nes-btn is-success"
            style={{ fontSize: "7px", padding: "10px 4px", lineHeight: "1.6" }}
            onClick={() => adjustStat("happiness", 1)}
            disabled={stats.happiness >= 100}
          >
            {"💚 Aumentar Felicidad"}
          </button>
          <button
            type="button"
            className="nes-btn is-warning"
            style={{ fontSize: "7px", padding: "10px 4px", lineHeight: "1.6" }}
            onClick={() => adjustStat("energy", 1)}
            disabled={stats.energy >= 100}
          >
            {"⚡ Aumentar Energia"}
          </button>
          <button
            type="button"
            className="nes-btn is-primary"
            style={{ fontSize: "7px", padding: "10px 4px", lineHeight: "1.6" }}
            onClick={() => adjustStat("hunger", -1)}
            disabled={stats.hunger <= 0}
          >
            {"🍎 Dar Comida"}
          </button>
        </div>

        {/* Created date */}
        <p className="text-[7px] md:text-[8px] text-muted-foreground mt-4 text-center">
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
          style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
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
