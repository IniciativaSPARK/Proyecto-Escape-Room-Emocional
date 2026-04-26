import { useState, useEffect } from 'react'
import './styles/animations.css'
import './styles/splash.css'
import './styles/home.css'

import Logo_spark from './assets/spark-logo.png'

function App() {
  const [etapa, setEtapa] = useState('splash');

  useEffect(() => {
    const timer = setTimeout(() => {
      setEtapa('home');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // 🔹 SPLASH
  if (etapa === 'splash') {
    return (
      <div className="splash-screen">
        <div className="splash-content">
          <img
            src={Logo_spark}
            className="splash-logo-anim"
            alt="Logo Spark"
          />
          <h2 className="splash-text">
            desde <span className="spark-accent">SPARK</span>
          </h2>
        </div>
      </div>
    );
  }

  // 🔹 HOME
  return (
    <div className="spark-app">
      <nav className="spark-brand">
        <img src={Logo_spark} width={30} alt="logo" />
        <span className="spark-wordmark">SPARK | Clinical IA</span>
      </nav>

      <main className="spark-container">
        <header className="spark-hero">
          <span className="spark-eyebrow">Plataforma clínica</span>

          <h1 className="spark-title">
            Plataforma de{' '}
            <span className="spark-title-accent">
              Asistencia Psicológica
            </span>
          </h1>

          <p className="spark-subtitle">
            Herramientas de IA diseñadas para la práctica clínica ética y eficiente.
          </p>

          <div className="botones-accion">
            <button className="btn-primario">
              Nueva Conversación
            </button>
            <button className="btn-secundario">
              Ver Análisis de Pacientes
            </button>
          </div>
        </header>
      </main>
    </div>
  );
}

export default App;