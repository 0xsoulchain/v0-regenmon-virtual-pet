/**
 * Gestiona intervalos para el Regenmon de manera centralizada
 * Evita duplicación de timers y permite control global
 */

interface TimerHandle {
  id: string
  intervalId: NodeJS.Timeout | null
  lastRun: number
}

const activeTimers: Map<string, TimerHandle> = new Map()

/**
 * Inicia o reinicia un intervalo con un ID único
 */
export function setIntervalWithId(
  id: string,
  callback: () => void,
  interval: number
): void {
  // Limpiar timer anterior si existe
  if (activeTimers.has(id)) {
    const timer = activeTimers.get(id)
    if (timer?.intervalId) {
      clearInterval(timer.intervalId)
    }
  }

  const intervalId = setInterval(callback, interval)
  activeTimers.set(id, {
    id,
    intervalId,
    lastRun: Date.now(),
  })
}

/**
 * Detiene un intervalo específico
 */
export function clearIntervalWithId(id: string): void {
  const timer = activeTimers.get(id)
  if (timer?.intervalId) {
    clearInterval(timer.intervalId)
    activeTimers.delete(id)
  }
}

/**
 * Limpia todos los intervalos activos
 */
export function clearAllIntervals(): void {
  activeTimers.forEach((timer) => {
    if (timer.intervalId) {
      clearInterval(timer.intervalId)
    }
  })
  activeTimers.clear()
}

/**
 * Obtiene información sobre los timers activos (útil para debugging)
 */
export function getActiveTimers(): Array<{ id: string; msAgo: number }> {
  return Array.from(activeTimers.values()).map((timer) => ({
    id: timer.id,
    msAgo: Date.now() - timer.lastRun,
  }))
}
