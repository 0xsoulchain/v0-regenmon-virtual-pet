'use client'

import { usePrivy } from '@privy-io/react-auth'
import { getUserCoins } from '@/lib/coins'
import { useEffect, useState } from 'react'

export function CoinHeader() {
  const { user, logout, isReady } = usePrivy()
  const [coins, setCoins] = useState(0)

  useEffect(() => {
    if (user?.id) {
      const currentCoins = getUserCoins(user.id)
      setCoins(currentCoins)
    }
  }, [user?.id])

  if (!isReady) {
    return null
  }

  const email = user?.email?.address || user?.phone?.number || 'Usuario'
  const displayName = email.split('@')[0] || 'Usuario'

  return (
    <header className="w-full border-b border-border/50 bg-background/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo/Title */}
        <div className="text-xs font-bold text-foreground">
          REGENMON
        </div>

        {/* Center: User Info */}
        {user && (
          <div className="text-xs text-muted-foreground">
            {displayName}
          </div>
        )}

        {/* Right: Coins + Logout */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-500/20 border border-orange-500/30">
              <span className="text-sm">🍊</span>
              <span className="text-xs font-bold text-orange-400">
                {coins}
              </span>
              <span className="text-[8px] text-muted-foreground">FRUTA</span>
            </div>
          )}

          {user ? (
            <button
              onClick={() => logout()}
              className="text-xs px-3 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
            >
              Salir
            </button>
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
