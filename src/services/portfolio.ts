import { getDatabase } from '../db';
import { promisify } from 'util';

interface PortfolioPosition {
  asset: string;
  quantity: number;
  averagePrice: number;
  totalInvested: number;
}

export class PortfolioService {
  async getPortfolio(): Promise<PortfolioPosition[]> {
    const db = getDatabase();
    const all = promisify(db.all.bind(db));
    
    const rows = await all('SELECT * FROM portfolio') as any[];
    return rows.map((row: any) => ({
      asset: row.asset,
      quantity: row.quantity,
      averagePrice: row.average_price,
      totalInvested: row.total_invested,
    }));
  }

  async getPosition(asset: string): Promise<PortfolioPosition | null> {
    const db = getDatabase();
    const get = promisify(db.get.bind(db));
    
    const row = await get('SELECT * FROM portfolio WHERE asset = ?', [asset]) as any;
    if (!row) return null;

    return {
      asset: row.asset,
      quantity: row.quantity,
      averagePrice: row.average_price,
      totalInvested: row.total_invested,
    };
  }

  async getPurchaseHistory(): Promise<any[]> {
    const db = getDatabase();
    const all = promisify(db.all.bind(db));
    
    return all(`
      SELECT id, asset, quantity, price, total, status, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 100
    `) as Promise<any[]>;
  }
}

export default PortfolioService;
