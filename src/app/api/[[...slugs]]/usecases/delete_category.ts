
import { DeleteCategoryRepository } from "../repositories/delete_category";
import { Usecase } from "./interface";

export class deleteCategoryUsecase implements Usecase<string, void> {
  delete_category_repo: DeleteCategoryRepository;
  constructor(read_category_repo: DeleteCategoryRepository) {
    this.delete_category_repo = read_category_repo;
  }
  async execute(category_id: string): Promise<void> {
    try {
      await this.delete_category_repo.delete(category_id);
      return
    } catch (err) {
      console.error("🚨 Usecase Error:", {
        input: category_id,
        error: err,
      });
      throw new Error("UsecaseError: Failed to read category.");
    }
  }
}
