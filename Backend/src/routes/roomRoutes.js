import { Router } from 'express';
import pg from 'pg';

const router = Router();

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true }
});

router.get('/rooms/:roomName', async (req, res) => {
    const { roomName } = req.params;
    try {
        const query = `
        SELECT 
                o.item_id AS id,
                o.model_path AS "modelPath",
                ro.scale,
                ro.position,
                ro.rotation
            FROM rooms r
            JOIN room_objects ro ON r.id = ro.room_id
            JOIN objects o ON ro.item_id = o.item_id
            WHERE r.room_name = $1;
        `;
    const result = await pool.query(query, [ roomName]);
    if(result.rows.length === 0){
        return res.status(404).json({error: 'Room not found'});
    }
    res.json(result.rows);
    } catch (error) {
        console.error('Error en la base de datos:', error);
        res.status(500).json({error: 'Database error'});
    }

});

export default router;