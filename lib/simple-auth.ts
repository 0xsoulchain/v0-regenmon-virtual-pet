'use client'

export interface AuthUser {
  id: string
  email: string
  name: string
  verified: boolean
}

interface PendingAuth {
  email: string
  code: string
  timestamp: number
}

const AUTH_STORAGE_KEY = 'regenmon_auth_user'
const PENDING_AUTH_KEY = 'regenmon_pending_auth'

// Generar código OTP de 6 dígitos
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function requestOTP(email: string): { code: string; expiresIn: number } {
  const code = generateOTP()
  const pendingAuth: PendingAuth = {
    email,
    code,
    timestamp: Date.now(),
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(PENDING_AUTH_KEY, JSON.stringify(pendingAuth))
    // En producción, aquí enviarías el código por email usando una API
    console.log(`[v0] Código OTP para ${email}: ${code}`)
  }

  return { code, expiresIn: 600000 } // 10 minutos
}

export function verifyOTP(email: string, code: string): AuthUser | null {
  if (typeof window === 'undefined') return null

  try {
    const pending = localStorage.getItem(PENDING_AUTH_KEY)
    if (!pending) return null

    const pendingAuth: PendingAuth = JSON.parse(pending)
    const isExpired = Date.now() - pendingAuth.timestamp > 600000 // 10 minutos

    if (pendingAuth.email !== email || pendingAuth.code !== code || isExpired) {
      return null
    }

    const user: AuthUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      email,
      name: email.split('@')[0],
      verified: true,
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    localStorage.removeItem(PENDING_AUTH_KEY)
    return user
  } catch {
    return null
  }
}

export function logoutCurrentUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem(PENDING_AUTH_KEY)
  }
}

export function useAuth() {
  if (typeof window === 'undefined') {
    return {
      user: null,
      isLoading: false,
      login: (email: string) => ({ code: '', expiresIn: 0 }),
      verify: (email: string, code: string) => null,
      logout: () => {},
      isAuthenticated: false,
    }
  }

  return {
    user: getCurrentUser(),
    requestOTP,
    verifyOTP,
    logout: logoutCurrentUser,
  }
}

