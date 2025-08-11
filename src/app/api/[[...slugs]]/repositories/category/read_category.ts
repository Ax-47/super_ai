import { inject, injectable } from 'tsyringe';
import { Category } from '../../domain';
import type { CategoryDatabaseRepository } from '../../infrastructures/category/database';
export interface ReadCategoryIdRepository {
  read(category_id: string): Promise<Category | null>
}

@injectable()
export class ReadCategoryIdRepositoryImpl implements ReadCategoryIdRepository {
  constructor(
    @inject("CategoryDatabaseRepository")
    private readonly database_repo: CategoryDatabaseRepository
  ) { }
  async read(category_id: string): Promise<Category | null> {
    return this.database_repo.read(category_id)
  }
}

