import { Client } from 'cassandra-driver';

export interface Paginated<T> {
  categories: T[];
  nextPagingState?: string;
}
export class DatabaseRepository {
  private client: Client;
  private keyspace: string;
  constructor(contactPoints: string[], keyspace: string) {
    this.client = new Client({
      contactPoints,
      localDataCenter: 'datacenter1',
      keyspace,
    });
    this.keyspace = keyspace;
  }
  getClient(): Client {
    return this.client
  }
  getKeyspace(): string {
    return this.keyspace
  }
}
