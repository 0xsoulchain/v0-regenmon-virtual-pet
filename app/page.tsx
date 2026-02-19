"use client"

import { useEffect, useState } from "react"
import { type RegenmonData, loadRegenmon } from "@/lib/regenmon"
import { CreateScreen } from "@/components/create-screen"
import { PetScreen } from "@/components/pet-screen"

export default function Home() {
  const [pet, setPet] = useState<RegenmonData | null | undefined>(undefined)

  useEffect(() => {
    setPet(loadRegenmon())
  }, [])

  // Loading state while checking localStorage
  if (pet === undefined) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-float">
          <span className="text-5xl block mb-4" role="img" aria-label="cargando">
            🥚
          </span>
          <p className="text-[10px] text-muted-foreground">Cargando...</p>
        </div>
      </main>
    )
  }

  // No pet saved — show creation screen
  if (pet === null) {
    return <CreateScreen onCreated={(data) => setPet(data)} />
  }

  // Pet exists — show pet screen
  return <PetScreen data={pet} onReset={() => setPet(null)} onUpdate={(updated) => setPet(updated)} userId={null} />
}
