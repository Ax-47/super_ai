
import { inject, injectable } from 'tsyringe';
import { UpdateCategory } from '../../domain';
import type { CategoryDatabaseRepository } from '../../infrastructures/category/database';
export interface UpdateCategoryRepository {
  update(category_id: string, category_name: string): Promise<UpdateCategory>;
}
@injectable()
export class UpdateCategoryRepositoryImpl implements UpdateCategoryRepository {
  constructor(
    @inject("CategoryDatabaseRepository")
    private readonly database_repo: CategoryDatabaseRepository
  ) { }
  async update(category_id: string, category_name: string): Promise<UpdateCategory> {
    return this.database_repo.update(category_id, category_name)
  }
}
