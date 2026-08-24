import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
});

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS neon_users (
      id          TEXT PRIMARY KEY,
      data        JSONB NOT NULL,
      updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_neon_users_time
      ON neon_users (updated_at DESC);
  `);
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await ensureTable();

    if (req.method === 'GET') {
      const { rows } = await pool.query('SELECT data FROM neon_users ORDER BY updated_at DESC');
      return res.status(200).json(rows.map((r) => r.data));
    }

    if (req.method === 'POST') {
      let user = req.body;
      if (typeof user === 'string') {
        try { user = JSON.parse(user); } catch {}
      }
      if (!user?.id) return res.status(400).json({ error: 'Missing user id' });

      await pool.query(
        `INSERT INTO neon_users (id, data, updated_at) VALUES ($1, $2::jsonb, NOW())
         ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
        [user.id, JSON.stringify(user)]
      );
      return res.status(201).json({ success: true, user });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
