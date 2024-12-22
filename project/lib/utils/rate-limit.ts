import { LRUCache } from "lru-cache";

type RateLimitOptions = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export class RateLimiter {
  private tokenCache: LRUCache<string, number[]>;

  constructor(options?: RateLimitOptions) {
    this.tokenCache = new LRUCache({
      max: options?.uniqueTokenPerInterval || 500,
      ttl: options?.interval || 60000,
    });
  }

  async check(token: string, limit: number): Promise<boolean> {
    const tokenCount = this.tokenCache.get(token) || [];
    const now = Date.now();
    const windowStart = now - (this.tokenCache.ttl as number);
    
    tokenCount.push(now);
    
    const withinWindow = tokenCount.filter(timestamp => timestamp > windowStart);
    this.tokenCache.set(token, withinWindow);

    return withinWindow.length <= limit;
  }
}

export const rateLimit = new RateLimiter({
  interval: 60000, // 1 minute
  uniqueTokenPerInterval: 500,
});