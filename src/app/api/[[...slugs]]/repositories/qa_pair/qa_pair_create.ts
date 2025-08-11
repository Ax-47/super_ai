import { Category, QAPair, QAPairInsert } from '../../domain';
import { inject, injectable } from "tsyringe";
import type { QAPairDatabaseRepository } from '../../infrastructures/qa_pair/database';
import type { QAPairVectorDatabaseRepository } from '../../infrastructures/qa_pair/vector_database';
import type { CategoryDatabaseRepository } from '../../infrastructures/category/database';
export interface CreateQAPairRepository {
  find_category(cat_id: string): Promise<Category | null>
  insert_to_vector_database(qa_pair: QAPair): Promise<void>;
  insert_to_database(qa_pair: QAPairInsert): Promise<QAPair>;
}
@injectable()
export class CreateQAPairRepositoryImpl implements CreateQAPairRepository {
  constructor(
    @inject("QAPairDatabaseRepository")
    private qa_pair_database_repo: QAPairDatabaseRepository,
    @inject("CategoryDatabaseRepository")
    private category_database_repo: CategoryDatabaseRepository,
    @inject("QAPairVectorDatabaseRepository")
    private vector_database_repo: QAPairVectorDatabaseRepository,
  ) { }
  async find_category(cat_id: string): Promise<Category | null> {
    return this.category_database_repo.read(cat_id)
  }
  async insert_to_vector_database(qa_pair: QAPair): Promise<void> {
    return this.vector_database_repo.create(qa_pair)
  }
  async insert_to_database(qa_pair: QAPairInsert): Promise<QAPair> {
    return this.qa_pair_database_repo.create(qa_pair)
  }


}
