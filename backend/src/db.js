const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || 'challenge_db',
  user: process.env.PGUSER || 'challenge',
  password: process.env.PGPASSWORD || 'challenge',
  max: 10,
  idleTimeoutMillis: 30000
});

async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  if (duration > 200) {
    // slow query indicator
    // console.warn('Slow query', { duration, text });
  }
  return result;
}

module.exports = { pool, query };


