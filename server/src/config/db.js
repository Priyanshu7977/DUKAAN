const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/dukaan_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.warn('[PostgreSQL Pool Warning] Idle client connection anomaly:', err.message);
});

async function queryWithRLS(userId, role, text, params) {
  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    if (userId) {
      await client.query("SELECT set_config('app.current_user_id', $1, true)", [userId]);
    }
    if (role) {
      await client.query("SELECT set_config('app.current_role', $1, true)", [role]);
    }
    const res = await client.query(text, params);
    await client.query('COMMIT');
    return res;
  } catch (err) {
    if (client) {
      try { await client.query('ROLLBACK'); } catch {}
    }
    throw err;
  } finally {
    if (client) {
      client.release();
    }
  }
}

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  queryWithRLS,
};
