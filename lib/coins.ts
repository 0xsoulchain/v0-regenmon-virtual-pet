'use client'

// Constants for coin system
export const COIN_CONSTANTS = {
  INITIAL_COINS: 100,
  FEED_COST: 10,
  CHAT_EARN_BASE: 2,
  CHAT_EARN_MAX: 5,
  MAX_COINS_THRESHOLD: 100, // After this, earning becomes less frequent
} as const

/**
 * Get coins for a specific user from localStorage
 */
export function getUserCoins(userId: string): number {
  if (typeof window === 'undefined') return COIN_CONSTANTS.INITIAL_COINS
  
  const key = `regenmon-coins-${userId}`
  const stored = localStorage.getItem(key)
  
  if (stored === null) {
    return COIN_CONSTANTS.INITIAL_COINS
  }
  
  const coins = parseInt(stored, 10)
  return Number.isNaN(coins) ? COIN_CONSTANTS.INITIAL_COINS : coins
}

/**
 * Save coins for a specific user
 */
export function setUserCoins(userId: string, amount: number): void {
  if (typeof window === 'undefined') return
  
  const coins = Math.max(0, Math.floor(amount))
  const key = `regenmon-coins-${userId}`
  localStorage.setItem(key, coins.toString())
}

/**
 * Add coins to user balance
 */
export function addCoins(userId: string, amount: number): number {
  const current = getUserCoins(userId)
  const newTotal = current + amount
  setUserCoins(userId, newTotal)
  return newTotal
}

/**
 * Deduct coins from user balance (returns false if insufficient funds)
 */
export function deductCoins(userId: string, amount: number): boolean {
  const current = getUserCoins(userId)
  
  if (current < amount) {
    return false
  }
  
  const newTotal = current - amount
  setUserCoins(userId, newTotal)
  return true
}

/**
 * Calculate random coin earnings based on current balance
 * Higher balance = less frequent/smaller earnings
 */
export function calculateChatEarnings(currentCoins: number): number {
  if (currentCoins > COIN_CONSTANTS.MAX_COINS_THRESHOLD) {
    // 30% chance to earn if above threshold
    if (Math.random() > 0.3) return 0
    return Math.floor(Math.random() * 2) + 1 // 1-2 coins
  }
  
  // Below threshold: guaranteed earnings
  return Math.floor(Math.random() * (COIN_CONSTANTS.CHAT_EARN_MAX - COIN_CONSTANTS.CHAT_EARN_BASE + 1)) + COIN_CONSTANTS.CHAT_EARN_BASE
}

/**
 * Clear all coins for a user (on logout)
 */
export function clearUserCoins(userId: string): void {
  if (typeof window === 'undefined') return
  const key = `regenmon-coins-${userId}`
  localStorage.removeItem(key)
}
