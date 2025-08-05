import { RedisClient } from "bun";

type Metadata = { [key: string]: string | number | boolean | null | string[] };
export class CacheRepository<T extends Metadata = Metadata> {
  private client: RedisClient;
  constructor(redisUrl: string) {
    this.client = new RedisClient(redisUrl);
    this.client.connect();
  }
  private getKey(collection: string, id: string): string {
    return `${collection}:${id}`;
  }

  public async set(
    collection: string,
    id: string,
    value: T,
    ttlSeconds?: number
  ): Promise<void> {
    const key = this.getKey(collection, id);
    const json = JSON.stringify(value);

    await this.client.set(key, json);
    if (ttlSeconds) {
      await this.client.expire(key, ttlSeconds);
    }
  }

  public async get(collection: string, id: string): Promise<T | null> {
    const key = this.getKey(collection, id);
    const result = await this.client.get(key);
    return result ? JSON.parse(result) as T : null;
  }

  public async delete(collection: string, id: string): Promise<void> {
    const key = this.getKey(collection, id);
    await this.client.del(key);
  }
}
