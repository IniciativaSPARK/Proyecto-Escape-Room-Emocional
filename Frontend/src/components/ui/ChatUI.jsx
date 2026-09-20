import { useState } from "react";
import "./ChatUI.css";

export function ChatUI() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "¿Qué es lo que más te genera incomodidad en esta habitación?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");

    const updatedMessages = [
      ...messages,
      { sender: "user", text: userMessage },
    ];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Mapeamos el historial al formato que espera tu backend
      const formattedHistory = updatedMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      const response = await fetch("http://localhost:3000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: formattedHistory }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
      } else {
        throw new Error(data.error || "Error en el servidor");
      }
    } catch (error) {
      console.error("Error al comunicarse con el backend de IA:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Lo siento, hubo un error de conexión con el asistente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-window">
        <h3>Asistente Clínico</h3>

        <div
          className="messages-container"
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            marginBottom: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{ textAlign: msg.sender === "user" ? "right" : "left" }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  background: msg.sender === "user" ? "#007bff" : "#e9ecef",
                  color: msg.sender === "user" ? "#fff" : "#000",
                  maxWidth: "80%",
                  wordBreak: "break-word",
                }}
              >
                {msg.text}
              </span>
            </div>
          ))}
          {loading && (
            <div
              style={{ fontStyle: "italic", color: "#666", fontSize: "14px" }}
            >
              El asistente está pensando...
            </div>
          )}
        </div>

        <form onSubmit={sendMessage} style={{ display: "flex", gap: "5px" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu respuesta..."
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            style={{ padding: "8px 15px", cursor: "pointer" }}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
