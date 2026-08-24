import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
});

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS neon_posts (
      id          TEXT PRIMARY KEY,
      data        JSONB NOT NULL,
      updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_neon_posts_time
      ON neon_posts (updated_at DESC);
  `);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await ensureTable();

    if (req.method === 'GET') {
      const { rows } = await pool.query('SELECT data FROM neon_posts ORDER BY updated_at DESC');
      return res.status(200).json(rows.map((r) => r.data));
    }

    if (req.method === 'POST') {
      let post = req.body;
      if (typeof post === 'string') {
        try { post = JSON.parse(post); } catch {}
      }

      if (!post?.id) {
        return res.status(400).json({ error: 'Missing post id' });
      }

      await pool.query(
        `INSERT INTO neon_posts (id, data, updated_at)
         VALUES ($1, $2::jsonb, NOW())
         ON CONFLICT (id)
         DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
        [post.id, JSON.stringify(post)]
      );

      return res.status(201).json({ success: true, post });
    }

    if (req.method === 'DELETE') {
      // Vercel path parameters via query
      // Sometimes it comes via URL, but simple query parsing works if we call /api/posts?id=xxx
      // But in App.tsx we call DELETE /api/posts/:id. Let's fix that if needed. Wait, App.tsx uses:
      // fetch('/api/posts/' + postId, { method: 'DELETE' })
      // Vercel serverless functions handle /api/posts/[id].js for dynamic routes, or we can handle it in App.tsx by using ?id=
      return res.status(405).json({ error: 'Use /api/posts?id=... for DELETE in Vercel' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    console.error('[/api/posts error]', err);
    return res.status(500).json({ error: err.message });
  }
}
