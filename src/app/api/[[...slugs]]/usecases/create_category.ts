import { CreateCategoryUsecasePromptType, CreateCategoryUsecaseResponseType } from "../dtos/category";
import { CreateCategoryRepository } from "../repositories/create_category";
import { Usecase } from "./interface";

export class createCategoryUsecase implements Usecase<CreateCategoryUsecasePromptType, CreateCategoryUsecaseResponseType> {
  create_category_repo: CreateCategoryRepository;

  constructor(create_category_repo: CreateCategoryRepository) {
    this.create_category_repo = create_category_repo;
  }

  async execute(category: CreateCategoryUsecasePromptType): Promise<CreateCategoryUsecaseResponseType> {
    try {
      const res = await this.create_category_repo.create(category);
      return { category_name: res.category_name }
    } catch (err) {
      console.error("🚨 Usecase Error:", {
        input: category,
        error: err,
      });
      throw new Error("UsecaseError: Failed to create category.");
    }
  }
}
