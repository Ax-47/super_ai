import { Category } from '../domain';
import { DatabaseRepository } from '../infrastructures/database';
export interface ReadCategoryRepository {
  read(category_id: string): Promise<Category | null>
}
export class ReadCategoryRepositoryImpl implements ReadCategoryRepository {
  private database: DatabaseRepository;
  constructor(database: DatabaseRepository) {
    this.database = database;
  }
  async read(category_id: string): Promise<Category | null> {
    const query = `
      SELECT category_id, category_name, created_at, updated_at
      FROM ${this.database.getKeyspace()}.Categories
      WHERE category_id = ?
    `;
    const params = [category_id];

    try {
      const result = await this.database.getClient().execute(query, params, { prepare: true });

      if (result.rowLength === 0) {
        return null;
      }

      const row = result.first();
      return {
        category_id: row.get('category_id').toString(),
        category_name: row.get('category_name'),
        created_at: row.get('created_at'),
        updated_at: row.get('updated_at'),
      };
    } catch (err) {
      console.error("Failed to read category:", {
        category_id,
        error: err,
      });
      throw new Error("DatabaseError: Unable to read category.");
    }
  }
}

