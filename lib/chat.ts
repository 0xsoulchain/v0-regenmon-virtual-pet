export interface ChatMessage {
  role: "user" | "regenmon"
  content: string
}

const CHAT_KEY = "regenmonChatHistory"
const MAX_MESSAGES = 20

export function loadChat(): ChatMessage[] {
  if (typeof window === "undefined") return []
  const raw = localStorage.getItem(CHAT_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as ChatMessage[]
  } catch {
    return []
  }
}

export function saveChat(messages: ChatMessage[]): void {
  if (typeof window === "undefined") return
  // Keep only last MAX_MESSAGES
  const trimmed = messages.slice(-MAX_MESSAGES)
  localStorage.setItem(CHAT_KEY, JSON.stringify(trimmed))
}

export function clearChat(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CHAT_KEY)
  }
}
