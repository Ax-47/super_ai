import { UpdateCategory } from "../domain";
import { UpdateCategoryUsecasePrompt, } from "../dtos/category";
import { UpdateCategoryRepository } from "../repositories/update_category";
import { Usecase } from "./interface";

export class updateCategoryUsecase implements Usecase<UpdateCategoryUsecasePrompt, UpdateCategory> {
  update_category_repo: UpdateCategoryRepository;

  constructor(read_category_repo: UpdateCategoryRepository) {
    this.update_category_repo = read_category_repo;
  }

  async execute(cat: UpdateCategoryUsecasePrompt): Promise<UpdateCategory> {
    try {
      const res = await this.update_category_repo.update(cat.category_id, cat.category_name);
      return { category_id: res.category_id, category_name: res.category_name, updated_at: res.updated_at }
    } catch (err) {
      console.error("🚨 Usecase Error:", {
        input: cat.category_id,
        error: err,
      });
      throw new Error("UsecaseError: Failed to read category.");
    }
  }
}
