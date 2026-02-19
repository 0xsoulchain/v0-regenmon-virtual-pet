'use client'

export interface AuthUser {
  id: string
  email: string
  name: string
}

const AUTH_STORAGE_KEY = 'regenmon_auth_user'

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function loginUser(email: string): AuthUser {
  const user: AuthUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    email,
    name: email.split('@')[0],
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  }
  return user
}

export function logoutCurrentUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}

export function useAuth() {
  if (typeof window === 'undefined') {
    return {
      user: null,
      isLoading: false,
      login: async (email: string) => loginUser(email),
      logout: () => logoutCurrentUser(),
      isAuthenticated: false,
    }
  }

  return {
    user: getCurrentUser(),
    login: loginUser,
    logout: logoutCurrentUser,
  }
}

