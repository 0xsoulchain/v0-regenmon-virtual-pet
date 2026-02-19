// User data management for OTP-based authentication
export interface RegenmonUser {
  userId: string
  email: string
  monedas: number
  lastDailyReset: string
  dailyCoinsEarned: number
  regenmon: {
    nombre: string
    tipo: string
    felicidad: number
    energia: number
    hambre: number
    nivel: number
    xpActual: number
    xpTotal: number
  } | null
  historial: Array<{
    accion: string
    monedas: number
    timestamp: string
  }>
}
