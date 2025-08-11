import { Client } from 'cassandra-driver';
import { inject, injectable } from 'tsyringe';
export interface Paginated<T> {
  categories: T[];
  nextPagingState?: string;
}
@injectable()
export class DatabaseRepository {
  constructor(
    @inject(Client) private readonly client: Client
  ) {
    this.client = client
  }
  getClient(): Client {
    return this.client
  }
  getKeyspace(): string {
    return this.client.keyspace
  }
}
