import { Client } from 'cassandra-driver';


export class DatabaseRepository {
  private client: Client;

  constructor(contactPoints: string[], keyspace: string) {
    this.client = new Client({
      contactPoints,
      localDataCenter: 'datacenter1',
      keyspace,
    });
  }
  getClient(): Client {
    return this.client
  }
}
