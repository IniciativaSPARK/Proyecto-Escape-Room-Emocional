-- =====================================================================
-- SPARK - Escape Room Psicológico
-- Esquema PostgreSQL - MVP
-- =====================================================================
-- Versión: 1.0
-- Engine: PostgreSQL 14+
-- Convención: snake_case, UUIDs como PK (excepto roles), TIMESTAMPTZ siempre
-- =====================================================================

-- ---------------------------------------------------------------------
-- EXTENSIONES NECESARIAS
-- ---------------------------------------------------------------------
-- pgcrypto: para gen_random_uuid() (incluida en PostgreSQL, solo activar)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- =====================================================================
-- 1. ORGANIZATIONS
-- Clínicas y psicólogos independientes (independientes = su propia org)
-- =====================================================================
CREATE TABLE organizations (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(150)    NOT NULL,
    type            VARCHAR(20)     NOT NULL,
    tax_id          VARCHAR(50),
    email           VARCHAR(150),
    phone           VARCHAR(30),
    address         TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,

    CONSTRAINT chk_organizations_type
        CHECK (type IN ('clinic', 'independent'))
);

CREATE INDEX idx_organizations_type
    ON organizations(type)
    WHERE deleted_at IS NULL;
-- Justificación: filtrar por tipo (clínica/independiente) en reportes y admin.


-- =====================================================================
-- 2. ROLES
-- Catálogo de roles (lookup table). SMALLINT autoincrement justificado:
-- es lookup pequeña, nunca expuesta en URLs, mejor rendimiento en joins.
-- =====================================================================
CREATE TABLE roles (
    id              SMALLSERIAL     PRIMARY KEY,
    code            VARCHAR(30)     NOT NULL UNIQUE,
    name            VARCHAR(50)     NOT NULL,
    description     TEXT
);

-- Seed inicial
INSERT INTO roles (code, name, description) VALUES
    ('psychologist', 'Psicólogo',  'Profesional de salud mental que crea plantillas y revisa conversaciones.'),
    ('patient',      'Paciente',   'Usuario final que completa las conversaciones.'),
    ('admin',        'Administrador', 'Administrador de la plataforma.');


-- =====================================================================
-- 3. USERS
-- Datos base de cualquier usuario (psicólogo, paciente o admin).
-- =====================================================================
CREATE TABLE users (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id             SMALLINT        NOT NULL,
    organization_id     UUID,
    first_name          VARCHAR(100)    NOT NULL,
    last_name           VARCHAR(100)    NOT NULL,
    email               VARCHAR(150)    NOT NULL,
    email_verified_at   TIMESTAMPTZ,
    phone               VARCHAR(30),
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,

    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id) REFERENCES roles(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_users_organization
        FOREIGN KEY (organization_id) REFERENCES organizations(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_users_email_format
        CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Email único pero solo entre usuarios NO eliminados (permite re-registro)
CREATE UNIQUE INDEX idx_users_email_unique_active
    ON users(LOWER(email))
    WHERE deleted_at IS NULL;
-- Justificación: emails se almacenan case-insensitive y permite que un email
-- borrado pueda re-registrarse sin chocar con el soft-deleted.

CREATE INDEX idx_users_role
    ON users(role_id)
    WHERE deleted_at IS NULL;
-- Justificación: queries de tipo "listar todos los psicólogos/pacientes".

CREATE INDEX idx_users_organization
    ON users(organization_id)
    WHERE deleted_at IS NULL AND organization_id IS NOT NULL;
-- Justificación: dashboard de clínica lista psicólogos por org.


-- =====================================================================
-- 4. CREDENTIALS
-- Hash de contraseña separado de datos personales.
-- Razones: privacidad (analytics sobre users sin exponer hashes),
-- y flexibilidad para soportar OAuth/SSO en el futuro sin tocar users.
-- =====================================================================
CREATE TABLE credentials (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID            NOT NULL UNIQUE,
    password_hash           VARCHAR(255)    NOT NULL,
    password_changed_at     TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    failed_login_attempts   INT             NOT NULL DEFAULT 0,
    locked_until            TIMESTAMPTZ,
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_credentials_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_credentials_failed_attempts
        CHECK (failed_login_attempts >= 0)
);
-- No se necesita índice extra: user_id es UNIQUE (ya indexado) y la tabla
-- siempre se consulta por user_id.


-- =====================================================================
-- 5. PSYCHOLOGIST_PROFILES
-- Datos específicos de psicólogos. Tabla separada para no contaminar users.
-- =====================================================================
CREATE TABLE psychologist_profiles (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID            NOT NULL UNIQUE,
    license_number          VARCHAR(50),
    specialty               VARCHAR(100),
    bio                     TEXT,
    years_of_experience     SMALLINT,
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_psych_profiles_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_psych_profiles_experience
        CHECK (years_of_experience IS NULL OR years_of_experience >= 0)
);


-- =====================================================================
-- 6. PATIENT_PROFILES
-- Datos específicos de pacientes.
-- =====================================================================
CREATE TABLE patient_profiles (
    id                          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                     UUID            NOT NULL UNIQUE,
    date_of_birth               DATE,
    gender                      VARCHAR(30),
    emergency_contact_name      VARCHAR(100),
    emergency_contact_phone     VARCHAR(30),
    internal_notes              TEXT,
    created_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_patient_profiles_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_patient_profiles_dob
        CHECK (date_of_birth IS NULL OR date_of_birth <= CURRENT_DATE)
);


-- =====================================================================
-- 7. PSYCHOLOGIST_PATIENTS
-- Relación M:N: un paciente puede tener varios psicólogos y viceversa.
-- =====================================================================
CREATE TABLE psychologist_patients (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    psychologist_id     UUID            NOT NULL,
    patient_id          UUID            NOT NULL,
    status              VARCHAR(20)     NOT NULL DEFAULT 'active',
    started_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    ended_at            TIMESTAMPTZ,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_psych_patients_psychologist
        FOREIGN KEY (psychologist_id) REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_psych_patients_patient
        FOREIGN KEY (patient_id) REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_psych_patients_pair
        UNIQUE (psychologist_id, patient_id),

    CONSTRAINT chk_psych_patients_status
        CHECK (status IN ('active', 'inactive', 'archived')),

    CONSTRAINT chk_psych_patients_different_users
        CHECK (psychologist_id <> patient_id),

    CONSTRAINT chk_psych_patients_dates
        CHECK (ended_at IS NULL OR ended_at >= started_at)
);

CREATE INDEX idx_psych_patients_psychologist
    ON psychologist_patients(psychologist_id)
    WHERE status = 'active';
-- Justificación: dashboard psicólogo lista pacientes activos frecuentemente.

CREATE INDEX idx_psych_patients_patient
    ON psychologist_patients(patient_id)
    WHERE status = 'active';
-- Justificación: paciente ve sus psicólogos activos.


-- =====================================================================
-- 8. CHAT_TEMPLATES
-- Contenedor mutable de plantilla. Apunta a la versión activa.
-- IMPORTANTE: current_version_id es nullable y se actualiza tras crear
-- la primera versión (resuelve la dependencia circular con versions).
-- =====================================================================
CREATE TABLE chat_templates (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    psychologist_id         UUID            NOT NULL,
    title                   VARCHAR(150)    NOT NULL,
    description             TEXT,
    visibility              VARCHAR(20)     NOT NULL DEFAULT 'private',
    current_version_id      UUID,
    is_active               BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at              TIMESTAMPTZ,

    CONSTRAINT fk_chat_templates_psychologist
        FOREIGN KEY (psychologist_id) REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_chat_templates_visibility
        CHECK (visibility IN ('private', 'organization', 'public'))
);

CREATE INDEX idx_chat_templates_psychologist
    ON chat_templates(psychologist_id)
    WHERE deleted_at IS NULL;
-- Justificación: psicólogo ve sus propias plantillas constantemente.

CREATE INDEX idx_chat_templates_visibility
    ON chat_templates(visibility)
    WHERE deleted_at IS NULL AND visibility <> 'private';
-- Justificación: futuro marketplace listará plantillas org/public.


-- =====================================================================
-- 9. CHAT_TEMPLATE_VERSIONS
-- Versión INMUTABLE de plantilla. Cada edición crea una nueva versión.
-- Las conversations apuntan a versions (NUNCA al template directo) para
-- garantizar reproducibilidad clínica.
-- =====================================================================
CREATE TABLE chat_template_versions (
    id                          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id                 UUID            NOT NULL,
    version_number              INT             NOT NULL,
    focus_area                  VARCHAR(100),
    therapeutic_approach        VARCHAR(50),
    tone                        VARCHAR(50),
    opening_message             TEXT            NOT NULL,
    closing_message             TEXT            NOT NULL,
    custom_instructions         TEXT,
    safety_protocol             JSONB,
    max_turns                   SMALLINT        NOT NULL,
    min_turns                   SMALLINT        NOT NULL DEFAULT 3,
    compiled_system_prompt      TEXT            NOT NULL,
    created_by                  UUID            NOT NULL,
    created_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_template_versions_template
        FOREIGN KEY (template_id) REFERENCES chat_templates(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_template_versions_creator
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_template_versions_number
        UNIQUE (template_id, version_number),

    CONSTRAINT chk_template_versions_turns
        CHECK (max_turns >= min_turns AND min_turns >= 1 AND max_turns <= 50),

    CONSTRAINT chk_template_versions_version_number
        CHECK (version_number >= 1)
);

CREATE INDEX idx_template_versions_template
    ON chat_template_versions(template_id);
-- Justificación: listar todas las versiones de una plantilla (historial).

-- Ahora sí, la FK desde chat_templates.current_version_id
ALTER TABLE chat_templates
    ADD CONSTRAINT fk_chat_templates_current_version
    FOREIGN KEY (current_version_id) REFERENCES chat_template_versions(id)
    ON DELETE SET NULL;


-- =====================================================================
-- 10. CONVERSATIONS
-- Instancia ejecutada de una plantilla. Auditable (timestamps + turnos).
-- =====================================================================
CREATE TABLE conversations (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    template_version_id     UUID            NOT NULL,
    psychologist_id         UUID            NOT NULL,
    patient_id              UUID            NOT NULL,
    share_token             VARCHAR(64)     NOT NULL UNIQUE,
    status                  VARCHAR(20)     NOT NULL DEFAULT 'pending',
    max_turns               SMALLINT        NOT NULL,
    current_turn            SMALLINT        NOT NULL DEFAULT 0,
    patient_context         JSONB,
    analysis_status         VARCHAR(20)     NOT NULL DEFAULT 'not_started',
    started_at              TIMESTAMPTZ,
    completed_at            TIMESTAMPTZ,
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_conversations_template_version
        FOREIGN KEY (template_version_id) REFERENCES chat_template_versions(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_conversations_psychologist
        FOREIGN KEY (psychologist_id) REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_conversations_patient
        FOREIGN KEY (patient_id) REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_conversations_status
        CHECK (status IN ('pending', 'in_progress', 'completed', 'abandoned', 'expired')),

    CONSTRAINT chk_conversations_analysis_status
        CHECK (analysis_status IN ('not_started', 'pending', 'processing', 'completed', 'failed')),

    CONSTRAINT chk_conversations_turns
        CHECK (current_turn >= 0 AND current_turn <= max_turns),

    CONSTRAINT chk_conversations_completed_dates
        CHECK (completed_at IS NULL OR (started_at IS NOT NULL AND completed_at >= started_at)),

    CONSTRAINT chk_conversations_users_different
        CHECK (psychologist_id <> patient_id)
);

CREATE INDEX idx_conversations_psychologist_status
    ON conversations(psychologist_id, status);
-- Justificación: dashboard psicólogo filtra por estado (completadas, en curso).

CREATE INDEX idx_conversations_patient
    ON conversations(patient_id, created_at DESC);
-- Justificación: análisis de tendencias (mismo paciente en el tiempo).

CREATE INDEX idx_conversations_template_version
    ON conversations(template_version_id);
-- Justificación: stats por plantilla (cuántas conversaciones, etc.).

CREATE INDEX idx_conversations_analysis_pending
    ON conversations(analysis_status, completed_at)
    WHERE analysis_status IN ('pending', 'processing', 'failed');
-- Justificación: worker que procesa análisis pendientes (queue pattern).


-- =====================================================================
-- 11. MESSAGES
-- Cada mensaje individual del chat (granularidad para auditoría).
-- =====================================================================
CREATE TABLE messages (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id     UUID            NOT NULL,
    turn_number         SMALLINT        NOT NULL,
    sender_role         VARCHAR(20)     NOT NULL,
    content             TEXT            NOT NULL,
    tokens_input        INT,
    tokens_output       INT,
    model_used          VARCHAR(50),
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_messages_conversation
        FOREIGN KEY (conversation_id) REFERENCES conversations(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_messages_sender_role
        CHECK (sender_role IN ('user', 'assistant', 'system')),

    CONSTRAINT chk_messages_turn_number
        CHECK (turn_number >= 0),

    CONSTRAINT chk_messages_tokens
        CHECK (
            (tokens_input IS NULL OR tokens_input >= 0) AND
            (tokens_output IS NULL OR tokens_output >= 0)
        )
);

CREATE INDEX idx_messages_conversation_turn
    ON messages(conversation_id, turn_number, created_at);
-- Justificación: cargar transcripción ordenada de una conversación
-- (query más frecuente: "dame todos los mensajes de la conversación X").


-- =====================================================================
-- 12. CONVERSATION_ANALYSES
-- Análisis IA post-conversación (1:1 con conversation).
-- Separada porque se genera asincrónicamente.
-- =====================================================================
CREATE TABLE conversation_analyses (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id     UUID            NOT NULL UNIQUE,
    summary             TEXT            NOT NULL,
    sentiment_score     NUMERIC(3,2),
    sentiment_label     VARCHAR(20),
    topics              JSONB,
    risk_flags          JSONB,
    key_insights        JSONB,
    recommendations     TEXT,
    raw_response        JSONB,
    model_used          VARCHAR(50),
    generated_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_conv_analyses_conversation
        FOREIGN KEY (conversation_id) REFERENCES conversations(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_conv_analyses_sentiment_score
        CHECK (sentiment_score IS NULL OR (sentiment_score >= -1.00 AND sentiment_score <= 1.00)),

    CONSTRAINT chk_conv_analyses_sentiment_label
        CHECK (sentiment_label IS NULL OR sentiment_label IN
            ('very_negative', 'negative', 'neutral', 'positive', 'very_positive'))
);

-- Índice GIN para queries futuras sobre risk_flags
CREATE INDEX idx_conv_analyses_risk_flags
    ON conversation_analyses USING GIN (risk_flags);
-- Justificación: alertas tipo "todas las conversaciones con suicidal_ideation = high"
-- requieren búsqueda dentro de JSONB. GIN es el índice adecuado para JSONB.

CREATE INDEX idx_conv_analyses_sentiment
    ON conversation_analyses(sentiment_score);
-- Justificación: análisis de tendencias (sentiment promedio en el tiempo).


-- =====================================================================
-- 13. AI_REQUEST_LOGS
-- Auditoría de llamadas a Claude API + reintentos.
-- =====================================================================
CREATE TABLE ai_request_logs (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id     UUID,
    request_type        VARCHAR(30)     NOT NULL,
    status              VARCHAR(20)     NOT NULL,
    error_message       TEXT,
    retry_count         SMALLINT        NOT NULL DEFAULT 0,
    latency_ms          INT,
    tokens_input        INT,
    tokens_output       INT,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_ai_logs_conversation
        FOREIGN KEY (conversation_id) REFERENCES conversations(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_ai_logs_request_type
        CHECK (request_type IN ('message', 'analysis')),

    CONSTRAINT chk_ai_logs_status
        CHECK (status IN ('success', 'failed', 'retrying')),

    CONSTRAINT chk_ai_logs_retry_count
        CHECK (retry_count >= 0)
);

CREATE INDEX idx_ai_logs_conversation
    ON ai_request_logs(conversation_id, created_at DESC);
-- Justificación: debug de una conversación específica (todos sus intentos).

CREATE INDEX idx_ai_logs_failed
    ON ai_request_logs(status, created_at DESC)
    WHERE status = 'failed';
-- Justificación: monitoreo de errores recientes en el dashboard de admin.


-- =====================================================================
-- 14. SESSIONS
-- Refresh tokens JWT (revocables).
-- Access tokens permanecen stateless, solo refresh se persiste.
-- =====================================================================
CREATE TABLE sessions (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID            NOT NULL,
    refresh_token_hash      VARCHAR(255)    NOT NULL UNIQUE,
    user_agent              VARCHAR(255),
    ip_address              VARCHAR(45),
    expires_at              TIMESTAMPTZ     NOT NULL,
    revoked_at              TIMESTAMPTZ,
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    last_used_at            TIMESTAMPTZ,

    CONSTRAINT fk_sessions_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_sessions_expires_after_creation
        CHECK (expires_at > created_at)
);

CREATE INDEX idx_sessions_user_active
    ON sessions(user_id, expires_at)
    WHERE revoked_at IS NULL;
-- Justificación: validar sesiones activas de un usuario en cada login/refresh.

CREATE INDEX idx_sessions_expires
    ON sessions(expires_at)
    WHERE revoked_at IS NULL;
-- Justificación: limpieza programada de sesiones expiradas (cron job).


-- =====================================================================
-- TRIGGERS PARA updated_at AUTOMÁTICO
-- =====================================================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a todas las tablas con updated_at
CREATE TRIGGER set_updated_at_organizations
    BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_users
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_credentials
    BEFORE UPDATE ON credentials
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_psychologist_profiles
    BEFORE UPDATE ON psychologist_profiles
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_patient_profiles
    BEFORE UPDATE ON patient_profiles
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_chat_templates
    BEFORE UPDATE ON chat_templates
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_conversations
    BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- =====================================================================
-- COMENTARIOS DE TABLAS (documentación viva en la DB)
-- =====================================================================
COMMENT ON TABLE organizations             IS 'Clínicas y psicólogos independientes (cada independiente = su propia org).';
COMMENT ON TABLE roles                     IS 'Catálogo de roles del sistema (psychologist, patient, admin).';
COMMENT ON TABLE users                     IS 'Datos base de cualquier usuario del sistema.';
COMMENT ON TABLE credentials               IS 'Hashes de contraseña separados de datos personales (privacidad).';
COMMENT ON TABLE psychologist_profiles     IS 'Datos específicos de psicólogos (licencia, especialidad, etc.).';
COMMENT ON TABLE patient_profiles          IS 'Datos específicos de pacientes (DOB, contacto de emergencia, etc.).';
COMMENT ON TABLE psychologist_patients     IS 'Relación M:N psicólogo-paciente.';
COMMENT ON TABLE chat_templates            IS 'Contenedor mutable de plantilla. Apunta a la versión activa.';
COMMENT ON TABLE chat_template_versions    IS 'Versión inmutable de plantilla. Las conversations apuntan aquí.';
COMMENT ON TABLE conversations             IS 'Instancia ejecutada de una plantilla por un paciente.';
COMMENT ON TABLE messages                  IS 'Mensajes individuales del chat (granularidad por turno).';
COMMENT ON TABLE conversation_analyses     IS 'Análisis IA generado al cerrar conversación (1:1).';
COMMENT ON TABLE ai_request_logs           IS 'Auditoría de llamadas a Claude API y reintentos.';
COMMENT ON TABLE sessions                  IS 'Refresh tokens JWT (access tokens permanecen stateless).';

-- =====================================================================
-- FIN DEL ESQUEMA
-- =====================================================================