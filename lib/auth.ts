// Simple authentication system using localStorage
const AUTH_KEY = "regenmon_auth"

export interface AuthUser {
  id: string
  username: string
}

export function loadAuth(): AuthUser | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function saveAuth(user: AuthUser): void {
  if (typeof window === "undefined") return
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
}

export function createAuth(username: string): AuthUser {
  // Create a unique user ID based on username and random number
  const id = `user_${username.toLowerCase()}_${Math.random().toString(36).substr(2, 9)}`
  const user: AuthUser = { id, username }
  saveAuth(user)
  return user
}

export function logout(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_KEY)
  // Also clear all user-specific data
  localStorage.removeItem("regenmon_pet")
  localStorage.removeItem("regenmonChatHistory")
  localStorage.removeItem("regenmonMemories")
  localStorage.removeItem(`coins_${loadAuth()?.id}`)
}
