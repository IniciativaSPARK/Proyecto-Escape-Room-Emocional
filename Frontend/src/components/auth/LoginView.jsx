import React, { useState } from 'react';

export default function LoginView({ onLoginSuccess }) {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Credenciales inválidas');
            }

            // data.user trae { id, role: 'patient' | 'psychologist', name }
            onLoginSuccess(data.user);
            
        } catch (err) {
            setError(err.message || 'Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2>Escape Room Emocional</h2>
                    <p style={styles.subtitle}>Acceso Clínico</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label>Nombre de Usuario</label>
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
                        <label>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={styles.input}
                        />
                    </div>

                    {error && <div style={styles.errorBox}>{error}</div>}

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? 'Validando con el servidor...' : 'Ingresar al Panel'}
                    </button>
                </form>
            </div>
        </div>
    );
}

// Estilos limpios y profesionales simulando minimalismo clínico
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc',
        fontFamily: 'Inter, system-ui, sans-serif',
    },
    card: {
        width: '100%',
        maxWidth: '420px',
        padding: '40px',
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0',
    },
    header: {
        marginBottom: '24px',
        textAlign: 'center',
    },
    subtitle: {
        color: '#64748b',
        fontSize: '14px',
        marginTop: '4px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        fontSize: '13px',
        color: '#334155',
        fontWeight: '500',
    },
    input: {
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    button: {
        marginTop: '10px',
        padding: '12px',
        backgroundColor: '#0f172a',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    errorBox: {
        padding: '10px',
        backgroundColor: '#ffeeec',
        color: '#991b1b',
        fontSize: '13px',
        borderRadius: '6px',
        textAlign: 'center',
    }
};