
import { inject, injectable } from 'tsyringe';
import { QAPair } from '../../domain';
import { Metadata, VectorDatabaseRepository } from '../vector_db';
export interface QAPairVectorDatabaseRepository {
  create({ qa_pair_id, category_name, question, answer, created_at }: QAPair): Promise<void>
  search(category: string, prompt: string, n?: number):
    Promise<{ documents: string[]; metadatas: Metadata[]; ids: string[]; distances: number[]; }>;
}
@injectable()
export class QAPairVectorDatabaseRepositoryImpl implements QAPairVectorDatabaseRepository {

  constructor(
    @inject(VectorDatabaseRepository) private vector_database_repo: VectorDatabaseRepository
  ) { }
  async create({ qa_pair_id, category_name, question, answer, created_at }: QAPair): Promise<void> {
    return this.vector_database_repo.addDocument(
      `qa_pairs-${category_name}`,
      qa_pair_id,
      question,
      {
        answer: answer,
        category: category_name,
        created_at: created_at.toISOString(),
      }
    )
  }
  async search(
    category: string,
    prompt: string,
    n?: number
  ): Promise<{
    documents: string[];
    metadatas: Metadata[];
    ids: string[];
    distances: number[];
  }> {
    return await this.vector_database_repo.search(`qa_pairs-${category}`, prompt, n);
  }
}
