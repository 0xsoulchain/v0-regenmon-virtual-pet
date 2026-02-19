import type { RegenmonData } from '@/lib/regenmon'

export interface HistoryEntry {
  accion: string
  cambioMonedas: number
  timestamp: number
}

export interface UserData {
  userId: string
  email: string
  monedas: number
  regenmon: RegenmonData | null
  historial: HistoryEntry[]
  ultimaActualizacion: number
}

const USER_DATA_KEY = 'regenmon_user_data'
const USER_SESSIONS_KEY = 'regenmon_user_sessions'

/**
 * Obtiene o crea datos de usuario
 */
export function getUserData(userId: string): UserData {
  const key = `${USER_DATA_KEY}_${userId}`
  const stored = localStorage.getItem(key)
  
  if (stored) {
    try {
      return JSON.parse(stored) as UserData
    } catch {
      // Si hay error al parsear, crear nuevos datos
    }
  }

  // Crear nuevos datos
  return {
    userId,
    email: userId,
    monedas: 100, // Comienza con 100 monedas
    regenmon: null,
    historial: [],
    ultimaActualizacion: Date.now(),
  }
}

/**
 * Guarda datos del usuario
 */
export function saveUserData(userData: UserData): void {
  const key = `${USER_DATA_KEY}_${userData.userId}`
  userData.ultimaActualizacion = Date.now()
  localStorage.setItem(key, JSON.stringify(userData))
}

/**
 * Actualiza el Regenmon del usuario
 */
export function updateUserRegenmon(userId: string, regenmon: RegenmonData | null): void {
  const userData = getUserData(userId)
  userData.regenmon = regenmon
  saveUserData(userData)
}

/**
 * Añade entrada al historial
 */
export function addHistoryEntry(
  userId: string,
  accion: string,
  cambioMonedas: number
): void {
  const userData = getUserData(userId)
  userData.historial.push({
    accion,
    cambioMonedas,
    timestamp: Date.now(),
  })
  
  // Mantener solo las últimas 10 entradas
  if (userData.historial.length > 10) {
    userData.historial = userData.historial.slice(-10)
  }
  
  saveUserData(userData)
}

/**
 * Obtiene el historial del usuario (últimas N entradas)
 */
export function getUserHistory(userId: string, limit: number = 10): HistoryEntry[] {
  const userData = getUserData(userId)
  return userData.historial.slice(-limit).reverse()
}

/**
 * Limpia datos de usuario (al cerrar sesión)
 */
export function clearUserData(userId: string): void {
  const key = `${USER_DATA_KEY}_${userId}`
  localStorage.removeItem(key)
}

/**
 * Registra una sesión activa de usuario
 */
export function registerSession(userId: string): void {
  const sessions = JSON.parse(localStorage.getItem(USER_SESSIONS_KEY) || '{}')
  sessions[userId] = Date.now()
  localStorage.setItem(USER_SESSIONS_KEY, JSON.stringify(sessions))
}

/**
 * Desregistra una sesión de usuario
 */
export function unregisterSession(userId: string): void {
  const sessions = JSON.parse(localStorage.getItem(USER_SESSIONS_KEY) || '{}')
  delete sessions[userId]
  localStorage.setItem(USER_SESSIONS_KEY, JSON.stringify(sessions))
}

/**
 * Verifica si hay datos de un usuario en localStorage
 */
export function hasUserData(userId: string): boolean {
  const key = `${USER_DATA_KEY}_${userId}`
  return localStorage.getItem(key) !== null
}
