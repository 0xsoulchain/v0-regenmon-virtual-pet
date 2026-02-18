'use client'

import { useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { deductCoins, getUserCoins, COIN_CONSTANTS } from '@/lib/coins'
import { CoinAnimation } from '@/components/coin-animation'

interface FeedButtonProps {
  hunger: number
  onFeed: () => void
  disabled?: boolean
}

export function FeedButton({ hunger, onFeed, disabled = false }: FeedButtonProps) {
  const { user } = usePrivy()
  const [isLoading, setIsLoading] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [animationType, setAnimationType] = useState<'earn' | 'spend'>('spend')

  const canAfford = user ? getUserCoins(user.id) >= COIN_CONSTANTS.FEED_COST : false
  const canFeed = hunger > 0 && canAfford && !isLoading && !disabled

  const handleFeed = async () => {
    if (!canFeed || !user) return

    setIsLoading(true)
    
    // Deduct coins
    const success = deductCoins(user.id, COIN_CONSTANTS.FEED_COST)
    
    if (success) {
      setAnimationType('spend')
      setShowAnimation(true)
      
      // Execute the feed action
      onFeed()
      
      // Hide animation after 1.2s
      setTimeout(() => setShowAnimation(false), 1200)
    }
    
    setIsLoading(false)
  }

  if (!user) {
    return null
  }

  const currentCoins = getUserCoins(user.id)

  return (
    <>
      <button
        onClick={handleFeed}
        disabled={!canFeed}
        className="w-full px-4 py-2 rounded-lg border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[9px] font-bold text-orange-400"
      >
        {isLoading ? (
          <>⏳ Procesando...</>
        ) : !canAfford ? (
          <>🍎 Alimentar (Insuficientes monedas)</>
        ) : (
          <>🍎 Alimentar ({COIN_CONSTANTS.FEED_COST} 🍊)</>
        )}
      </button>

      {showAnimation && (
        <CoinAnimation
          amount={COIN_CONSTANTS.FEED_COST}
          type={animationType}
          onComplete={() => setShowAnimation(false)}
        />
      )}
    </>
  )
}
