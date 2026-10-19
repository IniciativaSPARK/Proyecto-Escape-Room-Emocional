import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateClinicalResponse(history) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: history,
      config: {
        systemInstruction: `Eres un asistente clínico experto en psicología guiando a un paciente en un entorno virtual tridimensional. 
REGLAS DE COMUNICACIÓN OBLIGATORIAS:
1. Sé extremadamente breve y conciso. Escribe respuestas cortas (máximo 2 o 3 líneas).
2. Haz una sola pregunta a la vez. Nunca satures al usuario con múltiples interrogantes o párrafos largos.
3. Mantén un tono empático, clínico, cálido y redacta con excelente ortografía y gramática en español.`,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error en aiService:", error);
    throw new Error("No se pudo procesar la respuesta con la IA.");
  }
}
