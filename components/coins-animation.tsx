'use client'

import { useState, useEffect } from 'react'

interface CoinsAnimationProps {
  amount: number
  type: 'gain' | 'spend'
  onComplete?: () => void
}

export function CoinsAnimation({ amount, type, onComplete }: CoinsAnimationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 1500)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  const isGain = type === 'gain'
  const color = isGain ? 'text-green-400' : 'text-red-400'
  const sign = isGain ? '+' : '-'

  return (
    <div className={`
      fixed top-1/3 left-1/2 -translate-x-1/2 pointer-events-none
      animate-float-up opacity-0 animate-fade-out
      text-xl font-bold ${color}
    `}>
      {sign}{amount} 🍊
    </div>
  )
}
