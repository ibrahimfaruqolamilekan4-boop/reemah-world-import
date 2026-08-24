import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined });
export const config = {\n  api: {\n    bodyParser: {\n      sizeLimit: '10mb',\n    },\n  },\n};\n\nexport default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  const { id } = req.query;
  try {
    if (req.method === 'DELETE') {
      await pool.query('DELETE FROM neon_products WHERE id = $1', [id]);
      return res.status(200).json({ success: true });
    }
    if (req.method === 'PATCH') {
      let updates = req.body;
      if (typeof updates === 'string') { try { updates = JSON.parse(updates); } catch {} }
      const { rows } = await pool.query('SELECT data FROM neon_products WHERE id = $1', [id]);
      if (rows.length > 0) {
        const updatedData = { ...rows[0].data, ...updates };
        await pool.query('UPDATE neon_products SET data = $1, updated_at = NOW() WHERE id = $2', [JSON.stringify(updatedData), id]);
        return res.status(200).json({ success: true, product: updatedData });
      }
      return res.status(404).json({ error: 'Not found' });
    }
  } catch (err) { return res.status(500).json({ error: err.message }); }
}
