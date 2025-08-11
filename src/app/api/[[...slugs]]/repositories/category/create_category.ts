import { v4 as uuidv4 } from 'uuid';
import { CreateCategory, Category } from '../../domain';
import { DatabaseRepository } from '../../infrastructures/database';
import { injectable } from "tsyringe";
export interface CreateCategoryRepository {
  create(cat: CreateCategory): Promise<Category>
}
@injectable()
export class CreateCategoryRepositoryImpl implements CreateCategoryRepository {
  constructor(private database: DatabaseRepository
  ) { }
  async create(cat: CreateCategory): Promise<Category> {
    const category_id = uuidv4();
    const created_at = new Date();
    const updated_at = created_at;

    const query = `
      INSERT INTO ${this.database.getKeyspace()}.Categories (
        category_id, category_name, created_at, updated_at
      ) VALUES (?, ?, ?, ?)
    `;
    const params = [category_id, cat.category_name, created_at, updated_at];
    const new_cat: Category = {
      category_id,
      category_name: cat.category_name,
      created_at,
      updated_at,
    };

    try {
      await this.database.getClient().execute(query, params, { prepare: true });
      return new_cat
    } catch (err) {
      console.error("Failed to insert category:", {
        category_id,
        category_name: cat.category_name,
        error: err,
      });
      throw new Error("DatabaseError: Unable to create category.");
    }
  }
}
