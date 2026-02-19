Configuración de Email para Regenmon

OPCIÓN 1: Resend (Recomendado para Desarrollo)
================================================

Resend es un servicio de email moderno diseñado para desarrolladores. Es gratuito para desarrollo.

1. Crea una cuenta en https://resend.com
2. Obtén tu API key desde el dashboard
3. Agrega la variable de entorno en Vercel:
   - RESEND_API_KEY: tu_api_key_aqui

Una vez configurado, los códigos OTP se enviarán automáticamente por email.

OPCIÓN 2: SendGrid
===================

SendGrid también es una opción popular:

1. Crea cuenta en https://sendgrid.com
2. Obtén tu API key
3. Agrega como variable de entorno: SENDGRID_API_KEY

OPCIÓN 3: Testing Local
=======================

Sin configurar ninguna API key, el sistema:
- Genera códigos OTP válidos
- Los muestra en la consola del navegador (DevTools)
- Los mostrará en la pantalla de verificación para testing

Esto es útil para desarrollo local sin necesidad de integración de email.

ESTADO ACTUAL
=============

El sistema está configurado para:
1. Intentar enviar con Resend si RESEND_API_KEY está configurada
2. Hacer fallback a mostrar el código en consola si no
3. Permitir testing inmediato sin configuración

Para producción, se recomienda configurar Resend o SendGrid.
