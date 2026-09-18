// ============================================================
// FILE PATH: /api/products.js   (ROOT of project, next to src/)
// This becomes: https://your-site.vercel.app/api/products
// ============================================================
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
});

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS neon_products (
      id          TEXT PRIMARY KEY,
      data        JSONB NOT NULL,
      updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_neon_products_time
      ON neon_products (updated_at DESC);
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
  // ── CORS (so your frontend can call this) ──────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── GET all products (every admin + every user sees these) ──
  // Returns a bare ARRAY: the frontend guards with Array.isArray(data),
  // so wrapping the list in { products: [...] } left the store empty for
  // everyone on the deployed site.
  if (req.method === 'GET') {
    if (!process.env.DATABASE_URL) return res.status(200).json([]);
    try {
      await ensureTable();
      const { rows } = await pool.query(
        'SELECT data FROM neon_products ORDER BY updated_at DESC'
      );
      return res.status(200).json(rows.map((r) => r.data));
    } catch (err) {
      console.error('[/api/products GET error]', err);
      // A DB hiccup must never blank the storefront.
      return res.status(200).json([]);
    }
  }

  if (!process.env.DATABASE_URL) {
    return res.status(200).json({ success: true, warning: 'DATABASE_URL not configured' });
  }

  try {
    await ensureTable();

    // ── POST create / update a product ────────────────────────
    if (req.method === 'POST') {
      // Vercel auto-parses JSON bodies; this guard covers edge cases
      let product = req.body;
      if (typeof product === 'string') {
        try { product = JSON.parse(product); } catch {}
      }

      if (!product?.id) {
        return res.status(400).json({ error: 'Missing product id' });
      }

      await pool.query(
        `INSERT INTO neon_products (id, data, updated_at)
         VALUES ($1, $2::jsonb, NOW())
         ON CONFLICT (id)
         DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
        [product.id, JSON.stringify(product)]
      );

      return res.status(201).json({ success: true, product });
    }

    // ── DELETE a product ──────────────────────────────────────
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing id' });
      await pool.query('DELETE FROM neon_products WHERE id = $1', [id]);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    console.error('[/api/products error]', err);
    return res.status(500).json({ error: err.message });
  }
}
