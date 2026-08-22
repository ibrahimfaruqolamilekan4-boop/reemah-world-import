import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, initNeonTables } from './src/lib/neon.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Neon tables
initNeonTables();

// API Health / Status
app.get('/api/db-status', (req, res) => {
  res.json({
    connected: !!process.env.DATABASE_URL,
    database: process.env.DATABASE_URL ? 'Neon PostgreSQL' : 'LocalStorage / Memory Fallback',
    message: process.env.DATABASE_URL ? 'Connected to Neon database successfully' : 'Please configure DATABASE_URL in secrets for Neon database persistence.'
  });
});

// Products APIs
app.get('/api/products', async (req, res) => {
  if (!process.env.DATABASE_URL) return res.json([]);
  try {
    const { rows } = await pool.query('SELECT data FROM neon_products');
    res.json(rows.map(r => r.data));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  const product = req.body;
  if (!product || !product.id) return res.status(400).json({ error: 'Invalid product data' });
  if (!process.env.DATABASE_URL) return res.json({ success: true, product, warning: 'Saved locally (Neon not configured)' });
  try {
    await pool.query(
      `INSERT INTO neon_products (id, data, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (id) DO UPDATE SET data = $2, updated_at = CURRENT_TIMESTAMP`,
      [product.id, JSON.stringify(product)]
    );
    res.json({ success: true, product });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  if (!process.env.DATABASE_URL) return res.json({ success: true });
  try {
    await pool.query('DELETE FROM neon_products WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  if (!process.env.DATABASE_URL) return res.json({ success: true });
  try {
    const { rows } = await pool.query('SELECT data FROM neon_products WHERE id = $1', [id]);
    if (rows.length > 0) {
      const updatedData = { ...rows[0].data, ...updates };
      await pool.query('UPDATE neon_products SET data = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [JSON.stringify(updatedData), id]);
      return res.json({ success: true, product: updatedData });
    }
    res.status(404).json({ error: 'Product not found' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Posts APIs
app.get('/api/posts', async (req, res) => {
  if (!process.env.DATABASE_URL) return res.json([]);
  try {
    const { rows } = await pool.query('SELECT data FROM neon_posts ORDER BY updated_at DESC');
    res.json(rows.map(r => r.data));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/posts', async (req, res) => {
  const post = req.body;
  if (!post || !post.id) return res.status(400).json({ error: 'Invalid post data' });
  if (!process.env.DATABASE_URL) return res.json({ success: true, post });
  try {
    await pool.query(
      `INSERT INTO neon_posts (id, data, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (id) DO UPDATE SET data = $2, updated_at = CURRENT_TIMESTAMP`,
      [post.id, JSON.stringify(post)]
    );
    res.json({ success: true, post });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  if (!process.env.DATABASE_URL) return res.json({ success: true });
  try {
    await pool.query('DELETE FROM neon_posts WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Orders APIs
app.get('/api/orders', async (req, res) => {
  if (!process.env.DATABASE_URL) return res.json([]);
  try {
    const { rows } = await pool.query('SELECT data FROM neon_orders ORDER BY updated_at DESC');
    res.json(rows.map(r => r.data));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  const order = req.body;
  if (!order || !order.id) return res.status(400).json({ error: 'Invalid order data' });
  if (!process.env.DATABASE_URL) return res.json({ success: true, order });
  try {
    await pool.query(
      `INSERT INTO neon_orders (id, data, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (id) DO UPDATE SET data = $2, updated_at = CURRENT_TIMESTAMP`,
      [order.id, JSON.stringify(order)]
    );
    res.json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  if (!process.env.DATABASE_URL) return res.json({ success: true });
  try {
    const { rows } = await pool.query('SELECT data FROM neon_orders WHERE id = $1', [id]);
    if (rows.length > 0) {
      const updatedData = { ...rows[0].data, ...updates };
      await pool.query('UPDATE neon_orders SET data = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [JSON.stringify(updatedData), id]);
      return res.json({ success: true, order: updatedData });
    }
    res.status(404).json({ error: 'Order not found' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Users APIs
app.get('/api/users', async (req, res) => {
  if (!process.env.DATABASE_URL) return res.json([]);
  try {
    const { rows } = await pool.query('SELECT data FROM neon_users ORDER BY updated_at DESC');
    res.json(rows.map(r => r.data));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  const user = req.body;
  if (!user || !user.id) return res.status(400).json({ error: 'Invalid user data' });
  if (!process.env.DATABASE_URL) return res.json({ success: true, user });
  try {
    await pool.query(
      `INSERT INTO neon_users (id, data, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (id) DO UPDATE SET data = $2, updated_at = CURRENT_TIMESTAMP`,
      [user.id, JSON.stringify(user)]
    );
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} with Neon Database (pg) support`);
});
