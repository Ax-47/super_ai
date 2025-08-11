import { inject, injectable } from 'tsyringe';
import { DatabaseRepository } from '../database';
import { Category, CreateCategory, QAPair, QAPairInsert, UpdateCategory } from '../../domain';
import { v4 as uuidv4 } from 'uuid';
import { QueryOptions } from 'cassandra-driver';
export interface Paginated<T> {
  categories: T[];
  nextPagingState?: string;
}
export interface QAPairDatabaseRepository {
  create(cat: CreateCategory): Promise<QAPair>;
  delete(category_id: string): Promise<void>;
  readAllPaginated(limit: number, pagingState?: string): Promise<Paginated<Category>>;
  read(category_id: string): Promise<Category | null>
  update(category_id: string, category_name: string): Promise<UpdateCategory>;
}
@injectable()
export class QAPairDatabaseRepositoryImpl implements QAPairDatabaseRepository {
  constructor(
    @inject(DatabaseRepository) private database_repo: DatabaseRepository
  ) { }
  async create({ category_id, category_name, question, answer }: QAPairInsert): Promise<QAPair> {
    const qa_pair_id = uuidv4();
    const created_at = new Date();
    const updated_at = created_at;

    const query = `
  INSERT INTO ${this.database_repo.getKeyspace()}.qa_pairs (
    qa_pair_id, question, answer, category_id, category_name, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?)
`;
    const params = [
      qa_pair_id,
      question,
      answer,
      category_id,
      category_name,
      created_at,
      updated_at
    ];

    const new_qa_pair: QAPair = {
      qa_pair_id,
      question,
      answer,
      category_id,
      category_name,
      created_at,
      updated_at,
    };
    try {
      await this.database_repo.getClient().execute(query, params, { prepare: true });
      return new_qa_pair
    } catch (err) {
      console.error("Failed to insert category:", {
        category_id: new_qa_pair.category_id,
        category_name: new_qa_pair.category_name,
        error: err,
      });
      throw new Error("DatabaseError: Unable to create category.");
    }
  }

  async delete(category_id: string): Promise<void> {
    const query = `
      DELETE FROM ${this.database_repo.getKeyspace()}.Categories
      WHERE category_id = ?
    `;
    const params = [category_id];

    try {
      await this.database_repo.getClient().execute(query, params, { prepare: true });
    } catch (err) {
      console.error("Failed to delete category:", {
        category_id,
        error: err,
      });
      throw new Error("DatabaseError: Unable to delete category.");
    }
  }

  async readAllPaginated(limit: number, pagingState?: string): Promise<Paginated<Category>> {
    const query = `
    SELECT category_id, category_name, created_at, updated_at
    FROM ${this.database_repo.getKeyspace()}.Categories
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

      const result = await this.database_repo.getClient().execute(query, [], queryOptions);
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

  async read(category_id: string): Promise<Category | null> {
    const query = `
      SELECT category_id, category_name, created_at, updated_at
      FROM ${this.database_repo.getKeyspace()}.Categories
      WHERE category_id = ?
    `;
    const params = [category_id];

    try {
      const result = await this.database_repo.getClient().execute(query, params, { prepare: true });

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
  async update(category_id: string, category_name: string): Promise<UpdateCategory> {
    const updated_at = new Date();

    const query = `
    UPDATE ${this.database_repo.getKeyspace()}.Categories
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
      await this.database_repo.getClient().execute(query, params, { prepare: true });
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
