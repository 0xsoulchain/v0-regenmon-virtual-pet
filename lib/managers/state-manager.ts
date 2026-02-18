import { RegenmonData, saveRegenmon } from "../regenmon"
import { addXp } from "./xp-manager"

/**
 * Tipos de eventos que puede disparar el estado del Regenmon
 */
export interface StateChangeEvent {
  type: "stat-change" | "xp-gain" | "level-up" | "decay" | "action"
  data: Record<string, unknown>
}

type StateListener = (event: StateChangeEvent) => void

let listeners: Set<StateListener> = new Set()

/**
 * Se suscribe a cambios de estado
 */
export function onStateChange(listener: StateListener): () => void {
  listeners.add(listener)
  // Retorna función para desuscribirse
  return () => listeners.delete(listener)
}

/**
 * Dispara un evento de cambio de estado
 */
function emitStateChange(event: StateChangeEvent): void {
  listeners.forEach((listener) => listener(event))
}

/**
 * Limpia todos los listeners (útil cuando se destruye el componente)
 */
export function clearStateListeners(): void {
  listeners.clear()
}

/**
 * Reduce stats clampeados entre 0-100
 */
export function decayStats(regenmon: RegenmonData): Partial<RegenmonData> {
  const updated: Partial<RegenmonData> = {}

  // Reducir felicidad
  if (regenmon.happiness > 0) {
    updated.happiness = Math.max(0, regenmon.happiness - 1)
  }

  // Reducir energía
  if (regenmon.energy > 0) {
    updated.energy = Math.max(0, regenmon.energy - 1)
  }

  // Aumentar hambre
  if (regenmon.hunger < 100) {
    updated.hunger = Math.min(100, regenmon.hunger + 1)
  }

  emitStateChange({
    type: "decay",
    data: updated,
  })

  return updated
}

/**
 * Aplica una acción (feed, play, rest) y retorna cambios de estado
 */
export function applyAction(
  regenmon: RegenmonData,
  action: "feed" | "play" | "rest"
): {
  statChanges: Partial<RegenmonData>
  xpGain: number
} {
  const statChanges: Partial<RegenmonData> = {}
  let xpGain = 0

  switch (action) {
    case "feed":
      statChanges.hunger = Math.max(0, regenmon.hunger - 30)
      statChanges.happiness = Math.min(100, regenmon.happiness + 10)
      xpGain = 1
      break
    case "play":
      statChanges.happiness = Math.min(100, regenmon.happiness + 25)
      statChanges.hunger = Math.min(100, regenmon.hunger + 15)
      statChanges.energy = Math.max(0, regenmon.energy - 15)
      xpGain = 1
      break
    case "rest":
      statChanges.energy = Math.min(100, regenmon.energy + 40)
      statChanges.hunger = Math.min(100, regenmon.hunger + 10)
      xpGain = 1
      break
  }

  emitStateChange({
    type: "action",
    data: {
      action,
      statChanges,
      xpGain,
    },
  })

  return { statChanges, xpGain }
}

/**
 * Agrega XP y maneja level-ups
 */
export function addXpToRegenmon(
  regenmon: RegenmonData,
  amount: number
): Partial<RegenmonData> {
  const result = addXp(regenmon, amount)

  if (result.leveledUp) {
    emitStateChange({
      type: "level-up",
      data: {
        newLevel: result.newLevel,
        totalXp: result.newXpTotal,
      },
    })
  }

  emitStateChange({
    type: "xp-gain",
    data: {
      amount,
      currentXp: result.newXpActual,
      totalXp: result.newXpTotal,
      leveledUp: result.leveledUp,
    },
  })

  return {
    xpActual: result.newXpActual,
    xpTotal: result.newXpTotal,
    level: result.newLevel || regenmon.level,
  }
}

/**
 * Actualiza el estado del Regenmon y guarda en localStorage
 */
export function updateRegenmonState(
  regenmon: RegenmonData,
  changes: Partial<RegenmonData>
): RegenmonData {
  const updated = {
    ...regenmon,
    ...changes,
  }

  saveRegenmon(updated)

  emitStateChange({
    type: "stat-change",
    data: {
      previous: regenmon,
      updated,
    },
  })

  return updated
}
