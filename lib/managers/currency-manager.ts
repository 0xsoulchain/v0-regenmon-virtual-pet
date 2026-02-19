import { getUserData, saveUserData, addHistoryEntry } from './user-data-manager'

export const CURRENCY_CONFIG = {
  INITIAL_AMOUNT: 100,
  MIN_CHAT_COINS: 2,
  MAX_CHAT_COINS: 5,
  FEED_COST: 10,
  DAILY_LIMIT: 200,
}

/**
 * Obtiene el saldo de monedas del usuario
 */
export function getBalance(userId: string): number {
  const userData = getUserData(userId)
  return userData.monedas
}

/**
 * Añade monedas al usuario con límites progresivos
 * Retorna el monto que se pudo añadir
 */
export function addCoins(userId: string, amount: number): { success: boolean; added: number; newBalance: number } {
  const userData = getUserData(userId)
  
  // Calcular probabilidad basada en saldo
  let probability = 1.0
  if (userData.monedas >= 100) {
    probability = 0.3 // 30% de probabilidad
  } else if (userData.monedas >= 50) {
    probability = 0.6 // 60% de probabilidad
  }
  
  // Aplicar probabilidad
  if (Math.random() > probability) {
    return { success: false, added: 0, newBalance: userData.monedas }
  }
  
  // Aplicar límite diario
  const today = new Date().toDateString()
  const dailyKey = `daily_coins_${userId}_${today}`
  const dailySpent = parseInt(localStorage.getItem(dailyKey) || '0', 10)
  
  if (dailySpent >= CURRENCY_CONFIG.DAILY_LIMIT) {
    return { success: false, added: 0, newBalance: userData.monedas }
  }
  
  // Calcular monedas a añadir (máximo hasta el límite diario)
  const coinsToAdd = Math.min(amount, CURRENCY_CONFIG.DAILY_LIMIT - dailySpent)
  
  userData.monedas += coinsToAdd
  saveUserData(userData)
  
  // Registrar gasto diario
  localStorage.setItem(dailyKey, String(dailySpent + coinsToAdd))
  
  // Registrar en historial
  addHistoryEntry(userId, `Ganaste ${coinsToAdd} monedas`, coinsToAdd)
  
  return { success: true, added: coinsToAdd, newBalance: userData.monedas }
}

/**
 * Resta monedas del usuario
 */
export function deductCoins(userId: string, amount: number): { success: boolean; newBalance: number } {
  const userData = getUserData(userId)
  
  if (userData.monedas < amount) {
    return { success: false, newBalance: userData.monedas }
  }
  
  userData.monedas -= amount
  saveUserData(userData)
  
  // Registrar en historial
  addHistoryEntry(userId, `Gastaste ${amount} monedas`, -amount)
  
  return { success: true, newBalance: userData.monedas }
}

/**
 * Verifica si el usuario puede realizar una acción que cuesta monedas
 */
export function canAfford(userId: string, cost: number): boolean {
  return getBalance(userId) >= cost
}

/**
 * Obtiene monedas aleatorias en el rango configurado
 */
export function getRandomCoinReward(): number {
  return Math.floor(
    Math.random() * (CURRENCY_CONFIG.MAX_CHAT_COINS - CURRENCY_CONFIG.MIN_CHAT_COINS + 1) +
      CURRENCY_CONFIG.MIN_CHAT_COINS
  )
}

/**
 * Reinicia el límite diario (para testing)
 */
export function resetDailyLimit(userId: string): void {
  const today = new Date().toDateString()
  const dailyKey = `daily_coins_${userId}_${today}`
  localStorage.removeItem(dailyKey)
}
