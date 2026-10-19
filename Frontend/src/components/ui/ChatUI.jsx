import React, { useState } from "react";

export default function ChatUI() {
  // 1. Mensajes vacíos al iniciar para una experiencia limpia
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userText = inputMessage;
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Construir el nuevo arreglo de mensajes incluyendo el actual
    const updatedMessages = [
      ...messages,
      { sender: "user", text: userText, time: currentTime },
    ];

    setMessages(updatedMessages);
    setInputMessage("");
    setLoading(true);

    try {
      // Transformamos los mensajes al formato que el backend/Gemini suele requerir (role y parts)
      const formattedHistory = updatedMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      const response = await fetch("http://localhost:3000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
          history: formattedHistory,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al comunicarse con la IA");
      }

      setMessages([
        ...updatedMessages,
        {
          sender: "ai",
          text: data.reply || data.message || "Te escucho.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (error) {
      console.error("Error en el chat:", error);
      setMessages([
        ...updatedMessages,
        {
          sender: "ai",
          text: "Lo siento, hubo un problema al procesar tu mensaje con la IA.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messagesList}>
        {messages.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>💙</span>
            <h3>Tu espacio seguro está listo</h3>
            <p>
              Escribe libremente lo que sientes o lo que quieras trabajar en
              esta sesión.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              style={msg.sender === "user" ? styles.userRow : styles.aiRow}
            >
              {msg.sender === "ai" && <div style={styles.avatarAi}>💙</div>}

              <div
                style={
                  msg.sender === "user" ? styles.userBubble : styles.aiBubble
                }
              >
                <p style={styles.messageText}>{msg.text}</p>
                <span style={styles.timestamp}>{msg.time}</span>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div style={styles.aiRow}>
            <div style={styles.avatarAi}>💙</div>
            <div style={styles.aiBubble}>
              <p style={styles.messageText}>Escribiendo respuesta...</p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} style={styles.inputArea}>
        <div style={styles.inputWrapper}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Escribe libremente lo que sientes..."
            style={styles.textInput}
            disabled={loading}
          />
          <button type="submit" disabled={loading} style={styles.sendButton}>
            {loading ? "..." : "Enviar ↑"}
          </button>
        </div>
        <p style={styles.disclaimerText}>
          Las respuestas son supervisadas por tu terapeuta asignado. En caso de
          crisis severa pulsa SOS.
        </p>
      </form>
    </div>
  );
}
const styles = {
  chatContainer: {
    // ...
    backgroundColor: "#2D3B36", // Base: Space Cadet (Integrado y oscuro)
  },
  aiBubble: {
    backgroundColor: "#F2EDE3", // Arena (Burbuja clara y cálida para la IA)
    // ...
    border: "1px solid #8B9690", // Niebla
  },
  userBubble: {
    backgroundColor: "#6B9B7E", // Eucalipto (Burbuja usuario)
    color: "#FBF8F3", // Texto: Lino
    // ...
  },
  messageText: {
    // ...
    color: "#2D3B36", // Texto oscuro (Para leer sobre Arena y Eucalipto)
  },
  inputWrapper: {
    backgroundColor: "#FBF8F3", // Caja clara: Lino
    border: "1px solid #8B9690", // Niebla
    // ...
  },
  textInput: {
    // ...
    color: "#2D3B36", // Space Cadet
  },
  sendButton: {
    backgroundColor: "#A8C5D4", // Acento suave: Cielo (Más frío, más serio)
    color: "#2D3B36", // Space Cadet
    // ...
  },
  messagesList: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 0",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#8B9690", // Niebla
    textAlign: "center",
    gap: "8px",
  },
  emptyIcon: { fontSize: "40px" },
  aiRow: { display: "flex", gap: "10px", maxWidth: "80%" },
  userRow: {
    display: "flex",
    justifyContent: "flex-end",
    maxWidth: "80%",
    alignSelf: "flex-end",
  },
  avatarAi: { fontSize: "20px" },
  aiBubble: {
    backgroundColor: "#F2EDE3", // Arena (Burbuja clara y cálida para la IA)
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #8B9690", // Niebla
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  userBubble: {
    backgroundColor: "#6B9B7E", // Eucalipto (Burbuja del usuario)
    color: "#FBF8F3", // Lino
    padding: "14px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  messageText: {
    fontSize: "14px",
    margin: 0,
    lineHeight: "1.5",
    color: "#2D3B36", // Space Cadet (Texto oscuro para lectura clara sobre el fondo Arena)
  },
  timestamp: { fontSize: "10px", color: "#8B9690", alignSelf: "flex-end" }, // Niebla
  inputArea: {
    padding: "10px 0 20px 0",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  inputWrapper: {
    display: "flex",
    backgroundColor: "#FBF8F3", // Lino (Caja de texto clara e identificable)
    border: "1px solid #8B9690", // Niebla
    borderRadius: "10px",
    padding: "8px",
    alignItems: "center",
    gap: "10px",
  },
  textInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "#2D3B36", // Space Cadet (Texto que escribe el usuario)
    fontSize: "14px",
    outline: "none",
    padding: "4px",
  },
  sendButton: {
    backgroundColor: "#F4A988", // Durazno (Acento llamativo y cálido para enviar)
    color: "#2D3B36", // Space Cadet
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  disclaimerText: {
    fontSize: "10px",
    color: "#8B9690", // Niebla
    textAlign: "center",
    margin: 0,
  },
};
