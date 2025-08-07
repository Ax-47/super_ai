import { CategoryResponseType } from "../../dtos/category";
import { ReadCategoriesRepository } from "../../repositories/category/read_categories";
import { Usecase } from "../interface";
interface Input {
  limit: number;
  pagingState?: string;
}
interface Output {
  categories: CategoryResponseType[];
  nextPagingState?: string;
}
export class ReadCategoriesUsecase implements Usecase<Input, Output> {
  private read_categories_repo: ReadCategoriesRepository;

  constructor(read_categories_repo: ReadCategoriesRepository) {
    this.read_categories_repo = read_categories_repo;
  }

  async execute({ limit, pagingState }: Input): Promise<Output> {
    try {
      const result = await this.read_categories_repo.readAllPaginated(limit, pagingState);

      return {
        categories: result.categories.map((c) => ({
          category_id: c.category_id,
          category_name: c.category_name,
          created_at: c.created_at,
          updated_at: c.updated_at,
        })),
        nextPagingState: result.nextPagingState,
      };
    } catch (err) {
      console.error("🚨 Usecase Error:", {
        input: { limit, pagingState },
        error: err,
      });
      throw new Error("UsecaseError: Failed to read categories.");
    }
  }
}
