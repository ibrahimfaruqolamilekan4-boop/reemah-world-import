import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined });
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  const { id } = req.query;
  try {
    if (req.method === 'DELETE') {
      await pool.query('DELETE FROM neon_posts WHERE id = $1', [id]);
      return res.status(200).json({ success: true });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
