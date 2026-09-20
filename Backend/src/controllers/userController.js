import { 
    getUserById, 
    deleteUserById, 
    updateUser, 
    createUser 
} from '../services/userService.js';
import pool from '../lib/db.js'; // O puedes mover estas consultas extra a userService si prefieres

// Crear usuario
export const create = async (req, res) => {
    try {
        const { first_name, last_name, email } = req.body;
        const newUser = await createUser(first_name, last_name, email);
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'internal server error' });
    }
};

// Obtener todos los usuarios (o filtrar por rol)
export const getUsers = async (req, res) => {
    const { role } = req.query; 
    try {
        let query = 'SELECT id, first_name AS "firstName", last_name AS "lastName", email, role FROM users';
        let params = [];

        if (role) {
            query += ' WHERE role = $1';
            params.push(role);
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ error: 'Database error' });
    }
};

// Obtener un usuario por ID
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getUserById(id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        res.status(500).json({ error: 'Database error' });
    }
};

// Eliminar usuario
export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);
        
        if (!deletedUser) {
            return res.status(404).json({ error: 'user not found' });
        }
        res.status(200).json({ message: 'user deleted successfully', user: deletedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'internal error server' });
    }
};

// Actualizar datos del usuario
export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email } = req.body;
        const updatedUser = await updateUser(id, first_name, last_name, email);

        if (!updatedUser) {
            return res.status(404).json({ error: 'user not found' });
        }
        res.status(200).json({ message: 'user updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'internal server error' });
    }
};

// Actualizar rol del usuario
export const updateRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;  
    try {
        const query = `
            UPDATE users 
            SET role = $1 
            WHERE id = $2 
            RETURNING id, first_name AS "firstName", last_name AS "lastName", email, role;
        `;
        const result = await pool.query(query, [role, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error al actualizar el rol del usuario:", error);
        res.status(500).json({ error: 'Database error' });
    }
};