import { v4 as uuidv4 } from 'uuid';
import { Category, QAPairInsert } from '../../domain';
import { DatabaseRepository } from '../../infrastructures/database';
import { inject, injectable } from "tsyringe";
import { VectorDatabaseRepository } from '../../infrastructures/vector_db';
export interface CreateCategoryRepository {
  create(qa_pair: QAPairInsert): Promise<Category>
}
@injectable()
export class CreateCategoryRepositoryImpl implements CreateCategoryRepository {
  constructor(@inject("DatabaseRepository") private database: DatabaseRepository,
    @inject("DatabaseRepository") private vectorDatabase: VectorDatabaseRepository,
  ) { }
  async create(qa_pair: QAPairInsert): Promise<Category> {
    const qa_pair_id = uuidv4();
    const created_at = new Date();
    const updated_at = created_at;

    const query = `
  INSERT INTO ${this.database.getKeyspace()}.qa_pairs (
    qa_pair_id, question, answer, category_id, category_name, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?)
`;
    const params = [
      qa_pair_id,    // uuid
      qa_pair.question,     // uuid
      qa_pair.answer,       // uuid
      qa_pair.category_id,  // uuid
      qa_pair.category_name, // text
      created_at,   // timestamp (Date object)
      updated_at    // timestamp (Date object)
    ];
    const new_cat: Category = {
      category_id: qa_pair.category_id,
      category_name: qa_pair.category_name,
      created_at,
      updated_at,
    };

    try {
      await this.database.getClient().execute(query, params, { prepare: true });
      return new_cat
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
