export type RegenmonType = "semilla" | "gota" | "chispa"

export interface RegenmonData {
  name: string
  type: RegenmonType
  happiness: number
  energy: number
  hunger: number
  createdAt: string
  level: number
  xpActual: number
  xpTotal: number
}

export const REGENMON_TYPES: Record<
  RegenmonType,
  { emoji: string; label: string; color: string; bgClass: string; borderColor: string }
> = {
  semilla: {
    emoji: "🌱",
    label: "Semilla",
    color: "#4ade80",
    bgClass: "bg-green-900/40",
    borderColor: "border-green-500/50",
  },
  gota: {
    emoji: "💧",
    label: "Gota",
    color: "#60a5fa",
    bgClass: "bg-blue-900/40",
    borderColor: "border-blue-500/50",
  },
  chispa: {
    emoji: "✨",
    label: "Chispa",
    color: "#facc15",
    bgClass: "bg-yellow-900/40",
    borderColor: "border-yellow-500/50",
  },
}

const STORAGE_KEY = "regenmon-data"

export function saveRegenmon(data: RegenmonData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}

export function loadRegenmon(): RegenmonData | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as RegenmonData
  } catch {
    return null
  }
}

export function deleteRegenmon(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem("regenmonChatHistory")
    localStorage.removeItem("regenmonMemories")
  }
}

/**
 * Calcula el XP total requerido para alcanzar un nivel específico
 * Fórmula: 100 * (2 ^ (nivel - 2))
 */
export function getXpRequiredForLevel(level: number): number {
  if (level <= 1) return 0
  return Math.floor(100 * Math.pow(2, level - 2))
}

/**
 * Determina el nivel actual basado en XP total acumulado
 */
export function getLevelFromXp(xpTotal: number): number {
  let level = 1
  while (getXpRequiredForLevel(level + 1) <= xpTotal) {
    level++
  }
  return level
}

/**
 * Verifica si se puede subir de nivel con el XP actual
 */
export function canLevelUp(xpTotal: number, currentLevel: number): boolean {
  const nextLevelXp = getXpRequiredForLevel(currentLevel + 1)
  return xpTotal >= nextLevelXp
}

/**
 * Calcula el XP actual dentro del nivel (0 a xpParaSiguienteNivel)
 */
export function getXpProgressInLevel(xpTotal: number, level: number): {
  current: number
  required: number
} {
  const currentLevelXp = getXpRequiredForLevel(level)
  const nextLevelXp = getXpRequiredForLevel(level + 1)
  const xpInLevel = xpTotal - currentLevelXp
  const xpNeeded = nextLevelXp - currentLevelXp
  return {
    current: xpInLevel,
    required: xpNeeded,
  }
}
