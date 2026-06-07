import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
// configuración de la conexión a la base de datos
const useSsl = process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // si estamos en producción o si DB_SSL es 'true', usamos SSL con rejectUnauthorized: false (evita problemas con certificados autofirmados)
  ssl: useSsl ? { rejectUnauthorized: false } : false,
  max: 10,
});

export default pool;
