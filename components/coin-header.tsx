'use client'

import { useEffect, useState } from 'react'

interface CoinHeaderProps {
  userId: string | null
  userName: string
  logout: () => void
}

export function CoinHeader({ userId, userName, logout }: CoinHeaderProps) {
  const [coins, setCoins] = useState(0)

  useEffect(() => {
    if (userId) {
      // Obtener monedas del localStorage si existen
      try {
        const storedCoins = localStorage.getItem(`coins_${userId}`)
        if (storedCoins) setCoins(parseInt(storedCoins))
      } catch {
        setCoins(0)
      }
    }
  }, [userId])

  return (
    <header className="w-full border-b border-border/50 bg-background/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo/Title */}
        <div className="text-xs font-bold text-foreground" style={{ fontFamily: "var(--font-pixel)" }}>
          REGENMON
        </div>

        {/* Center: User Info */}
        {userId && (
          <div className="text-xs text-muted-foreground">
            {userName}
          </div>
        )}

        {/* Right: Coins + Logout */}
        <div className="flex items-center gap-4">
          {userId ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-500/20 border border-orange-500/30">
                <span className="text-sm">🍊</span>
                <span className="text-xs font-bold text-orange-400">
                  {coins}
                </span>
                <span className="text-[8px] text-muted-foreground">FRUTA</span>
              </div>

              <button
                onClick={logout}
                className="text-xs px-3 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Salir
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-muted/30">
              <span className="text-[8px] text-muted-foreground">🍊 — FRUTA</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
