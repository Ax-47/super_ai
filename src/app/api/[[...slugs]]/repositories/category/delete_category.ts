import { DatabaseRepository } from '../infrastructures/database';
export interface DeleteCategoryRepository {
  delete(category_id: string): Promise<void>
}
export class DeleteCategoryRepositoryImpl implements DeleteCategoryRepository {
  private database: DatabaseRepository;
  constructor(database: DatabaseRepository) {
    this.database = database;
  }
  async delete(category_id: string): Promise<void> {
    const query = `
      DELETE FROM ${this.database.getKeyspace()}.Categories
      WHERE category_id = ?
    `;
    const params = [category_id];

    try {
      await this.database.getClient().execute(query, params, { prepare: true });
    } catch (err) {
      console.error("Failed to delete category:", {
        category_id,
        error: err,
      });
      throw new Error("DatabaseError: Unable to delete category.");
    }
  }
}

