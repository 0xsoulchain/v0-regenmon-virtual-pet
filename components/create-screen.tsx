"use client"

import { useState } from "react"
import {
  type RegenmonType,
  type RegenmonData,
  REGENMON_TYPES,
  saveRegenmon,
} from "@/lib/regenmon"

interface CreateScreenProps {
  onCreated: (data: RegenmonData) => void
}

export function CreateScreen({ onCreated }: CreateScreenProps) {
  const [name, setName] = useState("")
  const [selectedType, setSelectedType] = useState<RegenmonType | null>(null)

  const isNameValid = name.trim().length >= 2 && name.trim().length <= 15
  const canCreate = isNameValid && selectedType !== null

  function handleCreate() {
    if (!canCreate || !selectedType) return

    const data: RegenmonData = {
      name: name.trim(),
      type: selectedType,
      happiness: 50,
      energy: 50,
      hunger: 50,
      createdAt: new Date().toISOString(),
    }

    saveRegenmon(data)
    onCreated(data)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="nes-container is-dark with-title">
          <p className="title text-xs">Nuevo</p>

          <h1 className="text-center text-sm md:text-base mb-8 text-foreground">
            Crea tu Regenmon
          </h1>

          {/* Name input */}
          <div className="mb-6">
            <label
              htmlFor="regenmon-name"
              className="block text-xs mb-3 text-foreground"
            >
              Nombre
            </label>
            <input
              id="regenmon-name"
              type="text"
              className="nes-input w-full text-xs"
              placeholder="2-15 letras"
              maxLength={15}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {name.length > 0 && !isNameValid && (
              <p className="text-destructive text-[8px] mt-2">
                {"Entre 2 y 15 caracteres"}
              </p>
            )}
          </div>

          {/* Type selection */}
          <div className="mb-8">
            <p className="text-xs mb-3 text-foreground">Elige tipo</p>
            <div className="grid grid-cols-1 gap-3">
              {(Object.keys(REGENMON_TYPES) as RegenmonType[]).map((type) => {
                const info = REGENMON_TYPES[type]
                const isSelected = selectedType === type
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`nes-btn ${isSelected ? "is-primary" : ""} w-full text-left`}
                    style={{
                      fontSize: "10px",
                      padding: "10px 12px",
                      ...(isSelected
                        ? {}
                        : {
                            backgroundColor: "hsl(220, 13%, 25%)",
                            color: "hsl(0, 0%, 95%)",
                          }),
                    }}
                  >
                    <span className="mr-2 text-base">{info.emoji}</span>
                    <span>{info.label}</span>
                    <span
                      className="ml-2 inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: info.color }}
                      aria-hidden="true"
                    />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Create button */}
          <button
            type="button"
            className={`nes-btn w-full ${canCreate ? "is-success" : "is-disabled"}`}
            disabled={!canCreate}
            onClick={handleCreate}
            style={{ fontSize: "11px", padding: "12px" }}
          >
            {"Eclosionar!"}
          </button>
        </div>

        {/* Decorative egg */}
        <div className="text-center mt-6 animate-float">
          <span className="text-5xl" role="img" aria-label="huevo">
            {"🥚"}
          </span>
        </div>
      </div>
    </main>
  )
}
