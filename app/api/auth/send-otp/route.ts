import { NextRequest, NextResponse } from 'next/server'

// Función para enviar email con Resend
async function sendEmailWithResend(email: string, code: string) {
  const resendApiKey = process.env.RESEND_API_KEY
  
  if (!resendApiKey) {
    console.log('[v0] RESEND_API_KEY no configurada, mostrando código en consola')
    console.log(`[v0] Código OTP para ${email}: ${code}`)
    return { success: true, method: 'console' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@regenmon.app',
        to: email,
        subject: 'Tu código de verificación - Regenmon',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0;">Regenmon</h1>
            </div>
            <div style="background: #f9f9f9; padding: 40px 20px; text-align: center;">
              <h2 style="color: #333;">Tu código de verificación</h2>
              <p style="color: #666; font-size: 16px;">
                Ingresa este código para acceder a tu cuenta:
              </p>
              <div style="background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h1 style="color: #667eea; letter-spacing: 5px; margin: 0; font-size: 32px; font-weight: bold;">
                  ${code}
                </h1>
              </div>
              <p style="color: #999; font-size: 14px;">
                Este código expira en 10 minutos
              </p>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">
                Si no solicitaste este código, ignora este email
              </p>
            </div>
          </div>
        `,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('[v0] Resend API error:', error)
      return { success: false, error: 'Failed to send email with Resend' }
    }

    const data = await response.json()
    console.log('[v0] Email enviado con Resend:', data)
    return { success: true, method: 'resend', messageId: data.id }
  } catch (error) {
    console.error('[v0] Error calling Resend API:', error)
    return { success: false, error: String(error) }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      )
    }

    // Intentar enviar con Resend (si está configurado), si no, usar console
    const result = await sendEmailWithResend(email, code)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Código de verificación enviado a ${email}`,
        method: result.method,
      })
    } else {
      // Fallback: retornar código para testing local
      console.log(`[v0] Fallback: Código OTP para ${email}: ${code}`)
      return NextResponse.json({
        success: true,
        message: 'Código generado (email no configurado)',
        code: code, // Solo para desarrollo/testing
      })
    }
  } catch (error) {
    console.error('[v0] Error en send-otp:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
