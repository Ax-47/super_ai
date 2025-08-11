import { v4 as uuidv4 } from 'uuid';
import { QAPair, QAPairInsert } from '../../domain';
import { DatabaseRepository } from '../../infrastructures/database';
import { injectable } from "tsyringe";
import { VectorDatabaseRepository } from '../../infrastructures/vector_db';
export interface CreateCategoryRepository {
  create(qa_pair: QAPairInsert): Promise<QAPair>
}
@injectable()
export class CreateCategoryRepositoryImpl implements CreateCategoryRepository {
  constructor(
    private database: DatabaseRepository,
    private vectorDatabase: VectorDatabaseRepository,
  ) { }
  async create(qa_pair: QAPairInsert): Promise<QAPair> {
    const qa_pair_id = uuidv4();
    const created_at = new Date();
    const updated_at = created_at;

    const query = `
  INSERT INTO ${this.database.getKeyspace()}.qa_pairs (
    qa_pair_id, question, answer, category_id, category_name, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?)
`;
    const metadata = {
      answer: qa_pair.answer,
      category: qa_pair.category_name,
      created_at: created_at.toISOString(),
    };
    this.vectorDatabase.addDocument(
      `qa_pairs:${qa_pair.category_name}`,
      qa_pair_id,
      qa_pair.question,
      metadata
    )
    const params = [
      qa_pair_id,
      qa_pair.question,
      qa_pair.answer,
      qa_pair.category_id,
      qa_pair.category_name,
      created_at,
      updated_at
    ];
    const new_qa_pair: QAPair = {
      qa_pair_id,
      question: qa_pair.question,
      answer: qa_pair.answer,
      category_id: qa_pair.category_id,
      category_name: qa_pair.category_name,
      created_at,
      updated_at,
    };

    try {
      await this.database.getClient().execute(query, params, { prepare: true });
      return new_qa_pair
    } catch (err) {
      console.error("Failed to insert category:", {
        category_id: qa_pair.category_id,
        category_name: qa_pair.category_name,
        error: err,
      });
      throw new Error("DatabaseError: Unable to create category.");
    }
  }
}
