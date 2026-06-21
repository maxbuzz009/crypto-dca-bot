import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto-js';

interface KrakenConfig {
  apiKey: string;
  apiSecret: string;
  sandbox?: boolean;
}

export class KrakenService {
  private client: AxiosInstance;
  private apiKey: string;
  private apiSecret: string;

  constructor(config: KrakenConfig) {
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    
    this.client = axios.create({
      baseURL: 'https://api.kraken.com/0',
      timeout: 30000,
    });
  }

  async getTickerPrice(pair: string): Promise<number> {
    try {
      const response = await this.client.get('/public/Ticker', {
        params: { pair },
      });
      const key = Object.keys(response.data.result)[0];
      return parseFloat(response.data.result[key].c[0]);
    } catch (error) {
      console.error(`Error fetching ${pair} price:`, error);
      throw error;
    }
  }

  async getBalance(): Promise<Record<string, number>> {
    try {
      const response = await this.client.get('/private/Balance', {
        headers: this.getAuthHeaders('/private/Balance', {}),
      });
      return response.data.result;
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }

  private getAuthHeaders(
    endpoint: string,
    params: Record<string, any>
  ): Record<string, string> {
    const nonce = Date.now() * 1000;
    const postdata = new URLSearchParams({ nonce: nonce.toString(), ...params });
    const message = endpoint + postdata.toString();
    const hash = crypto.SHA256(message);
    const hmac = crypto.HmacSHA512(hash, this.apiSecret);

    return {
      'API-Sign': hmac.toString(crypto.enc.Base64),
      'API-Key': this.apiKey,
    };
  }
}

export default KrakenService;
