
import { inject, injectable } from "tsyringe";
import type { DeleteCategoryRepository } from "../../repositories/category/delete_category";
import { Usecase } from "../interface";

@injectable()
export class DeleteCategoryUsecase implements Usecase<string, void> {
  constructor(
    @inject("DeleteCategoryRepository") private delete_category_repo: DeleteCategoryRepository
  ) { }
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
