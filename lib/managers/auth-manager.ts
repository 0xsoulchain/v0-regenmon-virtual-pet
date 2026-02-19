export interface AuthState {
  isReady: boolean
  isLoggedIn: boolean
}

/**
 * Valida si un email es válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
  if (user.phone?.number) return user.phone.number
  return 'Usuario'
}

/**
 * Valida que la sesión sea válida
 */
export function validateSession(user: PrivyUser | null, isReady: boolean): boolean {
  return isReady && user !== null
}
