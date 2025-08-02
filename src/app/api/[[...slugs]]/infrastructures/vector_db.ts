import { ChromaClient, Collection, EmbeddingFunction } from "chromadb";

type Metadata = { [key: string]: string | number | boolean | null };

export class VectorDatabase<T extends Metadata = Metadata> {
  private client: ChromaClient;
  private collections: Map<string, Collection>;

  constructor(baseUrl?: string) {
    this.client = new ChromaClient({ path: baseUrl || "http://localhost:8000" });
    this.collections = new Map();
  }

  public async getCollection(name: string, embeddingFunction?: EmbeddingFunction): Promise<Collection> {
    if (this.collections.has(name)) {
      return this.collections.get(name)!;
    }

    const collection = await this.client.getOrCreateCollection({
      name,
      embeddingFunction,
    });

    this.collections.set(name, collection);
    return collection;
  }

  public async addDocument(
    collectionName: string,
    id: string,
    document: string,
    metadata?: T
  ): Promise<void> {
    const collection = await this.getCollection(collectionName);
    await collection.add({
      ids: [id],
      documents: [document],
      metadatas: metadata ? [metadata] : undefined,
    });
  }

  public async addDocuments(
    collectionName: string,
    entries: {
      id: string;
      document: string;
      metadata?: T;
    }[]
  ): Promise<void> {
    const collection = await this.getCollection(collectionName);
    await collection.add({
      ids: entries.map(e => e.id),
      documents: entries.map(e => e.document),
      metadatas: entries.some(e => e.metadata) ? entries.map(e => e.metadata ?? {}) : undefined,
    });
  }

  public async search(
    collectionName: string,
    query: string,
    n: number = 3
  ): Promise<{
    documents: string[];
    metadatas: T[];
    ids: string[];
    distances: number[];
  }> {
    const collection = await this.getCollection(collectionName);
    const result = await collection.query({
      queryTexts: [query],
      nResults: n,
    });

    return {
      documents: (result.documents?.[0] ?? []).filter((x): x is string => x !== null),
      metadatas: (result.metadatas?.[0] ?? []).filter((x): x is T => x !== null),
      ids: (result.ids?.[0] ?? []).filter((x): x is string => x !== null),
      distances: (result.distances?.[0] ?? []).filter((x): x is number => x !== null),
    };
  }
}
