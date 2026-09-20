import bcrypt from "bcrypt";
import pool from "../lib/db.js";
import {
  getCredentialByUserId,
  createCredential,
} from "../services/credentialService.js";

export const create = async (req, res) => {
  try {
    const { userId } = req.params;
    // llamar el usuario
    const { username, password } = req.body;
    const newCredential = await createCredential(userId, username, password);
    res.status(201).json(newCredential);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error" });
  }
};

export const getCredential = async (req, res) => {
  try {
    const { userId } = req.params;
    const credential = await getCredentialByUserId(userId);
    if (!credential) {
      return res.status(404).json({ error: "credential not found" });
    }
    res.status(200).json(credential);
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, username, password } = req.body;
    const userIdentifier = identifier || username;

    if (!userIdentifier || !password) {
      return res.status(400).json({ error: "Se requiere username y password" });
    }

    const query = `
            SELECT 
                c.id AS credential_id,
                c.username,
                c.password_hash,
                u.id AS user_id,
                u.first_name AS "firstName",
                u.last_name AS "lastName",
                u.email,
                u.role
            FROM credentials c
            INNER JOIN users u ON c.user_id = u.id
            WHERE c.username = $1
        `;

    const result = await pool.query(query, [userIdentifier]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const userCredential = result.rows[0];

    const isPasswordValid = await bcrypt.compare(
      password,
      userCredential.password_hash,
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    res.status(200).json({
      message: "Login exitoso",
      user: {
        id: userCredential.user_id,
        firstName: userCredential.firstName,
        lastName: userCredential.lastName,
        email: userCredential.email,
        role: userCredential.role,
      },
    });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params; // Cambiamos userId por id
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: "Se requiere la nueva contraseña" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Buscamos directamente por el id de la tabla credentials
    const query = `
            UPDATE credentials 
            SET password_hash = $1 
            WHERE id = $2
            RETURNING id, user_id
        `;

    const result = await pool.query(query, [hashedPassword, id]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Credencial o usuario no encontrado" });
    }

    res.status(200).json({
      message: "Contraseña actualizada exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
