import pool from '../lib/db.js';

export const getUsuarioByEmail = async (email) => {
  const result = await pool.query( 
    'SELECT id, role_id, organization_id, first_name, last_name, email, password, is_active FROM users WHERE email = $1 AND deleted_at IS NULL',
    [email]
  );
  return result.rows[0] || null;
};
