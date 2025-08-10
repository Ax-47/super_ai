import { inject, injectable } from "tsyringe";
import { CategoryResponseType, CreateCategoryBodyType } from "../../dtos/category";
import type { CreateCategoryRepository } from "../../repositories/category/create_category";
import { Usecase } from "../interface";

@injectable()
export class CreateCategoryUsecase implements Usecase<CreateCategoryBodyType, CategoryResponseType> {
  constructor(
    @inject("CreateCategoryRepository") private create_category_repo: CreateCategoryRepository
  ) { }
  async execute(category: CreateCategoryBodyType): Promise<CategoryResponseType> {
    try {
      const res = await this.create_category_repo.create(category);
      return { category_id: res.category_id, category_name: res.category_name, created_at: res.created_at, updated_at: res.updated_at }
    } catch (err) {
      console.error("🚨 Usecase Error:", {
        input: category,
        error: err,
      });
      throw new Error("UsecaseError: Failed to create category.");
    }
  }
}
