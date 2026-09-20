import { generateClinicalResponse } from '../services/aiService.js';

export const handleAiChat = async (req, res) => {
    try {
        const { messages } = req.body; // Recibe el historial de mensajes del frontend

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Se requiere un arreglo de mensajes válido." });
        }

        const aiReply = await generateClinicalResponse(messages);
        
        res.status(200).json({ 
            success: true,
            reply: aiReply 
        });
    } catch (error) {
        console.error("Error en aiController:", error);
        res.status(500).json({ error: "Error interno en el servidor de IA." });
    }
};