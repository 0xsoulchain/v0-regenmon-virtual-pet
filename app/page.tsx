"use client"

import { useEffect, useState } from "react"
import { type RegenmonData, loadRegenmon } from "@/lib/regenmon"
import { type AuthUser, loadAuth, createAuth } from "@/lib/auth"
import { CreateScreen } from "@/components/create-screen"
import { PetScreen } from "@/components/pet-screen"
import { CoinHeader } from "@/components/coin-header"

export default function Home() {
  const [pet, setPet] = useState<RegenmonData | null | undefined>(undefined)
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined)
  const [username, setUsername] = useState("")

  useEffect(() => {
    // Load existing auth or show login
    const existingAuth = loadAuth()
    if (existingAuth) {
      setUser(existingAuth)
      setPet(loadRegenmon())
    } else {
      setUser(null)
      setPet(null)
    }
  }, [])

  const handleLogin = (name: string) => {
    const newUser = createAuth(name)
    setUser(newUser)
    setUsername("")
    setPet(loadRegenmon())
  }

  // Loading state
  if (user === undefined || pet === undefined) {
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
      <CoinHeader user={user} />
      
      <main className="flex-1">
        {user === null ? (
          // Not logged in - show login screen
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/50">
            <div className="text-center">
              <div className="text-6xl mb-6">🍊</div>
              <h1 className="text-2xl font-bold mb-4 text-foreground">REGENMON</h1>
              <p className="text-sm text-muted-foreground mb-8">Crea y cuida tu mascota virtual</p>
              
              <div className="mb-6">
                <input
                  type="text"
                  className="nes-input w-64 text-xs text-center"
                  placeholder="Tu nombre"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && username.trim()) {
                      handleLogin(username)
                    }
                  }}
                />
              </div>
              
              <button
                type="button"
                className="nes-btn is-primary"
                onClick={() => username.trim() && handleLogin(username)}
                disabled={!username.trim()}
              >
                Entrar
              </button>
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
