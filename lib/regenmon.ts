export type RegenmonType = "semilla" | "gota" | "chispa"

export interface RegenmonData {
  name: string
  type: RegenmonType
  happiness: number
  energy: number
  hunger: number
  createdAt: string
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
