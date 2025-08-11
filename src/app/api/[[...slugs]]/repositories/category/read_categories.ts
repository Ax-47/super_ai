import { Category } from '../../domain';
import { inject, injectable } from 'tsyringe';
import type { CategoryDatabaseRepository, Paginated } from '../../infrastructures/category/database';

export interface ReadCategoriesRepository {
  readAllPaginated(limit: number, pagingState?: string): Promise<Paginated<Category>>;
}

@injectable()
export class ReadCategoriesRepositoryImpl implements ReadCategoriesRepository {
  constructor(
    @inject("CategoryDatabaseRepository")
    private readonly database_repo: CategoryDatabaseRepository
  ) { }
  async readAllPaginated(limit: number, pagingState?: string): Promise<Paginated<Category>> {
    return this.database_repo.readAllPaginated(limit, pagingState)
  }
}

