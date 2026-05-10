import pool from '../lib/db.js';

export const getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM credenciales');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM credenciales WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Credencial no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getByUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const usuario = await pool.query('SELECT id FROM usuarios WHERE id = $1', [usuarioId]);
    if (usuario.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const result = await pool.query('SELECT * FROM credenciales WHERE usuario_id = $1', [usuarioId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const { usuarioId, servicio, username, password } = req.body;
    if (!usuarioId || !servicio || !username || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos: usuarioId, servicio, username, password' });
    }
    const usuario = await pool.query('SELECT id FROM usuarios WHERE id = $1', [usuarioId]);
    if (usuario.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const result = await pool.query(
      'INSERT INTO credenciales (usuario_id, servicio, username, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [usuarioId, servicio, username, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuarioId, servicio, username, password } = req.body;
    const existe = await pool.query('SELECT id FROM credenciales WHERE id = $1', [id]);
    if (existe.rows.length === 0) {
      return res.status(404).json({ error: 'Credencial no encontrada' });
    }
    if (usuarioId) {
      const usuario = await pool.query('SELECT id FROM usuarios WHERE id = $1', [usuarioId]);
      if (usuario.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
    }
    const result = await pool.query(
      `UPDATE credenciales 
       SET usuario_id = COALESCE($1, usuario_id),
           servicio   = COALESCE($2, servicio),
           username   = COALESCE($3, username),
           password   = COALESCE($4, password)
       WHERE id = $5
       RETURNING *`,
      [usuarioId || null, servicio || null, username || null, password || null, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM credenciales WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Credencial no encontrada' });
    }
    res.json({ mensaje: 'Credencial eliminada', credencial: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};