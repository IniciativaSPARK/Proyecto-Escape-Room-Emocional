import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const useSsl = process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  
  ssl: useSsl ? { rejectUnauthorized: false } : false,
  max: 10,
});

export default pool;