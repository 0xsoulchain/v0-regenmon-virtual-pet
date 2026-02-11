"use client"

import { useState } from "react"
import {
  type RegenmonData,
  REGENMON_TYPES,
  deleteRegenmon,
} from "@/lib/regenmon"
import { StatBar } from "@/components/stat-bar"

interface PetScreenProps {
  data: RegenmonData
  onReset: () => void
}

export function PetScreen({ data, onReset }: PetScreenProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const typeInfo = REGENMON_TYPES[data.type]

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
          <div className="animate-float animate-pulse-glow" style={{ color: typeInfo.color }}>
            <span
              className="text-6xl md:text-7xl block"
              role="img"
              aria-label={typeInfo.label}
            >
              {typeInfo.emoji}
            </span>
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
              value={data.happiness}
              color="#4ade80"
            />
            <StatBar
              label={"Energia"}
              emoji={"⚡️"}
              value={data.energy}
              color="#facc15"
            />
            <StatBar
              label="Hambre"
              emoji={"🍎"}
              value={data.hunger}
              color="#f87171"
            />
          </div>
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
