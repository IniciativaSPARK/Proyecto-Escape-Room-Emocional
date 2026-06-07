import pool from '../lib/db.js';

// funciones para interactuar con la base de datos relacionados con el usuaario
export const getUsuarios = async () => {
  const result = await pool.query('SELECT * FROM usuarios ORDER BY id');
  return result.rows;
};
// para obtener usuario por id
export const getUsuarioById = async (id) => {
  const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
  return result.rows[0] || null;
};
// para crear un usuario nuevo
export const createUsuario = async ({ nombre, email }) => {
  const result = await pool.query(
    'INSERT INTO usuarios (nombre, email) VALUES ($1, $2) RETURNING *',
    [nombre, email]
  );
  return result.rows[0];
};
// para actualizar el usuario existente
export const updateUsuario = async (id, { nombre, email }) => {
  const result = await pool.query(
    'UPDATE usuarios SET nombre = $1, email = $2 WHERE id = $3 RETURNING *',
    [nombre, email, id]
  );
  return result.rows[0] || null;
};
// para eliminar un usuario por id
export const deleteUsuario = async (id) => {
  const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
  return result.rows[0] || null;
};
