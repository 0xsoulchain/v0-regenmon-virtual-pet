export async function POST(req: Request) {
  try {
    const { message, stats, memories } = await req.json()

    if (!message || typeof message !== "string") {
      return Response.json({ reply: "Ups... algo salio mal" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error("[v0] OPENAI_API_KEY is not set")
      return Response.json(
        { reply: "Falta la API key de OpenAI. Agrega OPENAI_API_KEY en las variables de entorno." },
        { status: 500 },
      )
    }

    // Build behavior rules based on stats
    const behaviorRules: string[] = []
    if (stats.energia < 30) {
      behaviorRules.push(
        "Estas MUY cansado. Responde con frases mas cortas y menciona que necesitas dormir.",
      )
    }
    if (stats.felicidad > 70) {
      behaviorRules.push(
        "Estas MUY feliz y entusiasta. Usa mas emojis y muestra mucha energia en tus respuestas.",
      )
    }
    if (stats.hambre < 30) {
      behaviorRules.push(
        "Tienes MUCHA hambre. Menciona que tienes hambre y pide comida al usuario.",
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

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 150,
        temperature: 0.8,
      }),
    })

    if (!openaiRes.ok) {
      const errorBody = await openaiRes.text()
      console.error("[v0] OpenAI API error:", openaiRes.status, errorBody)
      return Response.json(
        { reply: `Error de OpenAI (${openaiRes.status}). Verifica tu API key.` },
        { status: 500 },
      )
    }

    const data = await openaiRes.json()
    const reply = data.choices?.[0]?.message?.content?.trim() || "..."

    return Response.json({ reply })
  } catch (error: unknown) {
    console.error("[v0] Chat API error:", error)
    return Response.json(
      { reply: "Ups... algo salio mal." },
      { status: 500 },
    )
  }
}
