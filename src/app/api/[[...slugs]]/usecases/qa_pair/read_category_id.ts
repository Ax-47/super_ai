import { inject, injectable } from "tsyringe";
import { CategoryResponseType } from "../../dtos/category";
import type { ReadCategoryIdRepository } from "../../repositories/category/read_category";
import { Usecase } from "../interface";

@injectable()
export class ReadCategoryIdUsecase implements Usecase<string, CategoryResponseType | null> {
  constructor(
    @inject("UpdateCategoryRepository") private read_category_repo: ReadCategoryIdRepository
  ) { }

  async execute(category_id: string): Promise<CategoryResponseType | null> {
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
