import type { User as PrivyUser } from '@privy-io/react-auth'

export interface AuthState {
  user: PrivyUser | null
  isReady: boolean
  isLoggedIn: boolean
}

/**
 * Determina si un usuario está autenticado
 */
export function isUserAuthenticated(user: PrivyUser | null): boolean {
  return user !== null && user !== undefined
}

/**
 * Obtiene el identificador único del usuario (email o userId)
 */
export function getUserId(user: PrivyUser | null): string | null {
  if (!user) return null
  return user.email?.address || user.phone?.number || user.id
}

/**
 * Obtiene el nombre de display del usuario
 */
export function getDisplayName(user: PrivyUser | null): string {
  if (!user) return 'Invitado'
  const email = user.email?.address
  if (email) return email.split('@')[0]
  if (user.phone?.number) return user.phone.number
  return 'Usuario'
}

/**
 * Valida que la sesión sea válida
 */
export function validateSession(user: PrivyUser | null, isReady: boolean): boolean {
  return isReady && user !== null
}
