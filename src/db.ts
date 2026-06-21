import Database from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db: Database.Database;

export async function initializeDatabase() {
  return new Promise<void>((resolve, reject) => {
    const dbPath = process.env.DATABASE_URL?.replace('sqlite:', '') || path.join(__dirname, '../data/crypto-dca.db');
    
    db = new Database.Database(dbPath, (err) => {
      if (err) reject(err);
      else {
        console.log('✅ Database connected');
        createTables().then(resolve).catch(reject);
      }
    });
  });
}

async function createTables() {
  const run = promisify(db.run.bind(db));
  
  await run(`
    CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY,
      asset TEXT NOT NULL,
      quantity REAL NOT NULL,
      average_price REAL NOT NULL,
      total_invested REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY,
      asset TEXT NOT NULL,
      quantity REAL NOT NULL,
      price REAL NOT NULL,
      total REAL NOT NULL,
      status TEXT DEFAULT 'completed',
      kraken_order_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS price_history (
      id INTEGER PRIMARY KEY,
      asset TEXT NOT NULL,
      price REAL NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY,
      asset TEXT NOT NULL,
      type TEXT,
      condition TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS strategy_config (
      id INTEGER PRIMARY KEY,
      dca_interval_hours INTEGER,
      dca_amount_usd REAL,
      btc_allocation REAL,
      eth_allocation REAL,
      is_active BOOLEAN DEFAULT 1,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Tables created');
}

export function getDatabase(): Database.Database {
  if (!db) throw new Error('Database not initialized');
  return db;
}
