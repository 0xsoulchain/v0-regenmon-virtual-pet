"use client"

import { useEffect, useState } from "react"
import { type RegenmonData, loadRegenmon, saveRegenmon } from "@/lib/regenmon"
import { getCurrentUser, logoutCurrentUser, verifyOTP, type AuthUser } from "@/lib/simple-auth"
import { LoginScreen } from "@/components/login-screen"
import { CreateScreen } from "@/components/create-screen"
import { PetScreen } from "@/components/pet-screen"

export default function Home() {
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined)
  const [pet, setPet] = useState<RegenmonData | null | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    if (currentUser) {
      setPet(loadRegenmon())
    } else {
      setPet(null)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (email: string) => {
    // El código OTP es verificado en LoginScreen, aquí solo recibimos el email
    // y el usuario ya está autenticado en simple-auth
    const authenticatedUser = getCurrentUser()
    if (authenticatedUser) {
      setUser(authenticatedUser)
      setPet(null)
    }
  }

  const handleLogout = () => {
    logoutCurrentUser()
    setUser(null)
    setPet(null)
  }

  // Loading state
  if (isLoading || user === undefined || pet === undefined) {
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

  // Not logged in — show login screen
  if (!user) {
    return <LoginScreen onLogin={handleLogin} />
  }

  // Logged in but no pet — show creation screen
  if (pet === null) {
    return <CreateScreen onCreated={(data) => setPet(data)} />
  }

  // Pet exists — show pet screen
  return (
    <PetScreen
      data={pet}
      onReset={handleLogout}
      onUpdate={(updated) => {
        setPet(updated)
        saveRegenmon(updated)
      }}
      userId={user.id}
      userName={user.name}
    />
  )
}



