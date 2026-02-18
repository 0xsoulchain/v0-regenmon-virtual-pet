// Privy-based authentication and user data management
import type { User as PrivyUser } from "@privy-io/react-auth"

const USER_DATA_KEY = "regenmon_user_data"

export interface RegenmonUser {
  userId: string
  email: string
  monedas: number
  lastDailyReset: string // ISO date string for daily coin limit
  dailyCoinsEarned: number
  regenmon: {
    nombre: string
    tipo: string
    felicidad: number
    energia: number
    hambre: number
    nivel: number
    xpActual: number
    xpTotal: number
  } | null
  historial: Array<{
    accion: string
    monedas: number
    timestamp: string
  }>
}

/**
 * Create or get user data structure
 */
export function initializeUserData(privyUser: PrivyUser): RegenmonUser {
  const email = privyUser.email?.address || privyUser.phone?.number || privyUser.id
  const userId = privyUser.id

  // Check if user exists
  const existing = loadUserData(userId)
  if (existing) {
    return existing
  }

  // Create new user
  const newUser: RegenmonUser = {
    userId,
    email,
    monedas: 100, // Initial coins
    lastDailyReset: new Date().toISOString(),
    dailyCoinsEarned: 0,
    regenmon: null,
    historial: [],
  }

  saveUserData(userId, newUser)
  return newUser
}

/**
 * Load user data from localStorage
 */
export function loadUserData(userId: string): RegenmonUser | null {
  if (typeof window === "undefined") return null
  try {
    const key = `${USER_DATA_KEY}_${userId}`
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as RegenmonUser
  } catch {
    return null
  }
}

/**
 * Save user data to localStorage
 */
export function saveUserData(userId: string, data: RegenmonUser): void {
  if (typeof window === "undefined") return
  const key = `${USER_DATA_KEY}_${userId}`
  localStorage.setItem(key, JSON.stringify(data))
}

/**
 * Add coins with daily limit validation
 */
export function addCoinsWithDailyLimit(
  userId: string,
  amount: number
): { success: boolean; newBalance: number; dailyRemaining: number } {
  const user = loadUserData(userId)
  if (!user) return { success: false, newBalance: 0, dailyRemaining: 0 }

  const today = new Date().toDateString()
  const lastReset = new Date(user.lastDailyReset).toDateString()

  // Reset daily counter if new day
  if (today !== lastReset) {
    user.dailyCoinsEarned = 0
    user.lastDailyReset = new Date().toISOString()
  }

  const DAILY_LIMIT = 200
  const dailyRemaining = DAILY_LIMIT - user.dailyCoinsEarned

  if (dailyRemaining <= 0) {
    return { success: false, newBalance: user.monedas, dailyRemaining: 0 }
  }

  const toAdd = Math.min(amount, dailyRemaining)
  user.monedas += toAdd
  user.dailyCoinsEarned += toAdd

  // Add to history
  user.historial.push({
    accion: "Ganancia por chat",
    monedas: toAdd,
    timestamp: new Date().toISOString(),
  })

  // Keep only last 10 items
  if (user.historial.length > 10) {
    user.historial = user.historial.slice(-10)
  }

  saveUserData(userId, user)
  return { success: true, newBalance: user.monedas, dailyRemaining: dailyRemaining - toAdd }
}

/**
 * Deduct coins
 */
export function deductCoins(userId: string, amount: number): boolean {
  const user = loadUserData(userId)
  if (!user || user.monedas < amount) return false

  user.monedas -= amount

  // Add to history
  user.historial.push({
    accion: "Gasto",
    monedas: -amount,
    timestamp: new Date().toISOString(),
  })

  // Keep only last 10 items
  if (user.historial.length > 10) {
    user.historial = user.historial.slice(-10)
  }

  saveUserData(userId, user)
  return true
}

/**
 * Get current coin balance
 */
export function getCoins(userId: string): number {
  const user = loadUserData(userId)
  return user?.monedas ?? 0
}
