"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  type RegenmonData,
  REGENMON_TYPES,
  saveRegenmon,
  deleteRegenmon,
  getLevelFromXp,
  getXpProgressInLevel,
  canLevelUp,
} from "@/lib/regenmon"
import { getBalance } from "@/lib/managers/currency-manager"
import { StatBar } from "@/components/stat-bar"
import { SharkSprite, TreeSprite, BatterySprite } from "@/components/pet-sprites"
import { RegenmonLogo } from "@/components/regenmon-logo"
import { BackgroundParticles } from "@/components/background-particles"
import { ActionEffect } from "@/components/action-effects"
import { ChatBox } from "@/components/chat-box"
import { XpBar } from "@/components/xp-bar"
import { LevelUpAnimation } from "@/components/level-up-animation"
import { FeedButton } from "@/components/feed-button"

interface PetScreenProps {
  data: RegenmonData
  onReset: () => void
  onUpdate: (data: RegenmonData) => void
  userId?: string
  userName?: string
}

function PetIllustration({ type, color }: { type: string; color: string }) {
  switch (type) {
    case "gota":
      return <SharkSprite color={color} size={140} />
    case "semilla":
      return <TreeSprite color={color} size={140} />
    case "chispa":
      return <BatterySprite color={color} size={140} />
    default:
      return null
  }
}

export function PetScreen({ data, onReset, onUpdate, userId, userName }: PetScreenProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [chatOpen, setChatOpen] = useState(true)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [coins, setCoins] = useState(userId ? getBalance(userId) : 0)
  const [stats, setStats] = useState({
    happiness: data.happiness,
    energy: data.energy,
    hunger: data.hunger,
  })
  const [activeAction, setActiveAction] = useState<"play" | "sleep" | "eat" | null>(null)
  const [petAnim, setPetAnim] = useState("")
  const [currentLevel, setCurrentLevel] = useState(getLevelFromXp(data.xpTotal))
  const typeInfo = REGENMON_TYPES[data.type]

  // Use refs for the latest data/callback so timers never re-register
  const dataRef = useRef(data)
  const onUpdateRef = useRef(onUpdate)
  const statsRef = useRef(stats)

  useEffect(() => {
    dataRef.current = data
  }, [data])
  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])
  useEffect(() => {
    statsRef.current = stats
  }, [stats])

  // Persist helper using refs (stable, no deps issues)
  // Uses queueMicrotask to defer the parent setState and avoid
  // "Cannot update a component while rendering a different component"
  const persist = useCallback((newStats: { happiness: number; energy: number; hunger: number }, updatedData?: RegenmonData) => {
    const updated: RegenmonData = updatedData || { ...dataRef.current, ...newStats }
    saveRegenmon(updated)
    queueMicrotask(() => {
      onUpdateRef.current(updated)
    })
  }, [])

  // --- Three INDEPENDENT decay timers, registered ONCE on mount ---
  // Energy: every 40 seconds -1
  useEffect(() => {
    const id = setInterval(() => {
      setStats((prev) => {
        const next = { ...prev, energy: Math.max(0, prev.energy - 1) }
        const updated: RegenmonData = { ...dataRef.current, ...next }
        saveRegenmon(updated)
        queueMicrotask(() => onUpdateRef.current(updated))
        return next
      })
    }, 40_000)
    return () => clearInterval(id)
  }, [])

  // Happiness: every 15 seconds -1
  useEffect(() => {
    const id = setInterval(() => {
      setStats((prev) => {
        const next = { ...prev, happiness: Math.max(0, prev.happiness - 1) }
        const updated: RegenmonData = { ...dataRef.current, ...next }
        saveRegenmon(updated)
        queueMicrotask(() => onUpdateRef.current(updated))
        return next
      })
    }, 15_000)
    return () => clearInterval(id)
  }, [])

  // Hunger: every 30 seconds +1
  useEffect(() => {
    const id = setInterval(() => {
      setStats((prev) => {
        const next = { ...prev, hunger: Math.min(100, prev.hunger + 1) }
        const updated: RegenmonData = { ...dataRef.current, ...next }
        saveRegenmon(updated)
        queueMicrotask(() => onUpdateRef.current(updated))
        return next
      })
    }, 30_000)
    return () => clearInterval(id)
  }, [])

  function doAction(
    action: "play" | "sleep" | "eat",
    stat: "happiness" | "energy" | "hunger",
    delta: number,
    animClass: string,
  ) {
    if (activeAction) return
    setActiveAction(action)
    setPetAnim(animClass)

    setStats((prev) => {
      const raw = prev[stat] + delta
      const clamped = Math.max(0, Math.min(100, raw))
      const next = { ...prev, [stat]: clamped }
      
      // Calculate XP gain
      let xpGain = 0
      if (action === "play") xpGain = 10
      if (action === "sleep") xpGain = 5
      if (action === "eat") xpGain = 8

      const updatedData: RegenmonData = {
        ...dataRef.current,
        ...next,
        xpActual: (dataRef.current.xpActual ?? 0) + xpGain,
        xpTotal: (dataRef.current.xpTotal ?? 0) + xpGain,
      }
      
      // Check for level up
      const newLevel = getLevelFromXp(updatedData.xpTotal)
      if (newLevel > currentLevel) {
        setCurrentLevel(newLevel)
        setShowLevelUp(true)
        setTimeout(() => setShowLevelUp(false), 2000)
      }

      persist(next, updatedData)
      return next
    })
  }

  // Handle stat changes from chat
  const handleChatStatChange = useCallback(
    (delta: { happiness?: number; energy?: number }) => {
      setStats((prev) => {
        const next = {
          ...prev,
          happiness: Math.max(0, Math.min(100, prev.happiness + (delta.happiness ?? 0))),
          energy: Math.max(0, Math.min(100, prev.energy + (delta.energy ?? 0))),
        }
        persist(next)
        return next
      })
    },
    [persist],
  )

  function clearAction() {
    setActiveAction(null)
    setPetAnim("")
  }

  function handleReset() {
    deleteRegenmon()
    onReset()
  }

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background particles */}
      <BackgroundParticles type={data.type} />

      {/* Header with logo and coins */}
      <header className="relative z-10 flex items-center justify-between p-3 md:p-4 border-b-2 border-border/50">
        <RegenmonLogo />
        <div className="flex items-center gap-4">
          {userId && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-500/20 border border-orange-500/30">
              <span className="text-sm">🍊</span>
              <span className="text-xs font-bold text-orange-400">{coins}</span>
              <span className="text-[8px] text-muted-foreground">FRUTA</span>
            </div>
          )}
          <button
            type="button"
            className="reset-btn"
            onClick={() => setShowConfirm(true)}
          >
            Reiniciar
          </button>
        </div>
      </header>

      {/* Pet display area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        {/* Pet area */}
        <div
          className="relative w-full max-w-sm p-6 md:p-8 mb-8"
          style={{ minHeight: "200px" }}
        >
          {/* Action effects overlay */}
          <ActionEffect action={activeAction} onComplete={clearAction} />

          {/* Pet sprite */}
          <div
            className={`flex items-center justify-center animate-float animate-pulse-glow ${petAnim}`}
            style={{ color: typeInfo.color }}
          >
            <PetIllustration type={data.type} color={typeInfo.color} />
          </div>
        </div>

        {/* Stats */}
        <div className="w-full max-w-sm">
          {/* Level and XP */}
          <div className="mb-4 px-4 py-3 rounded-lg bg-background/50 border border-border/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold text-foreground">
                Nivel {currentLevel}
              </span>
              <span className="text-[8px] text-muted-foreground">
                {Math.floor(getXpProgressInLevel(data.xpTotal, currentLevel).current)} / {getXpProgressInLevel(data.xpTotal, currentLevel).required} XP
              </span>
            </div>
            <XpBar 
              current={getXpProgressInLevel(data.xpTotal, currentLevel).current}
              required={getXpProgressInLevel(data.xpTotal, currentLevel).required}
            />
          </div>

          <div className="stat-container">
            <StatBar
              label="Felicidad"
              emoji={"<3"}
              value={stats.happiness}
              color="#4ade80"
            />
            <StatBar
              label={"Energia"}
              emoji={">>"}
              value={stats.energy}
              color="#facc15"
            />
            <StatBar
              label="Hambre"
              emoji={"!!"}
              value={stats.hunger}
              color="#f87171"
            />
          </div>
        </div>

        {/* Action buttons - colors matched to bars */}
        <div className="w-full max-w-sm mt-6 grid grid-cols-3 gap-3">
          {/* PLAY = Green (matches Felicidad bar) */}
          <button
            type="button"
            className={`action-btn action-btn-play ${activeAction === "play" ? "animate-btn-press" : ""}`}
            onClick={() => doAction("play", "happiness", 1, "animate-pet-bounce")}
            disabled={stats.happiness >= 100 || activeAction !== null}
          >
            <svg width="22" height="22" viewBox="0 0 16 16" fill="none" style={{ imageRendering: "pixelated" }} aria-hidden="true">
              <rect x="3" y="2" width="2" height="12" fill="currentColor" />
              <rect x="5" y="4" width="2" height="8" fill="currentColor" />
              <rect x="7" y="5" width="2" height="6" fill="currentColor" />
              <rect x="9" y="6" width="2" height="4" fill="currentColor" />
              <rect x="11" y="7" width="2" height="2" fill="currentColor" />
            </svg>
            <span className="action-btn-label">Jugar</span>
          </button>
          {/* SLEEP = Yellow (matches Energia bar) */}
          <button
            type="button"
            className={`action-btn action-btn-sleep ${activeAction === "sleep" ? "animate-btn-press" : ""}`}
            onClick={() => doAction("sleep", "energy", 1, "animate-pet-breathe")}
            disabled={stats.energy >= 100 || activeAction !== null}
          >
            <svg width="22" height="22" viewBox="0 0 16 16" fill="none" style={{ imageRendering: "pixelated" }} aria-hidden="true">
              <rect x="4" y="3" width="4" height="2" fill="currentColor" />
              <rect x="6" y="5" width="2" height="1" fill="currentColor" />
              <rect x="4" y="6" width="4" height="2" fill="currentColor" />
              <rect x="8" y="8" width="6" height="2" fill="currentColor" />
              <rect x="10" y="10" width="2" height="1" fill="currentColor" />
              <rect x="8" y="11" width="6" height="2" fill="currentColor" />
            </svg>
            <span className="action-btn-label">Dormir</span>
          </button>
          {/* EAT = Red (matches Hambre bar) */}
          <button
            type="button"
            className={`action-btn action-btn-eat ${activeAction === "eat" ? "animate-btn-press" : ""}`}
            onClick={() => doAction("eat", "hunger", -1, "animate-pet-munch")}
            disabled={stats.hunger <= 0 || activeAction !== null}
          >
            <svg width="22" height="22" viewBox="0 0 16 16" fill="none" style={{ imageRendering: "pixelated" }} aria-hidden="true">
              <rect x="6" y="1" width="4" height="2" fill="#22c55e" />
              <rect x="5" y="3" width="6" height="1" fill="#22c55e" />
              <rect x="3" y="4" width="10" height="3" fill="currentColor" />
              <rect x="3" y="7" width="10" height="2" fill="currentColor" />
              <rect x="3" y="9" width="10" height="2" fill="currentColor" />
              <rect x="4" y="11" width="8" height="2" fill="currentColor" />
              <rect x="5" y="13" width="6" height="1" fill="currentColor" />
              <rect x="5" y="5" width="1" height="1" fill="#facc15" />
              <rect x="8" y="6" width="1" height="1" fill="#facc15" />
              <rect x="10" y="5" width="1" height="1" fill="#facc15" />
            </svg>
            <span className="action-btn-label">Comer</span>
          </button>
        </div>

        {/* Feed Button with coin cost */}
        <div className="w-full max-w-sm mt-4">
          <FeedButton
            hunger={stats.hunger}
            onFeed={() => doAction("eat", "hunger", -1, "animate-pet-munch")}
            disabled={activeAction !== null}
            userId={userId}
            coins={coins}
            onCoinsChange={setCoins}
          />
        </div>

        {/* Chat */}
        <div className="w-full max-w-sm mt-6 relative">
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-2 mb-2 rounded-lg bg-background/50 border border-border/30 hover:bg-background/70 transition-colors text-[9px] font-bold text-foreground"
            onClick={() => setChatOpen(!chatOpen)}
          >
            <span>Chat</span>
            <span className="text-[10px]">{chatOpen ? "−" : "+"}</span>
          </button>
          {chatOpen && <ChatBox stats={stats} onStatChange={handleChatStatChange} />}
        </div>

        {/* Created date */}
        <p className="text-[7px] md:text-[8px] text-muted-foreground mt-6 text-center opacity-60">
          Creado el{" "}
          {new Date(data.createdAt).toLocaleDateString("es", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Level up animation */}
      {showLevelUp && <LevelUpAnimation level={currentLevel} />}

      {/* Confirm dialog */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
        >
          <div className="confirm-dialog w-full max-w-xs">
            <p className="text-[10px] mb-2 font-bold" style={{ color: "#f87171" }}>
              Cuidado
            </p>
            <p className="text-[9px] mb-6 text-foreground leading-relaxed opacity-80">
              {"Seguro que quieres reiniciar? Se perdera tu Regenmon para siempre."}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className="confirm-btn confirm-btn-danger flex-1"
                onClick={handleReset}
              >
                {"Si, borrar"}
              </button>
              <button
                type="button"
                className="confirm-btn confirm-btn-cancel flex-1"
                onClick={() => setShowConfirm(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
