import { CategoryUsecaseResponseType, } from "../../dtos/category";
import { ReadCategoryIdRepository } from "../../repositories/category/read_category";
import { Usecase } from "../interface";

export class readCategoryIdUsecase implements Usecase<string, CategoryUsecaseResponseType | null> {
  read_category_repo: ReadCategoryIdRepository;

  constructor(read_category_repo: ReadCategoryIdRepository) {
    this.read_category_repo = read_category_repo;
  }

  async execute(category_id: string): Promise<CategoryUsecaseResponseType | null> {
    try {
      const res = await this.read_category_repo.read(category_id);
      if (!res)
        return null
      return { category_id: res.category_id, category_name: res.category_name, created_at: res.created_at, updated_at: res.updated_at }
    } catch (err) {
      console.error("🚨 Usecase Error:", {
        input: category_id,
        error: err,
      });
      throw new Error("UsecaseError: Failed to read category.");
    }
  }
}
