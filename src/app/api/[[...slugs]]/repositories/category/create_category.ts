import { CreateCategory, Category } from '../../domain';
import { inject, injectable } from "tsyringe";
import type { CategoryDatabaseRepository } from '../../infrastructures/category/database';
export interface CreateCategoryRepository {
  create(cat: CreateCategory): Promise<Category>
}
@injectable()
export class CreateCategoryRepositoryImpl implements CreateCategoryRepository {
  constructor(
    @inject("CategoryDatabaseRepository")
    private readonly database_repo: CategoryDatabaseRepository
  ) { }
  async create(cat: CreateCategory): Promise<Category> {
    return this.database_repo.create(cat)
  }
}
