'use client'

interface DynamicHeaderProps {
  userName: string
  coins: number
  onLogout: () => void
}

export function DynamicHeader({ userName, coins, onLogout }: DynamicHeaderProps) {
  return (
    <header className="w-full border-b border-border/50 bg-background/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="text-xs font-bold text-foreground" style={{ fontFamily: "var(--font-pixel)" }}>
          REGENMON
        </div>

        {/* Center: User Info */}
        <div className="text-xs text-muted-foreground">
          {userName}
        </div>

        {/* Right: Coins + Auth Buttons */}
        <div className="flex items-center gap-3">
          {/* Coins Display - Always Visible */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-500/20 border border-orange-500/30">
            <span className="text-sm">🍊</span>
            <span className="text-xs font-bold text-orange-400">
              {coins}
            </span>
          </div>

          {/* Auth Buttons */}
          {user ? (
            <button
              onClick={onLogout}
              className="text-xs px-3 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
            >
              Cerrar Sesión
            </button>
          ) : (
            <button
              onClick={() => login()}
              className="text-xs px-3 py-1 rounded border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-colors"
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
