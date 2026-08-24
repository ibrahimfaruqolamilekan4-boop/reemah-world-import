import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined });
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  const { id } = req.query;
  try {
    if (req.method === 'PATCH') {
      let updates = req.body;
      if (typeof updates === 'string') { try { updates = JSON.parse(updates); } catch {} }
      const { rows } = await pool.query('SELECT data FROM neon_orders WHERE id = $1', [id]);
      if (rows.length > 0) {
        const updatedData = { ...rows[0].data, ...updates };
        await pool.query('UPDATE neon_orders SET data = $1, updated_at = NOW() WHERE id = $2', [JSON.stringify(updatedData), id]);
        return res.status(200).json({ success: true, order: updatedData });
      }
      return res.status(404).json({ error: 'Not found' });
    }
  } catch (err) { return res.status(500).json({ error: err.message }); }
}
