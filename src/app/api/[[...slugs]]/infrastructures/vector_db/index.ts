import { ChromaClient, Collection, EmbeddingFunction } from "chromadb";
import { inject, injectable } from "tsyringe";

export type Metadata = { [key: string]: string | number | boolean | null };
@injectable()
export class VectorDatabaseRepository<T extends Metadata = Metadata> {
  private collections: Map<string, Collection>;
  constructor(
    @inject(ChromaClient) private readonly client: ChromaClient
  ) {
    this.collections = new Map();
  }

  public async getCollection(name: string, embeddingFunction?: EmbeddingFunction): Promise<Collection> {
    if (this.collections.has(name))
      return this.collections.get(name)!;

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

  public async updateDocument(
    collectionName: string,
    id: string,
    document: string,
    metadata?: T
  ): Promise<void> {
    const collection = await this.getCollection(collectionName);

    // เช็กว่ามีเอกสารนี้อยู่รึเปล่า
    const existing = await collection.get({ ids: [id] });
    if (!existing || (existing.ids?.length ?? 0) === 0) {
      throw new Error(`Document with id "${id}" not found`);
    }

    // อัปเดต
    await collection.add({
      ids: [id],
      documents: [document],
      metadatas: metadata ? [metadata] : undefined,
    });
  }
  public async deleteDocument(
    collectionName: string,
    id: string
  ): Promise<void> {
    const collection = await this.getCollection(collectionName);
    await collection.delete({
      ids: [id]
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
