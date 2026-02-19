"use client"

import { useEffect, useState } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { type RegenmonData, loadRegenmon, saveRegenmon } from "@/lib/regenmon"
import { CreateScreen } from "@/components/create-screen"
import { PetScreen } from "@/components/pet-screen"

export default function Home() {
  const { user, isReady, login } = usePrivy()
  const [pet, setPet] = useState<RegenmonData | null | undefined>(undefined)

  useEffect(() => {
    if (isReady) {
      setPet(loadRegenmon())
    }
  }, [isReady])

  const handleLogin = () => {
    login()
  }

  const handleLogout = () => {
    // Logout functionality would be handled by Privy
    setPet(null)
  }

  // Loading state
  if (!isReady || pet === undefined) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/50">
        <div className="text-center animate-float">
          <span className="text-5xl block mb-4" role="img" aria-label="cargando">
            🥚
          </span>
          <p className="text-[10px] text-muted-foreground">Cargando...</p>
        </div>
      </main>
    )
  }

  // Not logged in
  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-6">🍊</div>
          <h1 className="text-3xl font-bold mb-2 text-foreground" style={{ fontFamily: "var(--font-pixel)" }}>
            REGENMON
          </h1>
          <p className="text-sm text-muted-foreground mb-8">Crea y cuida tu mascota virtual estilo Tamagotchi</p>

          <button
            onClick={handleLogin}
            className="nes-btn is-primary px-8 py-2 mb-4"
          >
            Iniciar Sesión con Privy
          </button>

          <p className="text-[8px] text-muted-foreground">
            Inicia sesión para guardar tu progreso
          </p>
        </div>
      </main>
    )
  }

  // Logged in but no pet
  if (pet === null) {
    return <CreateScreen onCreated={(data) => setPet(data)} />
  }

  // Pet exists
  return (
    <PetScreen
      data={pet}
      onReset={() => {
        setPet(null)
        handleLogout()
      }}
      onUpdate={(updated) => {
        setPet(updated)
        saveRegenmon(updated)
      }}
      userId={user.id}
    />
  )
}

