import pool from '../lib/db.js';
import bcrypt from 'bcrypt';

// maneja operaciones relacionadas con el usuario 
export const getUsuarios = async () => {
  const result = await pool.query(
    'SELECT id, role_id, organization_id, first_name, last_name, email, email_verified_at, phone, is_active, created_at, updated_at FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC'
  );
  return result.rows;
};

export const getUsuarioById = async (id) => {
  const result = await pool.query(
    'SELECT id, role_id, organization_id, first_name, last_name, email, email_verified_at, phone, is_active, created_at, updated_at FROM users WHERE id = $1 AND deleted_at IS NULL',
    [id]
  );
  return result.rows[0] || null;
};

export const createUsuario = async ({ first_name, last_name, email, role_id, organization_id, phone = null, password }) => {
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null; 

  const result = await pool.query(
    'INSERT INTO users (first_name, last_name, email, role_id, organization_id, phone, password, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW()) RETURNING id, role_id, organization_id, first_name, last_name, email, email_verified_at, phone, is_active, created_at, updated_at',
    [first_name, last_name, email, role_id, organization_id, phone, hashedPassword]
  );
  return result.rows[0];
};

export const updateUsuario = async (id, { first_name, last_name, email, phone, is_active }) => {
  const result = await pool.query(
    'UPDATE users SET first_name = $1, last_name = $2, email = $3, phone = $4, is_active = $5, updated_at = NOW() WHERE id = $6 AND deleted_at IS NULL RETURNING id, role_id, organization_id, first_name, last_name, email, email_verified_at, phone, is_active, created_at, updated_at',
    [first_name, last_name, email, phone, is_active, id]
  );
  return result.rows[0] || null;
};

export const deleteUsuario = async (id) => {
  const result = await pool.query(
    'UPDATE users SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id, role_id, organization_id, first_name, last_name, email, email_verified_at, phone, is_active, created_at, updated_at',
    [id]
  );
  return result.rows[0] || null;
};
