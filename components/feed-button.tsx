'use client'

import { useState } from 'react'
import { CURRENCY_CONFIG, deductCoins, canAfford } from '@/lib/managers/currency-manager'

interface FeedButtonProps {
  hunger: number
  onFeed: () => void
  disabled?: boolean
  userId?: string
  coins?: number
  onCoinsChange?: (newBalance: number) => void
}

export function FeedButton({ 
  hunger, 
  onFeed, 
  disabled = false,
  userId,
  coins = 0,
  onCoinsChange
}: FeedButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [feedback, setFeedback] = useState<string>('')

  const canFeedPet = hunger > 0 && !disabled && !isProcessing
  const hasEnoughCoins = userId ? canAfford(userId, CURRENCY_CONFIG.FEED_COST) : false
  const isEnabled = canFeedPet && hasEnoughCoins

  const handleFeed = async () => {
    if (!isEnabled || !userId) return

    setIsProcessing(true)
    setFeedback('⏳ Procesando...')

    try {
      // Deducir monedas
      const result = deductCoins(userId, CURRENCY_CONFIG.FEED_COST)
      
      if (!result.success) {
        setFeedback('❌ Monedas insuficientes')
        setTimeout(() => setFeedback(''), 2000)
        setIsProcessing(false)
        return
      }

      // Ejecutar acción de alimentar
      onFeed()
      onCoinsChange?.(result.newBalance)

      // Feedback visual
      setFeedback('✅ ¡Alimentado!')
      setTimeout(() => {
        setFeedback('')
        setIsProcessing(false)
      }, 1500)
    } catch (error) {
      console.error('[v0] Error feeding pet:', error)
      setFeedback('❌ Error')
      setTimeout(() => {
        setFeedback('')
        setIsProcessing(false)
      }, 2000)
    }
  }

  if (!userId) {
    // Modo invitado: botón deshabilitado
    return (
      <button
        disabled={true}
        title="Inicia sesión para alimentar a tu mascota"
        className="w-full px-4 py-2 rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-400 text-[9px] font-bold opacity-50 cursor-not-allowed"
      >
        🍎 Alimentar ({CURRENCY_CONFIG.FEED_COST} 🍊)
      </button>
    )
  }

  const tooltipText = !hasEnoughCoins 
    ? `Necesitas ${CURRENCY_CONFIG.FEED_COST} 🍊 (tienes ${coins})`
    : hunger === 0
    ? 'Tu mascota no tiene hambre'
    : `Alimentar por ${CURRENCY_CONFIG.FEED_COST} 🍊`

  return (
    <div className="relative group">
      <button
        onClick={handleFeed}
        disabled={!isEnabled}
        className={`w-full px-4 py-2 rounded-lg border transition-all text-[9px] font-bold ${
          isEnabled
            ? 'border-orange-500/50 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 active:scale-95'
            : 'border-orange-500/20 bg-orange-500/5 text-orange-400/50 cursor-not-allowed'
        }`}
      >
        {feedback ? (
          feedback
        ) : isProcessing ? (
          '⏳ Procesando...'
        ) : (
          <>🍎 Alimentar ({CURRENCY_CONFIG.FEED_COST} 🍊)</>
        )}
      </button>
      {!isEnabled && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[8px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {tooltipText}
        </div>
      )}
    </div>
  )
}

