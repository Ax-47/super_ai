import { VectorDatabaseRepository } from '../infrastructures/vector_db';
import { DatabaseRepository } from '../infrastructures/database';
export interface PromptRepository {
  create(): Promise<void>
}
export class CategoryRepositoryImpl implements PromptRepository {
  private database: DatabaseRepository;
  constructor(
    database: DatabaseRepository,
  ) {
    this.database = database;
  }
  async create(): Promise<void> {
  }
}
