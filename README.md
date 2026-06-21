# Crypto DCA Trading Bot 🚀

Automated hourly DCA (Dollar Cost Averaging) trading bot for BTC/ETH with Kraken API integration.

## Features

- ✅ **Automated DCA Strategy**: Hourly buys at scheduled intervals
- ✅ **Kraken Integration**: Sandbox and live trading modes
- ✅ **Real-time Price Feed**: Live BTC/ETH prices
- ✅ **Portfolio Tracking**: Monitor your holdings
- ✅ **Web Dashboard**: React/Vite frontend
- ✅ **REST API**: Full backend API
- ✅ **Docker Support**: Easy deployment

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- SQLite (database)
- Kraken API

### Frontend
- React 18
- TypeScript
- Vite
- CSS3

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Kraken API credentials (sandbox recommended for testing)

### Installation

```bash
# Clone the repo
git clone git@github.com:maxbuzz009/crypto-dca-bot.git
cd crypto-dca-bot

# Install dependencies
npm install
npm install --prefix frontend

# Setup environment
cp .env.example .env
# Edit .env with your Kraken API credentials

# Start development servers
npm run dev
```

### Docker

```bash
docker-compose up --build
```

## Project Structure

```
crypto-dca-bot/
├── src/                 # Backend source
│   ├── index.ts        # Entry point
│   ├── db.ts           # Database setup
│   ├── services/       # Business logic
│   └── routes/         # API routes
├── frontend/           # React app
│   ├── src/
│   ├── index.html
│   └── vite.config.ts
├── docker-compose.yml
└── package.json
```

## API Endpoints

### Strategy
- `GET /api/strategy` - Get current strategy config
- `POST /api/strategy` - Update strategy

### Portfolio
- `GET /api/portfolio` - Get portfolio holdings
- `GET /api/portfolio/history` - Get purchase history

### Orders
- `GET /api/orders` - List all orders
- `POST /api/orders` - Place manual order

### Prices
- `GET /api/prices/btc` - Get BTC price
- `GET /api/prices/eth` - Get ETH price

### Alerts
- `GET /api/alerts` - Get alerts
- `POST /api/alerts` - Create alert

## Development

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend

# Both
npm run dev
```

## Production

```bash
npm run build
npm start
```

## License

MIT

## Disclaimer

⚠️ **This is a bot for automated trading. Use at your own risk.**
- Start with sandbox mode
- Test thoroughly before live trading
- Never commit API keys to version control
- Keep `.env` file secure
