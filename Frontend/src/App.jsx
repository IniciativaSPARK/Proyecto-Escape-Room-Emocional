import './App.css'
import Logo_spark from './assets/spark-logo.png'

function App() {
  return (
    <div className="spark-app">
      <main className="spark-container">
        <header className="spark-brand">
          <div className="spark-logo">
            <img src={Logo_spark} alt="Logo Spark" width={44} height={44} />
          </div>
          <span className="spark-wordmark">SPARK</span>
        </header>

        <section className="spark-hero">
          <span className="spark-eyebrow">Proyecto en construcción</span>
          <h1 className="spark-title">
            Bienvenido al <span className="spark-title-accent">Escape Room Psicológico</span>
          </h1>
          <p className="spark-subtitle">
            Conversaciones guiadas con IA para entrevistas psicológicas estructuradas.
          </p>
        </section>

        <section className="spark-cards">
          <article className="spark-card">
            <span className="spark-card-dot spark-card-dot--coral" />
            <h3>Frontend</h3>
            <p>React · Vercel</p>
          </article>
          <article className="spark-card">
            <span className="spark-card-dot spark-card-dot--navy" />
            <h3>Backend</h3>
            <p>Express · Railway</p>
          </article>
          <article className="spark-card">
            <span className="spark-card-dot spark-card-dot--yellow" />
            <h3>Datos e infra</h3>
            <p>PostgreSQL · DevOps</p>
          </article>
        </section>

        <aside className="spark-reminder">
          <div className="spark-reminder-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
                fill="#FFD166"
                stroke="#26547C"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="spark-reminder-body">
            <h4>Antes de empezar</h4>
            <p>
              Crea tu propia rama en el repo y confirma en el grupo de WhatsApp para que te delegue funciones.
              Mientras tanto, explora las librerías de frontend y backend del stack — te va a servir para elegir en qué área quieres enfocarte.
            </p>
          </div>
        </aside>

        <footer className="spark-footer">
          <span className="spark-pulse" />
          <span>Listo para empezar a construir</span>
        </footer>
      </main>
    </div>
  )
}

export default App