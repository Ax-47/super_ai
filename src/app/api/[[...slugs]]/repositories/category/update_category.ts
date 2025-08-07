
import { UpdateCategory } from '../domain';
import { DatabaseRepository } from '../infrastructures/database';
export interface UpdateCategoryRepository {
  update(category_id: string, category_name: string): Promise<UpdateCategory>;
}
export class UpdateCategoryRepositoryImpl implements UpdateCategoryRepository {
  private database: DatabaseRepository;
  constructor(
    database: DatabaseRepository,
  ) {
    this.database = database;
  }
  async update(category_id: string, category_name: string): Promise<UpdateCategory> {
    const updated_at = new Date();

    const query = `
    UPDATE ${this.database.getKeyspace()}.Categories
    SET category_name = ?, updated_at = ?
    WHERE category_id = ?
  `;

    const params = [category_name, updated_at, category_id];

    const new_cat: UpdateCategory = {
      category_id,
      category_name,
      updated_at,
    };

    try {
      await this.database.getClient().execute(query, params, { prepare: true });
      return new_cat;
    } catch (err) {
      console.error("Failed to update category:", {
        category_id,
        category_name,
        error: err,
      });
      throw new Error("DatabaseError: Unable to update category.");
    }
  }
}
