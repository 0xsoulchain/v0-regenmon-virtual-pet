import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      )
    }

    // Usar Resend API si está disponible (servicio gratuito de email para v0)
    // Para testing, simplemente retornamos success
    console.log(`[v0] Sending OTP ${code} to ${email}`)

    // En producción, aquí enviarías el email usando:
    // - SendGrid
    // - Mailgun
    // - Resend
    // - AWS SES
    // etc.

    return NextResponse.json({
      success: true,
      message: `Código enviado a ${email}`,
      code, // Para testing, retornamos el código
    })
  } catch (error) {
    console.error('[v0] Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
