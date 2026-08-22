import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: connectionString ? { rejectUnauthorized: false } : undefined
});

export async function initNeonTables() {
  if (!connectionString) {
    console.log("DATABASE_URL not set; skipping Neon DB init.");
    return;
  }
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS neon_products (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS neon_posts (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS neon_orders (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS neon_users (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Neon database tables ensured via src/lib/neon.ts");
  } catch (err) {
    console.error("Error creating Neon tables:", err);
  }
}
