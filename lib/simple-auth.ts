'use client'

export interface AuthUser {
  id: string
  email: string
  name: string
}

const AUTH_STORAGE_KEY = 'regenmon_auth_user'

export function useAuth() {
  if (typeof window === 'undefined') {
    return {
      user: null,
      isLoading: false,
      login: async (email: string, password: string) => false,
      logout: () => {},
      isAuthenticated: false,
    }
  }

  const getUser = (): AuthUser | null => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  const loginUser = (email: string) => {
    const user: AuthUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      email,
      name: email.split('@')[0],
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    return user
  }

  const logoutUser = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  return {
    user: getUser(),
    login: loginUser,
    logout: logoutUser,
  }
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

export function logoutCurrentUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}
