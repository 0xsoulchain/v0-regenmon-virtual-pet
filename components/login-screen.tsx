'use client'

import { useState } from 'react'
import { logoutCurrentUser } from '@/lib/simple-auth'

interface LoginScreenProps {
  onLogin: (email: string) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Por favor ingresa tu correo')
      return
    }

    if (!validateEmail(email)) {
      setError('Correo inválido')
      return
    }

    setIsLoading(true)
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsLoading(false)

    onLogin(email)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/50">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🍊</div>
          <h1 className="text-3xl font-bold mb-2 text-foreground" style={{ fontFamily: 'var(--font-pixel)' }}>
            REGENMON
          </h1>
          <p className="text-sm text-muted-foreground">Crea y cuida tu mascota virtual</p>
        </div>

        <form onSubmit={handleLogin} className="nes-container with-title">
          <p className="title">Inicia Sesión</p>

          <div className="mb-4">
            <label htmlFor="email" className="nes-label text-xs block mb-2">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="nes-input w-full text-xs"
              disabled={isLoading}
              required
            />
            {error && <p className="text-red-400 text-[8px] mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            className="nes-btn is-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? '⏳ Cargando...' : '→ Entrar'}
          </button>

          <p className="text-[8px] text-muted-foreground text-center mt-4">
            Tus datos se guardan en tu navegador
          </p>
        </form>
      </div>
    </main>
  )
}
