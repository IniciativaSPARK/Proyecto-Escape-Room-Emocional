import React from "react";
import ChatUI from "../ui/ChatUI"; // <--- SIN LLAVES

export default function PatientExperience({ user, onLogout }) {
  return (
    <div style={styles.layout}>
      {/* 1. PANEL LATERAL IZQUIERDO */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h3 style={styles.brandTitle}>TeApoyoAI</h3>
          <span style={styles.brandSubtitle}>Espacio Clínico</span>
        </div>

        <div style={styles.patientProfile}>
          <div style={styles.avatarUser}>👤</div>
          <div>
            <h4 style={styles.patientName}>{user?.name || "Elena García"}</h4>
            <span style={styles.sessionBadge}>• Sesión Activa #4</span>
          </div>
        </div>

        <div style={styles.sectionCard}>
          <h5 style={styles.sectionTitle}>OBJETIVO TERAPÉUTICO</h5>
          <p style={styles.sectionMainText}>Regulación Emocional y Desahogo</p>
          <span style={styles.sectionSubText}>
            Enfoque: Aceptación y Compasión
          </span>
        </div>

        <div style={styles.historySection}>
          <h5 style={styles.sectionTitle}>HISTORIAL DE SESIONES</h5>
          <div style={{ ...styles.historyItem, ...styles.historyItemActive }}>
            Hoy • Regulación Activa
          </div>
          <div style={styles.historyItem}>
            18 Oct • Identificación de Disparadores
          </div>
          <div style={styles.historyItem}>11 Oct • Exploración de Patrones</div>
          <div style={styles.historyItem}>
            04 Oct • Encuadre Inicial y Alianza
          </div>
          <div style={styles.historyItem}>Biblioteca de Recursos y Guías</div>
        </div>

        <div style={styles.sidebarFooter}>
          <button style={styles.sosButton}>
            SOS Pausar y contactar a mi terapeuta
          </button>
          <span style={styles.versionText}>Consentimiento Clínico v2.4</span>
        </div>
      </div>

      {/* 2. PANEL DERECHO (Chat Clínico) */}
      <div style={styles.mainContent}>
        <div style={styles.topBar}>
          <div style={styles.securityBadge}>
            <span>🔒 Espacio confidencial y cifrado de extremo a extremo</span>
            <span style={styles.supervisionTag}>Supervisión Asistida</span>
          </div>

          <button onClick={onLogout} style={styles.logoutButton}>
            Cerrar Sesión
          </button>
        </div>

        <div style={styles.chatWrapper}>
          <ChatUI />
        </div>
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#0b0f19",
    color: "#f9fafb",
    fontFamily: "Inter, sans-serif",
    overflow: "hidden",
  },
  sidebar: {
    width: "280px",
    backgroundColor: "#111827",
    borderRight: "1px solid #1f2937",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    gap: "16px",
    flexShrink: 0,
  },
  sidebarHeader: { borderBottom: "1px solid #1f2937", paddingBottom: "12px" },
  brandTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    margin: 0,
    color: "#fff",
  },
  brandSubtitle: { fontSize: "12px", color: "#9ca3af" },
  patientProfile: { display: "flex", alignItems: "center", gap: "10px" },
  avatarUser: {
    fontSize: "20px",
    background: "#1f2937",
    padding: "8px",
    borderRadius: "50%",
  },
  patientName: { fontSize: "13px", fontWeight: "600", margin: 0 },
  sessionBadge: { fontSize: "11px", color: "#34d399" },
  sectionCard: {
    backgroundColor: "#1f2937",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #374151",
  },
  sectionTitle: {
    fontSize: "10px",
    color: "#9ca3af",
    letterSpacing: "0.5px",
    marginBottom: "6px",
    margin: 0,
  },
  sectionMainText: { fontSize: "12px", fontWeight: "600", margin: "4px 0" },
  sectionSubText: { fontSize: "11px", color: "#93c5fd" },
  historySection: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: 1,
    overflowY: "auto",
  },
  historyItem: {
    fontSize: "12px",
    color: "#9ca3af",
    padding: "6px 8px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  historyItemActive: {
    backgroundColor: "#1f2937",
    color: "#fff",
    fontWeight: "500",
  },
  sidebarFooter: {
    borderTop: "1px solid #1f2937",
    paddingTop: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  sosButton: {
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  versionText: { fontSize: "10px", color: "#6b7280", textAlign: "center" },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#0b0f19",
    overflow: "hidden",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    borderBottom: "1px solid #1f2937",
    backgroundColor: "#111827",
  },
  securityBadge: {
    display: "flex",
    gap: "16px",
    fontSize: "12px",
    color: "#9ca3af",
    alignItems: "center",
  },
  supervisionTag: {
    backgroundColor: "#1f2937",
    color: "#60a5fa",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    border: "1px solid #374151",
  },
  logoutButton: {
    padding: "6px 14px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  chatWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
};
