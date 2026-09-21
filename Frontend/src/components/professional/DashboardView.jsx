import React, { useState, useEffect } from "react";

export default function DashboardView({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [metrics, setMetrics] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Consumimos el endpoint real de métricas y datos clínicos de Neon / Backend
    fetch("http://localhost:3000/api/dashboard")
      .then((res) => {
        if (!res.ok)
          throw new Error("Error al obtener datos del servidor backend");
        return res.json();
      })
      .then((data) => {
        setMetrics(
          data.metrics || {
            totalUsers: data.totalUsers ?? 24,
            totalCredentials: data.totalCredentials ?? 24,
            failedLogins: data.failedLogins ?? 2,
            serverStatus: data.serverStatus || "Online",
          },
        );

        // Si el backend devuelve clients los usa, si no, usa la data clínica de respaldo enriquecida
        setClients(
          data.clients || [
            {
              id: 1,
              name: "Elena García",
              protocol: "Ansiedad — Confrontación",
              lastSession: "Completada hace 2 días",
              risk: "1 alerta pendiente",
              aiReport: "3 patrones sin revisar",
            },
            {
              id: 2,
              name: "Miguel Rojas",
              protocol: "Duelo — Neutral",
              lastSession: "En progreso",
              risk: null,
              aiReport: "Todo revisado",
            },
            {
              id: 3,
              name: "Sofía Torres",
              protocol: "Autoestima — Validante",
              lastSession: "Sin iniciar",
              risk: null,
              aiReport: "1 patrón pendiente",
            },
            {
              id: 4,
              name: "Lucas Méndez",
              protocol: "Depresión — Cognitivo",
              lastSession: "Completada hace 5 días",
              risk: "2 alertas críticas",
              aiReport: "Todo revisado",
            },
          ],
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
        // Fallback seguro de métricas visuales para prototipado offline/local
        setMetrics({
          totalUsers: 24,
          totalCredentials: 24,
          failedLogins: 2,
          serverStatus: "Online (Fallback)",
        });
        setClients([
          {
            id: 1,
            name: "Elena García",
            protocol: "Ansiedad — Confrontación",
            lastSession: "Completada hace 2 días",
            risk: "1 alerta pendiente",
            aiReport: "3 patrones sin revisar",
          },
          {
            id: 2,
            name: "Miguel Rojas",
            protocol: "Duelo — Neutral",
            lastSession: "En progreso",
            risk: null,
            aiReport: "Todo revisado",
          },
          {
            id: 3,
            name: "Sofía Torres",
            protocol: "Autoestima — Validante",
            lastSession: "Sin iniciar",
            risk: null,
            aiReport: "1 patrón pendiente",
          },
          {
            id: 4,
            name: "Lucas Méndez",
            protocol: "Depresión — Cognitivo",
            lastSession: "Completada hace 5 días",
            risk: "2 alertas críticas",
            aiReport: "Todo revisado",
          },
        ]);
        setLoading(false);
      });
  }, []);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.protocol.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div style={styles.appContainer}>
      {/* 1. BARRA LATERAL (SIDEBAR) */}
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.brandBox}>
            <span style={styles.brandTag}>Escape Room Emocional</span>
            <h1 style={styles.brandTitle}>TeApoyoAI</h1>
          </div>

          <nav style={styles.nav}>
            <button
              onClick={() => setActiveTab("templates")}
              style={{
                ...styles.navButton,
                ...(activeTab === "templates" ? styles.navButtonActive : {}),
              }}
            >
              Plantillas
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              style={{
                ...styles.navButton,
                ...(activeTab === "notes" ? styles.navButtonActive : {}),
              }}
            >
              Notas Clínicas
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              style={{
                ...styles.navButton,
                ...(activeTab === "dashboard" ? styles.navButtonActive : {}),
              }}
            >
              Panel / Métricas
            </button>
            <button
              onClick={() => setActiveTab("clients")}
              style={{
                ...styles.navButton,
                ...(activeTab === "clients" ? styles.navButtonActive : {}),
              }}
            >
              Gestor de Clientes
            </button>
            <button
              onClick={() => setActiveTab("protocols")}
              style={{
                ...styles.navButton,
                ...(activeTab === "protocols" ? styles.navButtonActive : {}),
              }}
            >
              Salas Interactivas con chats IA
            </button>
          </nav>
        </div>

        <div style={styles.userSection}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              {user?.firstName?.[0] || user?.name?.[0] || "CM"}
            </div>
            <div>
              <p style={styles.userName}>
                {user?.firstName
                  ? `${user.firstName} ${user.lastName || ""}`
                  : user?.name || "Carlos Mendoza"}
              </p>
              <p style={styles.userRole}>Clinical Psychologist</p>
            </div>
          </div>
          <button onClick={onLogout} style={styles.logoutButtonSidebar}>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* 2. CONTENIDO PRINCIPAL */}
      <main style={styles.mainContent}>
        {/* Header superior con buscador y acción rápida */}
        <header style={styles.topbar}>
          <div style={styles.searchWrapper}>
            <input
              type="text"
              placeholder="🔍 Buscar paciente por nombre o protocolo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div>
            <button
              style={styles.primaryBtn}
              onClick={() =>
                alert("Módulo de asignación de nueva sala en desarrollo")
              }
            >
              + Asignar Nueva Sala Emocional
            </button>
          </div>
        </header>

        <div style={styles.scrollArea}>
          {loading && (
            <div style={styles.statusBox}>
              Cargando entorno clínico y métricas de Neon DB...
            </div>
          )}
          {error && (
            <div style={styles.errorBox}>
              Aviso de conexión: {error} (mostrando panel operativo)
            </div>
          )}

          {/* VISTA 2 / PRINCIPAL: GESTIÓN DE CLIENTES */}
          {(activeTab === "clients" || activeTab === "dashboard") && (
            <div style={styles.tableSection}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <h2 style={styles.sectionTitle}>
                    Gestión de Clientes / Pacientes
                  </h2>
                  <p style={styles.sectionDesc}>
                    Supervisión centralizada de protocolos clínicos y alertas de
                    riesgo activo.
                  </p>
                </div>
                <div style={styles.tabFilters}>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      fontWeight: "600",
                    }}
                  >
                    Mostrando {filteredClients.length} pacientes
                  </span>
                </div>
              </div>

              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.trHead}>
                      <th style={styles.th}>Nombre</th>
                      <th style={styles.th}>Protocolo Activo</th>
                      <th style={styles.th}>Última Sesión</th>
                      <th style={styles.th}>Alerta de Riesgo</th>
                      <th style={styles.th}>Reporte IA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => (
                      <tr key={client.id} style={styles.trBody}>
                        <td
                          style={{
                            ...styles.td,
                            fontWeight: "600",
                            color: "#0d9488",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <span style={styles.avatarMini}>👤</span>
                          <span>{client.name}</span>
                        </td>
                        <td style={styles.td}>{client.protocol}</td>
                        <td style={styles.td}>
                          <span style={styles.badgeNeutral}>
                            {client.lastSession}
                          </span>
                        </td>
                        <td style={styles.td}>
                          {client.risk ? (
                            <span style={styles.badgeRisk}>
                              ⚠️ {client.risk}
                            </span>
                          ) : (
                            <span style={{ color: "#94a3b8" }}>—</span>
                          )}
                        </td>
                        <td
                          style={{
                            ...styles.td,
                            color: "#0f766e",
                            fontWeight: "600",
                          }}
                        >
                          {client.aiReport}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "protocols" && (
            <div style={styles.card}>
              <h2>Configuración de Escenarios 3D y Prompts IA</h2>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  marginTop: "10px",
                }}
              >
                Administra los disparadores emocionales y umbrales de
                re-dirección terapéutica para la sesión inmersiva.
              </p>
              <button
                style={{ ...styles.primaryBtn, marginTop: "20px" }}
                onClick={() =>
                  alert("Sincronizando plantillas con aiController...")
                }
              >
                Guardar Parámetros de IA
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  appContainer: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "Inter, system-ui, sans-serif",
    color: "#1e293b",
    overflow: "hidden",
  },
  sidebar: {
    width: "260px",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "24px 16px",
  },
  brandBox: {
    padding: "0 8px",
    marginBottom: "32px",
  },
  brandTag: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#94a3b8",
  },
  brandTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
    marginTop: "2px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  navButton: {
    display: "flex",
    alignItems: "center",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#475569",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s",
  },
  navButtonActive: {
    backgroundColor: "#f0fdf4",
    color: "#0f766e",
    fontWeight: "600",
  },
  userSection: {
    borderTop: "1px solid #e2e8f0",
    paddingTop: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "13px",
  },
  avatarMini: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
  },
  userName: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },
  userRole: {
    fontSize: "11px",
    color: "#64748b",
    margin: 0,
  },
  logoutButtonSidebar: {
    background: "none",
    border: "none",
    color: "#dc2626",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    textAlign: "left",
    padding: "4px 8px",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  topbar: {
    height: "70px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
  },
  searchWrapper: {
    width: "400px",
  },
  searchInput: {
    width: "100%",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#f8fafc",
    fontSize: "14px",
    outline: "none",
  },
  primaryBtn: {
    padding: "10px 18px",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  scrollArea: {
    flex: 1,
    overflowY: "auto",
    padding: "32px",
  },
  sectionHeader: {
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },
  sectionDesc: {
    fontSize: "13px",
    color: "#64748b",
    margin: "4px 0 0 0",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  },
  cardTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
    margin: 0,
  },
  metricValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "8px 0 4px 0",
  },
  metricSub: {
    fontSize: "11px",
    color: "#94a3b8",
  },
  tableSection: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    marginBottom: "30px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  },
  trHead: {
    borderBottom: "1px solid #e2e8f0",
    textAlign: "left",
    backgroundColor: "#f8fafc",
  },
  th: {
    padding: "12px 16px",
    fontWeight: "600",
    color: "#64748b",
    fontSize: "11px",
    textTransform: "uppercase",
  },
  trBody: {
    borderBottom: "1px solid #f1f5f9",
  },
  td: {
    padding: "14px 16px",
    color: "#334155",
  },
  badgeNeutral: {
    fontSize: "11px",
    padding: "4px 10px",
    borderRadius: "20px",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    fontWeight: "500",
  },
  badgeRisk: {
    fontSize: "11px",
    padding: "4px 10px",
    borderRadius: "20px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    fontWeight: "600",
    border: "1px solid #fecaca",
  },
  statusBox: {
    textAlign: "center",
    padding: "20px",
    color: "#64748b",
    fontSize: "14px",
    marginBottom: "20px",
  },
  errorBox: {
    padding: "12px 16px",
    backgroundColor: "#fffbeb",
    color: "#b45309",
    border: "1px solid #fde68a",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "20px",
  },
};
