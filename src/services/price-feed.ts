import KrakenService from './kraken';

interface PriceUpdate {
  asset: string;
  price: number;
  timestamp: Date;
}

export class PriceFeedService {
  private kraken: KrakenService;
  private prices: Map<string, number> = new Map();
  private subscribers: ((update: PriceUpdate) => void)[] = [];

  constructor(kraken: KrakenService) {
    this.kraken = kraken;
  }

  async updatePrices(): Promise<void> {
    try {
      const btcPrice = await this.kraken.getTickerPrice('XXBTZUSD');
      const ethPrice = await this.kraken.getTickerPrice('XETHZUSD');

      this.prices.set('BTC', btcPrice);
      this.prices.set('ETH', ethPrice);

      this.notifySubscribers({ asset: 'BTC', price: btcPrice, timestamp: new Date() });
      this.notifySubscribers({ asset: 'ETH', price: ethPrice, timestamp: new Date() });
    } catch (error) {
      console.error('Error updating prices:', error);
    }
  }

  getPrice(asset: string): number | undefined {
    return this.prices.get(asset);
  }

  subscribe(callback: (update: PriceUpdate) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers(update: PriceUpdate): void {
    this.subscribers.forEach(callback => callback(update));
  }
}

export default PriceFeedService;
