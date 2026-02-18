'use client'

import { useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { deductCoins, getCoins } from '@/lib/user-manager'
import { CoinAnimation } from '@/components/coin-animation'

const FEED_COST = 10

interface FeedButtonProps {
  hunger: number
  onFeed: () => void
  disabled?: boolean
}

export function FeedButton({ hunger, onFeed, disabled = false }: FeedButtonProps) {
  const { user: privyUser } = usePrivy()
  const [coins, setCoins] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [animationType, setAnimationType] = useState<'earn' | 'spend'>('spend')

  // Update coin display when user changes
  useEffect(() => {
    if (privyUser?.id) {
      const currentCoins = getCoins(privyUser.id)
      setCoins(currentCoins)
    }
  }, [privyUser?.id])

  const canAfford = coins >= FEED_COST
  const canFeed = hunger > 0 && canAfford && !isLoading && !disabled

  const handleFeed = async () => {
    if (!canFeed || !privyUser?.id) return

    setIsLoading(true)
    
    // Deduct coins
    const success = deductCoins(privyUser.id, FEED_COST)
    
    if (success) {
      setCoins(getCoins(privyUser.id))
      setAnimationType('spend')
      setShowAnimation(true)
      
      // Execute the feed action
      onFeed()
      
      // Hide animation after 1.2s
      setTimeout(() => setShowAnimation(false), 1200)
    }
    
    setIsLoading(false)
  }

  if (!privyUser) {
    return null
  }

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
          <>🍎 Alimentar (Necesitas {FEED_COST} 🍊)</>
        ) : (
          <>🍎 Alimentar ({FEED_COST} 🍊)</>
        )}
      </button>

      {showAnimation && (
        <CoinAnimation
          amount={FEED_COST}
          type={animationType}
          onComplete={() => setShowAnimation(false)}
        />
      )}
    </>
  )
}
