import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { pool, initNeonTables } from './src/lib/neon.js';


const _dirname = process.cwd();

/* ---------------------------------------------------------
   Shared file store (used when Neon DATABASE_URL is absent)
   Keeps admin posts/products identical for every user on
   every device instead of only the admin's own browser.
--------------------------------------------------------- */
const DATA_DIR = path.join(_dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

type StoreEntry = { id: string; data: any; updatedAt: string };
type StoreShape = { products: StoreEntry[]; posts: StoreEntry[]; orders: StoreEntry[]; users: StoreEntry[] };

const loadStore = (): StoreShape => {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'));
      return { products: [], posts: [], orders: [], users: [], ...parsed };
    }
  } catch (err) {
    console.log('Store read error', err);
  }
  return { products: [], posts: [], orders: [], users: [] };
};

const persistStore = (store: StoreShape) => {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2));
  } catch (err) {
    console.log('Store write error', err);
  }
};

const store = loadStore();
const usingNeon = () => !!process.env.DATABASE_URL;

const storeUpsert = (key: keyof StoreShape, id: string, data: any) => {
  const list = store[key];
  const idx = list.findIndex((e: StoreEntry) => e.id === id);
  const entry = { id, data, updatedAt: new Date().toISOString() };
  if (idx >= 0) list[idx] = entry; else list.push(entry);
  persistStore(store);
  return entry;
};

const storeDelete = (key: keyof StoreShape, id: string) => {
  const idx = store[key].findIndex((e: StoreEntry) => e.id === id);
  if (idx >= 0) {
    store[key].splice(idx, 1);
    persistStore(store);
  }
};

async function startServer() {
const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Initialize Neon tables
if (usingNeon()) initNeonTables();

// API Health / Status
app.get('/api/db-status', (req, res) => {
  res.json({
    connected: !!process.env.DATABASE_URL,
    database: process.env.DATABASE_URL ? 'Neon PostgreSQL' : 'Shared server store',
    message: process.env.DATABASE_URL ? 'Connected to Neon database successfully' : 'Using the shared server store, so posts are visible to every user on every device.'
      });
});

// Products APIs
app.get('/api/products', async (req, res) => {
  if (!usingNeon()) {
    return res.json(store.products.map((e: StoreEntry) => e.data));
  }
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
  if (!usingNeon()) {
    storeUpsert('products', product.id, product);
    return res.json({ success: true, product });
  }
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
  if (!usingNeon()) {
    storeDelete('products', id);
    return res.json({ success: true });
  }
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
  if (!usingNeon()) {
    const existing = store.products.find((e: StoreEntry) => e.id === req.params.id);
    if (!existing) return res.status(404).json({ error: 'Product not found' });
    const updated = storeUpsert('products', req.params.id, { ...existing.data, ...updates });
    return res.json({ success: true, product: updated.data });
  }
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
  if (!usingNeon()) {
    return res.json(
      store.posts
        .slice()
        .sort((a: StoreEntry, b: StoreEntry) => (a.data?.createdAt || 0) - (b.data?.createdAt || 0))
        .map((e: StoreEntry) => e.data)
    );
  }
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
  if (!usingNeon()) {
    storeUpsert('posts', post.id, post);
    return res.json({ success: true, post });
  }
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
  if (!usingNeon()) {
    storeDelete('posts', id);
    return res.json({ success: true });
  }
  try {
    await pool.query('DELETE FROM neon_posts WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Orders APIs
app.get('/api/orders', async (req, res) => {
  if (!usingNeon()) {
    return res.json(store.orders.map((e: StoreEntry) => e.data));
  }
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
  if (!usingNeon()) {
    storeUpsert('orders', order.id, order);
    return res.json({ success: true, order });
  }
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
  if (!usingNeon()) {
    const existing = store.orders.find((e: StoreEntry) => e.id === req.params.id);
    if (!existing) return res.status(404).json({ error: 'Order not found' });
    const updated = storeUpsert('orders', req.params.id, { ...existing.data, ...updates });
    return res.json({ success: true, order: updated.data });
  }
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
  if (!usingNeon()) {
    return res.json(store.users.map((e: StoreEntry) => e.data));
  }
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
  if (!usingNeon()) {
    storeUpsert('users', user.id, user);
    return res.json({ success: true, user });
  }
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

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(_dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} with Neon Database (pg) support`);
  });
}
startServer();
