'use client'

import { useState, useEffect } from 'react'
import { getBalance } from '@/lib/managers/currency-manager'
import { getUserData, addHistoryEntry, saveUserData } from '@/lib/managers/user-data-manager'
import { CoinsAnimation } from '@/components/coins-animation'

interface GetCoinsButtonProps {
  userId?: string
  onCoinsChange?: (newBalance: number) => void
}

export function GetCoinsButton({ userId, onCoinsChange }: GetCoinsButtonProps) {
  const [hasCollected, setHasCollected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<string>('')
  const [showCoinAnimation, setShowCoinAnimation] = useState(false)
  const COINS_TO_GIVE = 50

  // Check if already collected this session
  useEffect(() => {
    if (userId) {
      const collected = sessionStorage.getItem(`coins_collected_${userId}`)
      if (collected === 'true') {
        setHasCollected(true)
      }
    }
  }, [userId])

  const handleGetCoins = async () => {
    if (!userId || hasCollected || isLoading) return

    setIsLoading(true)
    setFeedback('⏳ Recolectando...')

    try {
      // Get user data
      const userData = getUserData(userId)
      
      // Add coins
      userData.monedas += COINS_TO_GIVE
      saveUserData(userData)
      
      // Add history entry
      addHistoryEntry(userId, 'Conseguir monedas', COINS_TO_GIVE)

      // Mark as collected this session
      setHasCollected(true)
      sessionStorage.setItem(`coins_collected_${userId}`, 'true')
      setFeedback(`✅ +${COINS_TO_GIVE} 🍊`)
      
      // Show coin animation
      setShowCoinAnimation(true)
      
      // Update parent component
      const newBalance = getBalance(userId)
      onCoinsChange?.(newBalance)

      // Hide feedback after 2 seconds
      setTimeout(() => {
        setFeedback('')
        setIsLoading(false)
      }, 2000)
    } catch (error) {
      console.error('[v0] Error collecting coins:', error)
      setFeedback('❌ Error')
      setTimeout(() => {
        setFeedback('')
        setIsLoading(false)
      }, 2000)
    }
  }

  // Only show if not collected and user is logged in
  if (!userId || hasCollected) {
    return null
  }

  return (
    <button
      onClick={handleGetCoins}
      disabled={isLoading}
      className={`w-full px-4 py-2 rounded-lg border transition-all text-[9px] font-bold ${
        isLoading
          ? 'border-green-500/20 bg-green-500/5 text-green-400/50 cursor-not-allowed'
          : 'border-green-500/50 bg-green-500/20 text-green-400 hover:bg-green-500/30 active:scale-95'
      }`}
    >
      {showCoinAnimation && (
        <CoinsAnimation
          amount={COINS_TO_GIVE}
          type="gain"
          onComplete={() => setShowCoinAnimation(false)}
        />
      )}
      {feedback ? (
        feedback
      ) : (
        <>💰 Conseguir {COINS_TO_GIVE} 🍊</>
      )}
    </button>
  )
}
