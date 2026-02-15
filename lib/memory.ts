const MEMORY_KEY = "regenmonMemories"
const MAX_MEMORIES = 5

export function loadMemories(): string[] {
  if (typeof window === "undefined") return []
  const raw = localStorage.getItem(MEMORY_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}

export function saveMemory(memory: string): string[] {
  const current = loadMemories()
  // Normalize for dedup
  const normalized = memory.toLowerCase().trim()
  const isDuplicate = current.some(
    (m) => m.toLowerCase().trim() === normalized
  )
  if (isDuplicate) return current

  const updated = [...current, memory]
  // If over max, remove oldest
  if (updated.length > MAX_MEMORIES) {
    updated.shift()
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(updated))
  }
  return updated
}

export function clearMemories(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(MEMORY_KEY)
  }
}

/**
 * Detect if the user message contains a preference/like statement.
 * Returns the extracted memory or null.
 */
export function detectMemory(text: string): string | null {
  const patterns = [
    /me gusta(?:n?)?\s+(.+)/i,
    /me encanta(?:n?)?\s+(.+)/i,
    /me fascina(?:n?)?\s+(.+)/i,
    /amo\s+(.+)/i,
    /adoro\s+(.+)/i,
    /mi (?:comida |deporte |color |animal |juego )?favorit[oa] es\s+(.+)/i,
    /prefiero\s+(.+)/i,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      const raw = (match[2] || match[1]).trim()
      // Clean up trailing punctuation
      const cleaned = raw.replace(/[.!?]+$/, "").trim()
      if (cleaned.length > 2 && cleaned.length < 80) {
        return `Le gusta ${cleaned}`
      }
    }
  }

  return null
}
