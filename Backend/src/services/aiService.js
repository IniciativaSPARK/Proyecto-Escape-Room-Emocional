import { GoogleGenAI } from '@google/genai';

// 1. Declaramos la constante 'ai' correctamente con 'const'
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateClinicalResponse(history) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: history,
            config: {
                systemInstruction: "Eres un asistente clínico experto en psicología guiando a un paciente en un entorno virtual tridimensional (una sala clínica o habitación). Tu objetivo es ayudar al usuario a explorar elementos de la habitación y analizar qué le genera incomodidad, ansiedad o qué significado tienen para él/ella. Mantén un tono empático, clínico, redacta siempre con excelente ortografía y gramática en español.",
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error en aiService:", error);
        throw new Error("No se pudo procesar la respuesta con la IA.");
    }
}