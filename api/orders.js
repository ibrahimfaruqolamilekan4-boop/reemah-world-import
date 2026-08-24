import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
});

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS neon_orders (
      id          TEXT PRIMARY KEY,
      data        JSONB NOT NULL,
      updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_neon_orders_time
      ON neon_orders (updated_at DESC);
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await ensureTable();

    if (req.method === 'GET') {
      const { rows } = await pool.query('SELECT data FROM neon_orders ORDER BY updated_at DESC');
      return res.status(200).json(rows.map((r) => r.data));
    }

    if (req.method === 'POST') {
      let order = req.body;
      if (typeof order === 'string') {
        try { order = JSON.parse(order); } catch {}
      }
      if (!order?.id) return res.status(400).json({ error: 'Missing order id' });

      await pool.query(
        `INSERT INTO neon_orders (id, data, updated_at) VALUES ($1, $2::jsonb, NOW())
         ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
        [order.id, JSON.stringify(order)]
      );
      return res.status(201).json({ success: true, order });
    }

    if (req.method === 'PATCH') {
      const { id } = req.query;
      let updates = req.body;
      if (typeof updates === 'string') {
        try { updates = JSON.parse(updates); } catch {}
      }
      
      const { rows } = await pool.query('SELECT data FROM neon_orders WHERE id = $1', [id]);
      if (rows.length > 0) {
        const updatedData = { ...rows[0].data, ...updates };
        await pool.query('UPDATE neon_orders SET data = $1::jsonb, updated_at = NOW() WHERE id = $2', [JSON.stringify(updatedData), id]);
        return res.status(200).json({ success: true, order: updatedData });
      }
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
