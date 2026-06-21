import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db';
import strategyRoutes from './routes/strategy';
import portfolioRoutes from './routes/portfolio';
import ordersRoutes from './routes/orders';
import pricesRoutes from './routes/prices';
import alertsRoutes from './routes/alerts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

initializeDatabase().catch(err => {
  console.error('Database initialization failed:', err);
  process.exit(1);
});

app.use('/api/strategy', strategyRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/prices', pricesRoutes);
app.use('/api/alerts', alertsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});

export default app;
