'use client'

import { useEffect, useState } from 'react'

interface CoinAnimationProps {
  amount: number
  type: 'earn' | 'spend'
  onComplete?: () => void
}

export function CoinAnimation({ amount, type, onComplete }: CoinAnimationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 1200)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  const isPositive = type === 'earn'
  const color = isPositive ? '#4ade80' : '#f87171'
  const sign = isPositive ? '+' : '−'

  return (
    <div
      className="fixed pointer-events-none z-40 animate-coin-float"
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: color,
          textShadow: `0 0 8px ${color}50`,
          whiteSpace: 'nowrap',
        }}
      >
        {sign}{amount} 🍊
      </div>
    </div>
  )
}
