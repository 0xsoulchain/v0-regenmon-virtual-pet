"use client"

import { useEffect, useState } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { type RegenmonData, loadRegenmon, saveRegenmon } from "@/lib/regenmon"
import { initializeUserData, loadUserData } from "@/lib/user-manager"
import { CreateScreen } from "@/components/create-screen"
import { PetScreen } from "@/components/pet-screen"
import { CoinHeader } from "@/components/coin-header"

export default function Home() {
  const { user: privyUser, isReady, logout } = usePrivy()
  const [pet, setPet] = useState<RegenmonData | null | undefined>(undefined)
  const [userData, setUserData] = useState<any | null | undefined>(undefined)

  useEffect(() => {
    if (!isReady) return

    if (!privyUser) {
      // No authenticated user
      setUserData(null)
      setPet(null)
    } else {
      // Authenticated user
      const userdata = initializeUserData(privyUser)
      setUserData(userdata)

      // Load their pet if exists
      const pet = loadRegenmon()
      setPet(pet)
    }
  }, [privyUser, isReady])

  // Loading state
  if (!isReady || userData === undefined || pet === undefined) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-float">
          <span className="text-5xl block mb-4" role="img" aria-label="cargando">
            🥚
          </span>
          <p className="text-[10px] text-muted-foreground">Cargando...</p>
        </div>
      </main>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <CoinHeader user={privyUser} logout={logout} />

      <main className="flex-1">
        {!privyUser ? (
          // Not authenticated - show guest screen
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/50">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="text-6xl mb-6">🍊</div>
              <h1 className="text-3xl font-bold mb-2 text-foreground" style={{ fontFamily: "var(--font-pixel)" }}>
                REGENMON
              </h1>
              <p className="text-sm text-muted-foreground mb-8">Crea y cuida tu mascota virtual estilo Tamagotchi</p>

              <p className="text-[10px] text-muted-foreground mb-6">Inicia sesión con Google o Email para comenzar</p>

              <button
                type="button"
                className="nes-btn is-primary px-8 py-2"
                onClick={() => {
                  // Privy login will be triggered via their button in the header
                }}
              >
                Iniciar Sesión
              </button>

              <p className="text-[8px] text-muted-foreground mt-6">
                Modo invitado: Algunos datos no se guardaran sin iniciar sesión
              </p>
            </div>
          </div>
        ) : pet === null ? (
          // Authenticated but no pet - show creation screen
          <CreateScreen onCreated={(data) => setPet(data)} />
        ) : (
          // Pet exists - show pet screen
          <PetScreen
            data={pet}
            onReset={() => {
              setPet(null)
              if (privyUser) {
                const updatedData = initializeUserData(privyUser)
                setUserData(updatedData)
              }
            }}
            onUpdate={(updated) => setPet(updated)}
          />
        )}
      </main>
    </div>
  )
}
