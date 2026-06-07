-- Schema SQL for Proyecto Escape Room Psicológico
-- Basado en el modelo PostgreSQL que compartiste

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(150) NOT NULL,
  type varchar(20) NOT NULL,
  tax_id varchar(50),
  email varchar(150),
  phone varchar(30),
  address text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE roles (
  id smallint PRIMARY KEY,
  name varchar(100) NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id smallint NOT NULL,
  organization_id uuid,
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  email varchar(150) NOT NULL,
  email_verified_at timestamptz,
  phone varchar(30),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT fk_users_roles FOREIGN KEY (role_id) REFERENCES roles (id),
  CONSTRAINT fk_users_organizations FOREIGN KEY (organization_id) REFERENCES organizations (id)
);

CREATE UNIQUE INDEX users_email_key ON users (email);
