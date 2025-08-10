import { QueryOptions } from 'cassandra-driver';
import { DatabaseRepository, Paginated } from '../../infrastructures/database';
import { Category } from '../../domain';
import { inject, injectable } from 'tsyringe';

export interface ReadCategoriesRepository {
  readAllPaginated(limit: number, pagingState?: string): Promise<Paginated<Category>>;
}

@injectable()
export class ReadCategoriesRepositoryImpl implements ReadCategoriesRepository {
  constructor(@inject("DatabaseRepository") private database: DatabaseRepository
  ) { }
  async readAllPaginated(limit: number, pagingState?: string): Promise<Paginated<Category>> {
    const query = `
    SELECT category_id, category_name, created_at, updated_at
    FROM ${this.database.getKeyspace()}.Categories
  `;

    try {
      const queryOptions: QueryOptions = {
        prepare: true,
        fetchSize: limit,
      };

      if (pagingState) {
        const decodedPagingState = Buffer.from(pagingState, 'base64');
        queryOptions.pageState = decodedPagingState.toString(); // base64 -> original string
      }

      const result = await this.database.getClient().execute(query, [], queryOptions);

      const categories: Category[] = result.rows.map((row) => ({
        category_id: row.get('category_id').toString(),
        category_name: row.get('category_name'),
        created_at: row.get('created_at'),
        updated_at: row.get('updated_at'),
      }));

      const nextPage = result.pageState
        ? Buffer.from(result.pageState).toString('base64')
        : undefined;

      return {
        categories,
        nextPagingState: nextPage,
      };
    } catch (err) {
      console.error("❌ Failed to read categories with paging:", { limit, pagingState, error: err });
      throw new Error("DatabaseError: Unable to read categories with paging.");
    }
  }
}

