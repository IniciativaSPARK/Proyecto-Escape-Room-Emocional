import { Router } from 'express';
import pg from 'pg';

const router = Router();

const { Pool } = pg;
const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true }
});

// GET: Obtener todos los objetos en general del catálogo maestro
router.get('/objects', async (req, res) => {
    try {
        const query = 'SELECT item_id AS id, model_path AS "modelPath" FROM objects';
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener los objetos:", error);
        res.status(500).json({ error: 'Database error' });
    }
});

// GET: Obtener un objeto específico por su ID
router.get('/objects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT item_id AS id, model_path AS "modelPath" FROM objects WHERE item_id = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Object not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error al obtener el objeto:", error);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST: Crear un nuevo objeto en el catálogo general
router.post('/objects', async (req, res) => {
    const { itemId, modelPath } = req.body;
    try {
        const query = `
            INSERT INTO objects (item_id, model_path) 
            VALUES ($1, $2) 
            RETURNING item_id AS id, model_path AS "modelPath";
        `;
        const result = await pool.query(query, [itemId, modelPath]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error al crear el objeto:", error);
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;