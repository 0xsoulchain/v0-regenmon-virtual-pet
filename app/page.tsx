"use client"

import { useEffect, useState } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { type RegenmonData, loadRegenmon } from "@/lib/regenmon"
import { CreateScreen } from "@/components/create-screen"
import { PetScreen } from "@/components/pet-screen"
import { CoinHeader } from "@/components/coin-header"

export default function Home() {
  const [pet, setPet] = useState<RegenmonData | null | undefined>(undefined)
  const { user, isReady } = usePrivy()

  useEffect(() => {
    if (!isReady) return
    
    if (!user) {
      // User is not logged in - show login screen
      setPet(null)
    } else {
      // User is logged in - load their pet
      setPet(loadRegenmon())
    }
  }, [user, isReady])

  // Loading state while checking Privy
  if (!isReady || pet === undefined) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-float">
          <span className="text-5xl block mb-4" role="img" aria-label="cargando">
            {"🥚"}
          </span>
          <p className="text-[10px] text-muted-foreground">Cargando...</p>
        </div>
      </main>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <CoinHeader />
      
      <main className="flex-1">
        {!user ? (
          // Not logged in - show login screen
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/50">
            <div className="text-center">
              <div className="text-6xl mb-6">🍊</div>
              <h1 className="text-2xl font-bold mb-4 text-foreground">REGENMON</h1>
              <p className="text-sm text-muted-foreground mb-8">Crea y cuida tu mascota virtual</p>
              <p className="text-[10px] text-muted-foreground mb-6">Inicia sesión para comenzar</p>
            </div>
          </div>
        ) : pet === null ? (
          // User logged in but no pet - show creation screen
          <CreateScreen onCreated={(data) => setPet(data)} />
        ) : (
          // Pet exists - show pet screen
          <PetScreen data={pet} onReset={() => setPet(null)} onUpdate={(updated) => setPet(updated)} />
        )}
      </main>
    </div>
  )
}
