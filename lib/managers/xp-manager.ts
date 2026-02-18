import { RegenmonData, getLevelFromXp, getXpProgressInLevel } from "../regenmon"

export interface XpGain {
  amount: number
  newLevel?: number
  leveledUp: boolean
  newXpActual: number
  newXpTotal: number
}

/**
 * Agrega XP al Regenmon y detecta si sube de nivel
 */
export function addXp(regenmon: RegenmonData, xpAmount: number): XpGain {
  const previousLevel = regenmon.level
  const newXpTotal = regenmon.xpTotal + xpAmount
  const newLevel = getLevelFromXp(newXpTotal)
  const leveledUp = newLevel > previousLevel

  // Calcular XP actual dentro del nuevo nivel
  const progress = getXpProgressInLevel(newXpTotal, newLevel)
  const newXpActual = progress.current

  return {
    amount: xpAmount,
    newLevel: leveledUp ? newLevel : undefined,
    leveledUp,
    newXpActual,
    newXpTotal,
  }
}

/**
 * Obtiene el porcentaje de progreso hacia el siguiente nivel (0-100)
 */
export function getXpPercentage(regenmon: RegenmonData): number {
  const progress = getXpProgressInLevel(regenmon.xpTotal, regenmon.level)
  if (progress.required === 0) return 0
  return Math.round((progress.current / progress.required) * 100)
}

/**
 * Información formateada del progreso de XP
 */
export function getXpInfo(regenmon: RegenmonData): {
  current: number
  required: number
  percentage: number
  level: number
} {
  const progress = getXpProgressInLevel(regenmon.xpTotal, regenmon.level)
  return {
    current: progress.current,
    required: progress.required,
    percentage: getXpPercentage(regenmon),
    level: regenmon.level,
  }
}
