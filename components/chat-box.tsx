"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { type ChatMessage, loadChat, saveChat } from "@/lib/chat"
import { loadMemories, saveMemory, detectMemory } from "@/lib/memory"
import { addCoinsWithDailyLimit, getCoins } from "@/lib/user-manager"
import { CoinAnimation } from "@/components/coin-animation"

interface ChatBoxProps {
  stats: { happiness: number; energy: number; hunger: number }
  onStatChange: (delta: { happiness?: number; energy?: number }) => void
}

export function ChatBox({ stats, onStatChange }: ChatBoxProps) {
  const { user: privyUser } = usePrivy()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [memories, setMemories] = useState<string[]>([])
  const [statFloat, setStatFloat] = useState<{ text: string; color: string } | null>(null)
  const [coinFloat, setCoinFloat] = useState<{ amount: number; type: 'earn' | 'spend' } | null>(null)
  const [consecutiveCount, setConsecutiveCount] = useState(0)
  const lastMessageTime = useRef<number>(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load persisted data on mount
  useEffect(() => {
    setMessages(loadChat())
    setMemories(loadMemories())
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, sending])

  const showStatFloat = useCallback((text: string, color: string) => {
    setStatFloat({ text, color })
    setTimeout(() => setStatFloat(null), 1500)
  }, [])

  async function handleSend() {
    const trimmed = input.trim()
    if (!trimmed || sending) return

    setSending(true)
    setInput("")

    // -- Stat modifications --
    const now = Date.now()
    const timeSinceLast = now - lastMessageTime.current
    lastMessageTime.current = now

    let energyDelta = -3
    let newConsecutive = consecutiveCount

    if (timeSinceLast < 60_000 && timeSinceLast > 0) {
      newConsecutive += 1
    } else {
      newConsecutive = 1
    }
    setConsecutiveCount(newConsecutive)

    // Extra energy penalty for 5+ rapid messages
    if (newConsecutive > 5) {
      energyDelta -= 5
      showStatFloat("-5 Energia (spam)", "#f87171")
      // Small delay before showing next float
      setTimeout(() => {
        showStatFloat("+5 Felicidad / -3 Energia", "#4ade80")
      }, 800)
    } else {
      showStatFloat("+5 Felicidad / -3 Energia", "#4ade80")
    }

    onStatChange({ happiness: 5, energy: energyDelta })

    // -- Memory detection --
    const detectedMemory = detectMemory(trimmed)
    let currentMemories = memories
    if (detectedMemory) {
      currentMemories = saveMemory(detectedMemory)
      setMemories(currentMemories)
    }

    // -- Add user message --
    const userMsg: ChatMessage = { role: "user", content: trimmed }
    const updatedWithUser = [...messages, userMsg]
    setMessages(updatedWithUser)
    saveChat(updatedWithUser)

    // -- Typing indicator delay (500-900ms) --
    const delay = 500 + Math.random() * 400
    await new Promise((r) => setTimeout(r, delay))

    // -- Call API --
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          stats: {
            felicidad: stats.happiness,
            energia: stats.energy,
            hambre: stats.hunger,
          },
          memories: currentMemories,
        }),
      })

      const data = await res.json()
      const regenmonMsg: ChatMessage = {
        role: "regenmon",
        content: data.reply || "Ups... algo salio mal",
      }
      const updatedWithReply = [...updatedWithUser, regenmonMsg]
      setMessages(updatedWithReply)
      saveChat(updatedWithReply)
      
      // Award coins after successful response - only if user is authenticated
      if (privyUser?.id && data.reply) {
        // Award between 2-5 coins based on daily balance
        const coinsToAdd = Math.floor(Math.random() * 4) + 2 // 2-5 coins
        const result = addCoinsWithDailyLimit(privyUser.id, coinsToAdd)
        
        if (result.success && result.newBalance > 0) {
          setCoinFloat({ amount: coinsToAdd, type: 'earn' })
          setTimeout(() => setCoinFloat(null), 1200)
        }
      }
    } catch {
      const errorMsg: ChatMessage = {
        role: "regenmon",
        content: "Ups... algo salio mal",
      }
      const updatedWithError = [...updatedWithUser, errorMsg]
      setMessages(updatedWithError)
      saveChat(updatedWithError)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div id="chat-container" className="chat-container">
      {/* Header with memory counter */}
      <div className="chat-header">
        <span className="chat-header-title">Chat</span>
        <span className="chat-memory-count" title="Memorias guardadas">
          {"// "}{memories.length} memorias
        </span>
      </div>

      {/* Stat float notification */}
      {statFloat && (
        <div
          className="chat-stat-float"
          style={{ color: statFloat.color }}
        >
          {statFloat.text}
        </div>
      )}

      {/* Coin animation */}
      {coinFloat && (
        <CoinAnimation
          amount={coinFloat.amount}
          type={coinFloat.type}
          onComplete={() => setCoinFloat(null)}
        />
      )}

      {/* Messages area */}
      <div id="chat-messages" className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <p>{"Escribe algo para hablar con tu Regenmon..."}</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-bubble ${msg.role === "user" ? "chat-bubble-user" : "chat-bubble-regenmon"}`}
          >
            <span className="chat-bubble-text">{msg.content}</span>
          </div>
        ))}
        {sending && (
          <div className="chat-bubble chat-bubble-regenmon">
            <span className="chat-typing">Escribiendo...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="chat-input-area">
        <input
          ref={inputRef}
          id="chat-input"
          type="text"
          className="chat-input"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={sending}
          maxLength={200}
          autoComplete="off"
          aria-label="Mensaje para tu Regenmon"
        />
        <button
          id="chat-send"
          type="button"
          className="chat-send-btn"
          onClick={handleSend}
          disabled={sending || !input.trim()}
          aria-label="Enviar mensaje"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ imageRendering: "pixelated" }} aria-hidden="true">
            <rect x="1" y="7" width="10" height="2" fill="currentColor" />
            <rect x="9" y="5" width="2" height="2" fill="currentColor" />
            <rect x="11" y="3" width="2" height="2" fill="currentColor" />
            <rect x="13" y="7" width="2" height="2" fill="currentColor" />
            <rect x="11" y="11" width="2" height="2" fill="currentColor" />
            <rect x="9" y="9" width="2" height="2" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  )
}
