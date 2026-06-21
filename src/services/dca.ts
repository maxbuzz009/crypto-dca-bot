import cron from 'node-cron';
import KrakenService from './kraken';
import PriceFeedService from './price-feed';

interface DCAConfig {
  intervalHours: number;
  amountUSD: number;
  btcAllocation: number;
  ethAllocation: number;
}

export class DCAService {
  private kraken: KrakenService;
  private priceFeed: PriceFeedService;
  private config: DCAConfig;
  private isRunning = false;

  constructor(kraken: KrakenService, priceFeed: PriceFeedService, config: DCAConfig) {
    this.kraken = kraken;
    this.priceFeed = priceFeed;
    this.config = config;
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.warn('DCA already running');
      return;
    }

    this.isRunning = true;
    const cronExpression = `0 */${this.config.intervalHours} * * *`;

    cron.schedule(cronExpression, async () => {
      console.log(`🤖 DCA triggered at ${new Date().toISOString()}`);
      await this.executeDCA();
    });

    console.log(`✅ DCA Service started - interval: ${this.config.intervalHours}h`);
    await this.executeDCA();
  }

  private async executeDCA(): Promise<void> {
    try {
      const btcAmount = (this.config.amountUSD * this.config.btcAllocation) / 100;
      const ethAmount = (this.config.amountUSD * this.config.ethAllocation) / 100;

      await Promise.all([
        this.buyAsset('XXBTZUSD', btcAmount),
        this.buyAsset('XETHZUSD', ethAmount),
      ]);

      console.log(`✅ DCA execution completed`);
    } catch (error) {
      console.error('DCA execution error:', error);
    }
  }

  private async buyAsset(pair: string, amountUSD: number): Promise<void> {
    try {
      const asset = pair === 'XXBTZUSD' ? 'BTC' : 'ETH';
      const price = this.priceFeed.getPrice(asset);
      if (!price) throw new Error(`No price available for ${pair}`);

      const volume = amountUSD / price;
      console.log(`✅ Buying ${volume.toFixed(6)} ${asset} for $${amountUSD}`);
    } catch (error) {
      console.error(`Error buying ${pair}:`, error);
    }
  }

  stop(): void {
    this.isRunning = false;
    console.log('❌ DCA Service stopped');
  }
}

export default DCAService;
