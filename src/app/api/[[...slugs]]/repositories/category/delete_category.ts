import { inject, injectable } from 'tsyringe';
import type { CategoryDatabaseRepository } from '../../infrastructures/category/database';
export interface DeleteCategoryRepository {
  delete(category_id: string): Promise<void>
}
@injectable()
export class DeleteCategoryRepositoryImpl implements DeleteCategoryRepository {
  constructor(
    @inject("CategoryDatabaseRepository")
    private readonly database_repo: CategoryDatabaseRepository
  ) { }
  async delete(category_id: string): Promise<void> {
    return this.database_repo.delete(category_id)
  }
}

