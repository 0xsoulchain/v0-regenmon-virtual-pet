"use client"

import { useEffect, useState } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { type RegenmonData, loadRegenmon, saveRegenmon } from "@/lib/regenmon"
import { CreateScreen } from "@/components/create-screen"
import { PetScreen } from "@/components/pet-screen"
import { DynamicHeader } from "@/components/dynamic-header"
import { getUserData, registerSession, unregisterSession } from "@/lib/managers/user-data-manager"
import { getUserId } from "@/lib/managers/auth-manager"

export default function Home() {
  const { user, isReady, logout } = usePrivy()
  const [pet, setPet] = useState<RegenmonData | null | undefined>(undefined)
  const [coins, setCoins] = useState(0)

  useEffect(() => {
    if (!isReady) return

    if (user) {
      // Usuario autenticado
      const userId = getUserId(user)
      if (userId) {
        registerSession(userId)
        const userData = getUserData(userId)
        setCoins(userData.monedas)
        setPet(userData.regenmon)
      }
    } else {
      // Usuario invitado (modo offline)
      setPet(loadRegenmon())
      setCoins(0)
    }
  }, [user, isReady])

  const handleLogout = () => {
    if (user) {
      const userId = getUserId(user)
      if (userId) {
        unregisterSession(userId)
      }
    }
    logout()
  }

  // Loading state
  if (!isReady || pet === undefined) {
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

  return (
    <div className="flex flex-col min-h-screen">
      <DynamicHeader 
        user={user} 
        coins={coins} 
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {!user ? (
          // Modo invitado - sin botón de login (usar Privy modal)
          pet === null ? (
            <CreateScreen onCreated={(data) => setPet(data)} />
          ) : (
            <PetScreen 
              data={pet} 
              onReset={() => setPet(null)} 
              onUpdate={(updated) => setPet(updated)}
              userId={null}
              onCoinsChange={setCoins}
            />
          )
        ) : (
          // Usuario autenticado
          pet === null ? (
            <CreateScreen onCreated={(data) => setPet(data)} />
          ) : (
            <PetScreen 
              data={pet} 
              onReset={() => setPet(null)} 
              onUpdate={(updated) => setPet(updated)}
              userId={getUserId(user)}
              onCoinsChange={setCoins}
            />
          )
        )}
      </main>
    </div>
  )
}
