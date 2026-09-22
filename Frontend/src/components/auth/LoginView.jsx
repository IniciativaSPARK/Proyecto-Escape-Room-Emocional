import React, { useState } from "react";

export default function LoginView({ onLoginSuccess, onSwitchToRegister }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Credenciales inválidas");
      }

      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || "Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Escape Room Emocional</h2>
          <p style={styles.subtitle}>TeApoyoAI</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nombre de Usuario</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="user#0123"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={styles.passwordInput}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>
          </div>

          <div style={styles.linksRow}>
            <a href="/forgot-password" style={styles.forgotPasswordLink}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.primaryButton}>
            {loading ? "Validando..." : "Ingresar al Panel"}
          </button>
        </form>

        {/* Sección de Registro con botón cuadrado con relleno */}
        <div style={styles.registerSection}>
          <p style={styles.registerText}>¿Aún no tienes una cuenta?</p>
          <button
            type="button"
            onClick={onSwitchToRegister}
            style={styles.registerButton}
          >
            Registrarse como Paciente / Profesional
          </button>
        </div>
      </div>
    </div>
  );
}

// Estilos adaptados al modo oscuro y requerimientos visuales
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#111827", // Fondo oscuro general
    fontFamily: "Inter, system-ui, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "440px",
    padding: "40px",
    background: "#1f2937", // Tarjeta gris oscura (estilo de imagen)
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
    border: "1px solid #374151",
  },
  header: {
    marginBottom: "28px",
    textAlign: "center",
  },
  title: {
    color: "#f9fafb",
    fontSize: "22px",
    fontWeight: "700",
    margin: 0,
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: "14px",
    marginTop: "6px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    color: "#e5e7eb",
    fontWeight: "500",
  },
  input: {
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid #4b5563",
    backgroundColor: "#111827",
    color: "#f9fafb",
    fontSize: "14px",
    outline: "none",
  },
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  passwordInput: {
    width: "100%",
    padding: "12px 40px 12px 14px",
    borderRadius: "8px",
    border: "1px solid #4b5563",
    backgroundColor: "#111827",
    color: "#f9fafb",
    fontSize: "14px",
    outline: "none",
  },
  eyeButton: {
    position: "absolute",
    right: "12px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    color: "#9ca3af",
  },
  linksRow: {
    display: "flex",
    justifyContent: "flex-end",
  },
  forgotPasswordLink: {
    fontSize: "13px",
    color: "#60a5fa",
    textDecoration: "none",
  },
  primaryButton: {
    marginTop: "6px",
    padding: "12px",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  registerSection: {
    marginTop: "24px",
    paddingTop: "20px",
    borderTop: "1px solid #374151",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  registerText: {
    fontSize: "13px",
    color: "#9ca3af",
    margin: 0,
  },
  registerButton: {
    padding: "10px 14px",
    backgroundColor: "#374151", // Botón con relleno y aspecto cuadrado/rectangular
    color: "#f9fafb",
    border: "1px solid #4b5563",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  errorBox: {
    padding: "10px",
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    color: "#fca5a5",
    fontSize: "13px",
    borderRadius: "6px",
    textAlign: "center",
    border: "1px solid rgba(239, 68, 68, 0.4)",
  },
};
