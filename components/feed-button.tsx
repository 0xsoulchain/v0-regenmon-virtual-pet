'use client'

import { useState } from 'react'
import { CURRENCY_CONFIG, canAfford, deductCoins } from '@/lib/managers/currency-manager'

interface FeedButtonProps {
  hunger: number
  userId: string | null
  onFeed: () => void
  onCoinsChange?: (newBalance: number) => void
  disabled?: boolean
}

export function FeedButton({ 
  hunger, 
  userId, 
  onFeed, 
  onCoinsChange,
  disabled = false 
}: FeedButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showFeedback, setShowFeedback] = useState<string | null>(null)

  const canFeedPet = hunger > 0 && !isProcessing && !disabled
  const hasCoins = userId ? canAfford(userId, CURRENCY_CONFIG.FEED_COST) : false
  const isEnabled = canFeedPet && hasCoins

  const handleFeed = async () => {
    if (!userId || !isEnabled) return

    setIsProcessing(true)
    setShowFeedback('⏳ Procesando...')

    try {
      // Deducir monedas
      const result = deductCoins(userId, CURRENCY_CONFIG.FEED_COST)
      
      if (!result.success) {
        setShowFeedback('❌ Monedas insuficientes')
        setTimeout(() => setShowFeedback(null), 2000)
        setIsProcessing(false)
        return
      }

      // Ejecutar acción de alimentar
      onFeed()
      onCoinsChange?.(result.newBalance)

      // Feedback de éxito
      setShowFeedback('✅ ¡Alimentado!')
      setTimeout(() => setShowFeedback(null), 2000)
    } catch (error) {
      setShowFeedback('❌ Error')
      setTimeout(() => setShowFeedback(null), 2000)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!userId) {
    // Modo invitado: mostrar botón pero sin funcionalidad real
    return (
      <button
        disabled={true}
        className="w-full px-4 py-2 rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-400 text-[9px] font-bold opacity-50 cursor-not-allowed"
        title="Inicia sesión para alimentar a tu mascota"
      >
        🍎 Alimentar ({CURRENCY_CONFIG.FEED_COST} 🍊)
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={handleFeed}
        disabled={!isEnabled}
        className={`w-full px-4 py-2 rounded-lg border transition-all text-[9px] font-bold ${
          isEnabled
            ? 'border-orange-500/50 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 active:scale-95'
            : 'border-orange-500/20 bg-orange-500/5 text-orange-400/50 cursor-not-allowed'
        }`}
      >
        {showFeedback ? (
          showFeedback
        ) : isProcessing ? (
          '⏳ Procesando...'
        ) : !hasCoins ? (
          <>🍎 Alimentar (Insuficientes 🍊)</>
        ) : hunger === 0 ? (
          <>🍎 Mascota sin hambre</>
        ) : (
          <>🍎 Alimentar ({CURRENCY_CONFIG.FEED_COST} 🍊)</>
        )}
      </button>
    </div>
  )
}
