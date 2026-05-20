import bcrypt from 'bcrypt';
import pool from '../lib/db.js';

// ======================================================
// GET ALL CREDENTIALS
// ======================================================

export const getAll = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.user_id,
        u.first_name,
        u.last_name,
        u.email,
        c.failed_login_attempts,
        c.locked_until,
        c.created_at
      FROM credentials c
      INNER JOIN users u
        ON c.user_id = u.id
      ORDER BY c.created_at DESC
    `);

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

// ======================================================
// GET CREDENTIAL BY ID
// ======================================================

export const getById = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        c.id,
        c.user_id,
        u.first_name,
        u.last_name,
        u.email,
        c.failed_login_attempts,
        c.locked_until,
        c.created_at
      FROM credentials c
      INNER JOIN users u
        ON c.user_id = u.id
      WHERE c.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Credential not found'
      });
    }

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

// ======================================================
// GET CREDENTIAL BY USER
// ======================================================

export const getByUser = async (req, res) => {
  try {

    const { userId } = req.params;

    const user = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const result = await pool.query(`
      SELECT 
        id,
        user_id,
        failed_login_attempts,
        locked_until,
        created_at
      FROM credentials
      WHERE user_id = $1
    `, [userId]);

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

// ======================================================
// CREATE CREDENTIAL
// ======================================================

export const create = async (req, res) => {
  try {

    const {
      userId,
      password
    } = req.body;

    if (!userId || !password) {
      return res.status(400).json({
        error: 'Required fields: userId, password'
      });
    }

    // Verify user exists
    const user = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Check if credentials already exist
    const existingCredential = await pool.query(
      'SELECT id FROM credentials WHERE user_id = $1',
      [userId]
    );

    if (existingCredential.rows.length > 0) {
      return res.status(409).json({
        error: 'Credentials already exist for this user'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert credential
    const result = await pool.query(`
      INSERT INTO credentials
      (
        user_id,
        password_hash
      )
      VALUES
      (
        $1,
        $2
      )
      RETURNING
        id,
        user_id,
        created_at
    `, [userId, passwordHash]);

    res.status(201).json(result.rows[0]);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

// ======================================================
// UPDATE CREDENTIAL
// ======================================================

export const update = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      password,
      failed_login_attempts,
      locked_until
    } = req.body;

    const credential = await pool.query(
      'SELECT id FROM credentials WHERE id = $1',
      [id]
    );

    if (credential.rows.length === 0) {
      return res.status(404).json({
        error: 'Credential not found'
      });
    }

    let passwordHash = null;

    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const result = await pool.query(`
      UPDATE credentials
      SET
        password_hash = COALESCE($1, password_hash),
        failed_login_attempts = COALESCE($2, failed_login_attempts),
        locked_until = COALESCE($3, locked_until),
        updated_at = NOW()
      WHERE id = $4
      RETURNING
        id,
        user_id,
        failed_login_attempts,
        locked_until,
        updated_at
    `, [
      passwordHash,
      failed_login_attempts ?? null,
      locked_until ?? null,
      id
    ]);

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

// ======================================================
// DELETE CREDENTIAL
// ======================================================

export const remove = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(`
      DELETE FROM credentials
      WHERE id = $1
      RETURNING id, user_id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Credential not found'
      });
    }

    res.json({
      message: 'Credential deleted successfully',
      credential: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};