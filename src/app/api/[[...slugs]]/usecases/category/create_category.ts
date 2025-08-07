import { CreateCategoryUsecasePromptType, CategoryUsecaseResponseType } from "../../dtos/category";
import { CreateCategoryRepository } from "../../repositories/category/create_category";
import { Usecase } from "../interface";

export class createCategoryUsecase implements Usecase<CreateCategoryUsecasePromptType, CategoryUsecaseResponseType> {
  create_category_repo: CreateCategoryRepository;

  constructor(create_category_repo: CreateCategoryRepository) {
    this.create_category_repo = create_category_repo;
  }

  async execute(category: CreateCategoryUsecasePromptType): Promise<CategoryUsecaseResponseType> {
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
