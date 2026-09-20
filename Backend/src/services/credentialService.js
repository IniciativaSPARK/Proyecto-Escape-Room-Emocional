import bcrypt from 'bcrypt';
import pool from '../lib/db.js';


export const getCredentialByUserId = async (userId) =>{

    const query = 
    `SELECT 
    username,
    password_hash,
    user_id,
    failed_login_attempts,
    locked_until
    FROM credentials
    where user_id =$1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];

};

export const createCredential = async (userId,username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO credentials (user_id,username, password_hash) VALUES ($1, $2, $3) RETURNING *`;
    const result = await pool.query(query, [userId,username, hashedPassword]);
    return result.rows[0];
};

export const updatePassword = async (userId, newPassword) => {
const hashedPassword = await bcrypt.hash(newPassword, 10);
const query = `UPDATE credentials SET
 password_hash =$1, 
 password_changed_at = NOW()
 WHERE user_id = $2 RETURNING *`;
const result = await pool.query(query,[hashedPassword, userId]);

return result.rows[0];
};

export const incrementFailedAttemps = async (userId) =>{
    const query = `UPDATE credentials SET
    failed_login_attempts = failed_login_attempts +1
    WHERE user_id =$1 RETURNING *`;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
};



