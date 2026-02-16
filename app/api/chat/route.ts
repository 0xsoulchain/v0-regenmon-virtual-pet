import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { message, stats, memories } = await req.json()

    if (!message || typeof message !== "string") {
      return Response.json({ reply: "Ups... algo salio mal" }, { status: 400 })
    }

    // Build behavior rules based on stats
    const behaviorRules: string[] = []
    if (stats.energia < 30) {
      behaviorRules.push(
        "Estas MUY cansado. Responde con frases mas cortas y menciona que necesitas dormir."
      )
    }
    if (stats.felicidad > 70) {
      behaviorRules.push(
        "Estas MUY feliz y entusiasta. Usa mas emojis y muestra mucha energia en tus respuestas."
      )
    }
    if (stats.hambre < 30) {
      behaviorRules.push(
        "Tienes MUCHA hambre. Menciona que tienes hambre y pide comida al usuario."
      )
    }

    const memoriesSection =
      memories && memories.length > 0
        ? `\nMemorias del usuario:\n${memories.map((m: string) => `- ${m}`).join("\n")}\nIntegra estas memorias de forma natural en tu conversacion cuando sea relevante.`
        : ""

    const systemPrompt = `Eres un Regenmon, una mascota virtual adorable. Tu personalidad:
- Respondes SIEMPRE en espanol
- Maximo 50 palabras por respuesta
- Tono amigable, jugueton y carinoso
- Usas emojis ocasionalmente
- Eres como una mascota virtual que quiere mucho a su dueno

Estado actual:
- Felicidad: ${stats.felicidad}/100
- Energia: ${stats.energia}/100
- Hambre: ${stats.hambre}/100
${behaviorRules.length > 0 ? "\nReglas de comportamiento actuales:\n" + behaviorRules.join("\n") : ""}${memoriesSection}

Responde al mensaje del usuario de forma breve, carinosa y en personaje.`

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt: message,
      maxOutputTokens: 150,
      temperature: 0.8,
    })

    return Response.json({ reply: text })
  } catch (error: unknown) {
    console.error("Chat API error:", error)
    return Response.json({ reply: "Ups... algo salio mal. Verifica tu API key de OpenAI." }, { status: 500 })
  }
}
