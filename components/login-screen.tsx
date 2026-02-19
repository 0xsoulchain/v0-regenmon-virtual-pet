'use client'

import { useState } from 'react'
import { requestOTP, verifyOTP } from '@/lib/simple-auth'

interface LoginScreenProps {
  onLogin: (email: string) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [otpCode, setOtpCode] = useState<string>('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleRequestOTP = async (e: React.FormEvent) => {
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
    try {
      const result = await requestOTP(email)
      setOtpCode(result.code)
      setStep('otp')
    } catch (err) {
      setError('Error al enviar el código')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!otp.trim() || otp.length !== 6) {
      setError('Código inválido (debe tener 6 dígitos)')
      return
    }

    setIsLoading(true)
    try {
      const user = verifyOTP(email, otp)
      if (user) {
        onLogin(email)
      } else {
        setError('Código incorrecto o expirado')
      }
    } catch (err) {
      setError('Error al verificar el código')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setStep('email')
    setOtp('')
    setError('')
    setOtpCode('')
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

        {step === 'email' ? (
          <form onSubmit={handleRequestOTP} className="nes-container with-title">
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
              {isLoading ? '⏳ Enviando...' : '→ Enviar Código'}
            </button>

            <p className="text-[8px] text-muted-foreground text-center mt-4">
              Te enviaremos un código de verificación
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="nes-container with-title">
            <p className="title">Verifica tu Correo</p>

            <div className="mb-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded text-[8px] text-muted-foreground">
              Enviamos un código de 6 dígitos a<br/>
              <strong className="text-foreground">{email}</strong>
            </div>

            <div className="mb-4">
              <label htmlFor="otp" className="nes-label text-xs block mb-2">
                Código de Verificación
              </label>
              <input
                id="otp"
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="nes-input w-full text-xs text-center tracking-widest"
                disabled={isLoading}
                maxLength={6}
                required
              />
              {error && <p className="text-red-400 text-[8px] mt-2">{error}</p>}
              <p className="text-[8px] text-muted-foreground mt-2">
                Código para testing: {otpCode}
              </p>
            </div>

            <button
              type="submit"
              className="nes-btn is-primary w-full mb-2"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Verificando...' : '✓ Verificar'}
            </button>

            <button
              type="button"
              className="nes-btn w-full text-xs"
              onClick={handleBackToEmail}
              disabled={isLoading}
            >
              ← Volver
            </button>
          </form>
        )}
      </div>
    </main>
  )
}

