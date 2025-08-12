import { inject, injectable } from 'tsyringe';
import { DatabaseRepository } from '../database';
import { Category, CreateCategory, QAPair, QAPairInsert, UpdateCategory } from '../../domain';
import { v4 as uuidv4 } from 'uuid';
import { QueryOptions } from 'cassandra-driver';
import { types } from "cassandra-driver";
export interface Paginated<T> {
  qa_pairs: T[];
  nextPagingState?: string;
}
export interface QAPairDatabaseRepository {
  create(cat: CreateCategory): Promise<QAPair>;
  delete(category_id: string): Promise<void>;
  read_all_paginated(
    limit: number,
    pagingState?: string,
    categoryId?: string
  ): Promise<Paginated<QAPair>>
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
      types.Uuid.fromString(qa_pair_id),
      question,
      answer,
      types.Uuid.fromString(category_id),
      category_name,
      created_at,
      updated_at,
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
    await this.database_repo.getClient().execute(query, params, { prepare: true });
    return new_qa_pair
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

  async read_all_paginated(
    limit: number,
    pagingState?: string,
    categoryId?: string
  ): Promise<Paginated<QAPair>> {
    let query = `
    SELECT qa_pair_id, question, answer, category_id, category_name, created_at, updated_at
    FROM ${this.database_repo.getKeyspace()}.qa_pairs
  `;

    const params: (string | number | boolean | null)[] = [];

    if (categoryId) {
      query += ` WHERE category_id = ?`;
      params.push(categoryId);
    }

    try {
      const queryOptions: QueryOptions = {
        prepare: true,
        fetchSize: limit,
      };

      if (pagingState) {
        const decodedPagingState = Buffer.from(pagingState, 'base64');
        queryOptions.pageState = decodedPagingState.toString();
      }

      const result = await this.database_repo.getClient().execute(query, params, queryOptions);
      const qa_pairs: QAPair[] = result.rows.map((row) => ({
        qa_pair_id: row.get('qa_pair_id').toString(),
        question: row.get('question'),
        answer: row.get('answer'),
        category_id: row.get('category_id').toString(),
        category_name: row.get('category_name'),
        created_at: row.get('created_at'),
        updated_at: row.get('updated_at'),
      }));

      const nextPage = result.pageState
        ? Buffer.from(result.pageState).toString('base64')
        : undefined;

      return {
        qa_pairs,
        nextPagingState: nextPage,
      };
    } catch (err) {
      console.error("❌ Failed to read qa_pairs with paging:", { limit, pagingState, categoryId, error: err });
      throw new Error("DatabaseError: Unable to read qa_pairs with paging.");
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
