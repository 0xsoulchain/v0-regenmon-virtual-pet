'use client'

import { useState, useEffect } from 'react'
import { getUserHistory } from '@/lib/managers/user-data-manager'

interface ActivityHistoryProps {
  userId?: string
}

export function ActivityHistory({ userId }: ActivityHistoryProps) {
  const [history, setHistory] = useState<Array<{
    accion: string
    cambioMonedas: number
    timestamp: number
  }>>([])

  useEffect(() => {
    if (userId) {
      const historyData = getUserHistory(userId, 10)
      setHistory(historyData)
    }
  }, [userId])

  if (!userId || history.length === 0) {
    return (
      <div className="w-full max-w-sm p-4 rounded-lg border border-border/30 bg-background/40">
        <h3 className="text-xs font-bold text-foreground mb-3">Historial</h3>
        <p className="text-[8px] text-muted-foreground text-center py-4">
          No hay actividades aún
        </p>
      </div>
    )
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const getActionEmoji = (accion: string) => {
    const lower = accion.toLowerCase()
    if (lower.includes('conseguir')) return '💰'
    if (lower.includes('alimentar')) return '🍎'
    if (lower.includes('jugar')) return '🎮'
    if (lower.includes('dormir')) return '😴'
    if (lower.includes('chat')) return '💬'
    if (lower.includes('gasto')) return '💸'
    return '📝'
  }

  return (
    <div className="w-full max-w-sm p-4 rounded-lg border border-border/30 bg-background/40">
      <h3 className="text-xs font-bold text-foreground mb-3">Historial (últimas 10)</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {history.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-[8px] p-2 rounded bg-background/50 border border-border/20"
          >
            <div className="flex items-center gap-2 flex-1">
              <span>{getActionEmoji(item.accion)}</span>
              <span className="text-muted-foreground truncate">{item.accion}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={item.cambioMonedas > 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                {item.cambioMonedas > 0 ? '+' : ''}{item.cambioMonedas}
              </span>
              <span className="text-muted-foreground/70">{formatTime(item.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
